use std::{
    path::{Path, PathBuf},
    sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
    },
};

use crate::{
    api::models::V1State,
    store::model::{AppState, CacheData, Memo, MemoDataCache, MemoMeta},
    utils::path::sanitize_file_name,
};
use dashmap::DashMap;
use parking_lot::RwLock;
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn store_memo(
    state: State<'_, AppState>,
    memo_name: String,
    memo: Memo,
) -> Result<(), String> {
    log::trace!("[store_memo] memo: {}", memo_name);

    let memo_meta = MemoMeta {
        name: memo_name.clone(),
        create_time: memo.create_time.clone(),
        update_time: memo.update_time.clone(),
        display_time: memo.display_time.clone(),
        visibility: memo.visibility.clone(),
        pinned: memo.pinned,
        tags: memo.tags.clone(),
        state: memo.state,
    };

    let should_update = match state.cache.all_memo_meta.get(&memo_name) {
        Some(existing) => existing.value() != &memo_meta,
        None => true,
    };

    if should_update {
        state
            .cache
            .all_memo_meta
            .insert(memo_name.clone(), memo_meta);
        state
            .cache
            .is_all_memo_meta_updated
            .store(true, Ordering::Relaxed);
    }

    let should_update = match state.cache.memos.get(&memo_name) {
        Some(existing) => existing.value().memo != memo,
        None => true,
    };

    if should_update {
        state.cache.memos.insert(
            memo_name,
            MemoDataCache {
                memo,
                is_updated: AtomicBool::new(true),
            },
        );
    }

    Ok(())
}

#[tauri::command]
pub async fn get_memo(
    app: AppHandle,
    state: State<'_, AppState>,
    memo_name: String,
) -> Result<Option<Memo>, String> {
    log::trace!("[get_memo] memo: {}", memo_name);

    if let Some(data) = state.cache.memos.get(&memo_name) {
        return Ok(Some(data.memo.clone()));
    }

    let path = get_memo_cache_path(
        &app.path()
            .app_cache_dir()
            .map_err(|e| format!("Failed to get app cache dir: {}", e))?,
        &state.store.server_url.read(),
        &state.store.user_name.read(),
    )
    .map_err(|e| format!("Failed to get memo cache path: {}", e))?
    .join("memos")
    .join("memo_".to_string() + &sanitize_file_name(&memo_name) + ".json");

    if !path.exists() {
        return Ok(None);
    }

    let content = tokio::fs::read_to_string(&path)
        .await
        .map_err(|e| format!("Failed to read memo cache: {}", e))?;

    let memo: Memo =
        serde_json::from_str(&content).map_err(|e| format!("Failed to parse memo cache: {}", e))?;

    state.cache.memos.insert(
        memo_name,
        MemoDataCache {
            memo: memo.clone(),
            is_updated: AtomicBool::new(false),
        },
    );

    Ok(Some(memo))
}

#[tauri::command]
pub async fn delete_memo(
    app: AppHandle,
    state: State<'_, AppState>,
    memo_name: String,
) -> Result<(), String> {
    log::info!("[delete_memo] memo: {:?}", memo_name);
    state.cache.all_memo_meta.remove(&memo_name);
    state
        .cache
        .is_all_memo_meta_updated
        .store(true, Ordering::Relaxed);

    state.cache.memos.remove(&memo_name);

    let path = get_memo_cache_path(
        &app.path()
            .app_cache_dir()
            .map_err(|e| format!("Failed to get app cache dir: {}", e))?,
        &state.store.server_url.read(),
        &state.store.user_name.read(),
    )
    .map_err(|e| format!("Failed to get memo cache path: {}", e))?
    .join("memos")
    .join("memo_".to_string() + &sanitize_file_name(&memo_name) + ".json");

    tokio::fs::remove_file(&path)
        .await
        .map_err(|e| {
            log::error!(
                "Failed to delete memo cache, memo: {}, path: {}, error: {}",
                memo_name,
                path.display(),
                e
            );
        })
        .ok();

    Ok(())
}

#[tauri::command]
pub async fn get_memo_list(
    app: AppHandle,
    state: State<'_, AppState>,
    offset: usize,
    limit: usize,
    tag: String,
    pinned: bool,
    archived: bool,
) -> Result<Option<Vec<Memo>>, String> {
    log::trace!(
        "[get_memo_list] offset: {}, limit: {}, tag: {:?}, pinned: {}, archived: {}",
        offset,
        limit,
        tag,
        pinned,
        archived
    );
    let mut memo_list = state
        .cache
        .all_memo_meta
        .iter()
        .filter(|x| x.pinned == pinned)
        .filter(|x| {
            if !tag.is_empty() {
                x.tags.contains(&tag)
            } else {
                true
            }
        })
        .filter(|x| {
            if archived {
                x.state == V1State::Archived
            } else {
                x.state == V1State::Normal
            }
        })
        .collect::<Vec<_>>();

    memo_list.sort_by(|a, b| b.display_time.cmp(&a.display_time));
    let memo_meta_list = memo_list
        .iter()
        .skip(offset)
        .take(limit)
        .map(|x| x.name.clone())
        .collect::<Vec<_>>();
    if memo_meta_list.is_empty() {
        return Ok(None);
    }

    let mut memo_list = Vec::with_capacity(memo_meta_list.len());
    for memo_meta in memo_meta_list {
        let m = get_memo(app.clone(), state.clone(), memo_meta).await?;
        if let Some(m) = m {
            memo_list.push(m);
        }
    }

    Ok(Some(memo_list))
}

fn get_memo_cache_path(
    cache_path: &Path,
    server_url: &str,
    user_name: &str,
) -> Result<PathBuf, String> {
    if server_url.is_empty() || user_name.is_empty() {
        return Err("Host info not found, maybe not login".to_string());
    }

    let path = sanitize_file_name(server_url) + "_" + &sanitize_file_name(user_name);

    Ok(cache_path.join(path))
}

pub fn warm_up_memo_cache(app: &AppHandle, state: State<'_, AppState>) {
    tauri::async_runtime::block_on(async {
        let memo = get_memo_list(
            app.clone(),
            state.clone(),
            0,
            10,
            "".to_string(),
            false,
            false,
        );
        let pinned_memo = get_memo_list(
            app.clone(),
            state.clone(),
            0,
            10,
            "".to_string(),
            true,
            false,
        );
        let (memo, pinned_memo) = tokio::join!(memo, pinned_memo);
        if let Err(e) = memo {
            log::error!("Failed to warm up memo cache: {}", e);
        }
        if let Err(e) = pinned_memo {
            log::error!("Failed to warm up pinned memo cache: {}", e);
        }
    });
}

pub fn load_memo_meta_data(
    app: &AppHandle,
    server_url: &str,
    user_name: &str,
) -> Result<DashMap<String, MemoMeta>, String> {
    log::debug!("load_memo_meta_data");
    let app_cache_dir = get_memo_cache_path(
        &app.path()
            .app_cache_dir()
            .map_err(|e| format!("Failed to get app cache dir: {}", e))?,
        server_url,
        user_name,
    )
    .map_err(|e| format!("Failed to get memo metadata cache path: {}", e))?;
    let path = app_cache_dir.join("memos").join("all_memo_meta.json");

    if !path.exists() {
        return Ok(DashMap::new());
    }

    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read get memo metadata cache: {}", e))?;

    let memo_meta: DashMap<String, MemoMeta> = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse get memo metadata cache: {}", e))?;

    Ok(memo_meta)
}

pub fn persist_memo_cache(
    cache_path: PathBuf,
    cache: Arc<CacheData>,
    server_url: Arc<RwLock<String>>,
    user_name: Arc<RwLock<String>>,
) {
    tauri::async_runtime::spawn(async move {
        loop {
            tokio::time::sleep(std::time::Duration::from_secs(1)).await;

            let server_url_clone = server_url.read().clone();
            let user_name_clone = user_name.read().clone();

            match get_memo_cache_path(&cache_path, &server_url_clone, &user_name_clone) {
                Ok(memo_cache_dir) => {
                    let memo_cache_dir = memo_cache_dir.join("memos");
                    if let Err(e) = tokio::fs::create_dir_all(&memo_cache_dir)
                        .await
                        .map_err(|e| format!("Failed to create memo cache dir: {}", e))
                    {
                        log::error!(
                            "Failed to create memo cache dir, path: {}, error: {}",
                            memo_cache_dir.display(),
                            e
                        );
                        continue;
                    }

                    if cache.is_all_memo_meta_updated.load(Ordering::Relaxed) {
                        cache
                            .is_all_memo_meta_updated
                            .store(false, Ordering::Relaxed);

                        let path = memo_cache_dir.join("all_memo_meta.json");

                        let run = async {
                            let cache =
                                serde_json::to_string(&cache.all_memo_meta).map_err(|e| {
                                    format!("Failed to serialize all_memo_meta cache: {}", e)
                                })?;

                            tokio::fs::write(&path, cache).await.map_err(|e| {
                                format!("Failed to write all_memo_meta cache: {}", e)
                            })?;

                            Ok::<(), String>(())
                        };

                        if let Err(e) = run.await {
                            log::error!(
                                "Failed to persist all_memo_meta, path: {}, error: {}",
                                path.display(),
                                e
                            );
                        }
                    }

                    for v in cache.memos.iter() {
                        if v.is_updated.load(Ordering::Relaxed) {
                            v.is_updated.store(false, Ordering::Relaxed);

                            let path = memo_cache_dir.join(
                                "memo_".to_string() + &sanitize_file_name(&v.memo.name) + ".json",
                            );

                            let run = async {
                                let cache = serde_json::to_string(&v.memo).map_err(|e| {
                                    format!("Failed to serialize memo cache: {}", e)
                                })?;

                                tokio::fs::write(&path, cache)
                                    .await
                                    .map_err(|e| format!("Failed to write memo cache: {}", e))?;

                                Ok::<(), String>(())
                            };

                            if let Err(e) = run.await {
                                log::error!(
                                    "Failed to persist memo cache, memo: {}, path: {}, error: {}",
                                    v.memo.name,
                                    path.display(),
                                    e
                                )
                            }
                        }
                    }
                }
                Err(e) => {
                    log::error!("Failed to get memo cache path: {}", e);
                }
            }
        }
    });
}
