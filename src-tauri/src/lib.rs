use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::{
    sync::{Arc, atomic::Ordering},
    time::Duration,
};
use store::model::{AppState, StoreData};
use tauri::{AppHandle, Manager, State};

use crate::store::{
    memo::{self, persist_memo_cache},
    model::CacheData,
};
mod api;
mod store;
mod utils;

#[derive(Debug, Serialize, Deserialize)]
pub struct LinkInfo {
    pub title: Option<String>,
    pub content: Option<String>,
    pub url: String,
    pub description: Option<String>,
}

#[tauri::command]
async fn fetch_link_info(url: String) -> Result<LinkInfo, String> {
    let parsed_url = url::Url::parse(&url).map_err(|e| format!("Invalid URL: {}", e))?;

    if parsed_url.scheme() != "http" && parsed_url.scheme() != "https" {
        return Err("Only HTTP and HTTPS URLs are supported".to_string());
    }

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .user_agent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch URL: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }

    let html = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    let document = scraper::Html::parse_document(&html);

    let title_selector = scraper::Selector::parse("title").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string())
        .filter(|t| !t.is_empty());

    let meta_desc_selector =
        scraper::Selector::parse("meta[name='description'], meta[property='og:description']")
            .unwrap();
    let description = document
        .select(&meta_desc_selector)
        .next()
        .and_then(|el| el.value().attr("content"))
        .map(|content| content.trim().to_string())
        .filter(|d| !d.is_empty());

    let content_selectors = [
        "article",
        "main",
        ".content",
        ".post-content",
        ".article-content",
        "p",
    ];

    let mut content = String::new();
    for selector_str in &content_selectors {
        if let Ok(selector) = scraper::Selector::parse(selector_str) {
            let elements: Vec<_> = document.select(&selector).take(3).collect();
            if !elements.is_empty() {
                for element in elements {
                    let text = element.text().collect::<String>();
                    let clean_text = text.trim();
                    if clean_text.len() > 50 {
                        content.push_str(clean_text);
                        content.push_str("\n\n");
                        if content.len() > 500 {
                            break;
                        }
                    }
                }
                if !content.is_empty() {
                    break;
                }
            }
        }
    }

    let final_content = if content.trim().is_empty() {
        None
    } else {
        Some(content.trim().chars().take(500).collect::<String>())
    };

    Ok(LinkInfo {
        title,
        content: final_content,
        url: url.clone(),
        description,
    })
}

#[tauri::command]
async fn logout(app: AppHandle, state: State<'_, AppState>) -> Result<(), ()> {
    *state.store.server_url.write() = "".to_string();
    *state.store.user_name.write() = "".to_string();
    state.store.data.clear();
    if let Err(e) = store::save_store_data(&app, &state.store).await {
        log::error!("Failed to clean store data: {}", e);
    }

    // not clear logout user cache data
    state
        .cache
        .is_all_memo_meta_updated
        .store(false, Ordering::Relaxed);
    state.cache.all_memo_meta.clear();
    state.cache.memos.clear();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let store = store::load_store_data(app.handle()).unwrap_or_else(|e| {
                log::error!("Failed to load store data: {}, using default", e);
                StoreData::default()
            });

            let server_url = store.server_url.clone();
            let user_name = store.user_name.clone();

            let memo_meta =
                memo::load_memo_meta_data(app.handle(), &server_url.read(), &user_name.read())
                    .unwrap_or_else(|e| {
                        log::error!("Failed to load memo data: {}, using default", e);
                        DashMap::new()
                    });
            let cache = CacheData {
                all_memo_meta: memo_meta,
                ..Default::default()
            };

            let cache = Arc::new(cache);
            let app_state = AppState {
                store,
                cache: cache.clone(),
            };

            app.manage(app_state);

            persist_memo_cache(
                app.path()
                    .app_cache_dir()
                    .expect("Failed to get app cache dir"),
                cache.clone(),
                server_url,
                user_name,
            );

            Ok(())
        })
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .max_file_size(50_000 /* bytes */)
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "[{} {} {}:{}] {}",
                        record.level(),
                        record.target(),
                        record.file().unwrap_or("unknown"),
                        record.line().unwrap_or(0),
                        message
                    ))
                })
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            fetch_link_info,
            logout,
            store::store_data,
            store::get_data,
            store::remove_data,
            store::memo::store_memo,
            store::memo::get_memo,
            store::memo::delete_memo,
            store::memo::get_memo_list,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
