use crate::store::model::{AppState, StoreData};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State};

pub mod memo;
pub mod model;

pub fn load_store_data(app: &AppHandle) -> Result<StoreData, String> {
    let store_path = get_store_path(app)?;

    if !store_path.exists() {
        log::info!("Store file does not exist, creating default store data");
        return Ok(StoreData::default());
    }

    let content = std::fs::read_to_string(&store_path)
        .map_err(|e| format!("Failed to read store file: {}", e))?;

    let store_data: StoreData = serde_json::from_str(&content)
        .map_err(|e| {
            log::warn!("Failed to parse store file, using default: {}", e);
            StoreData::default()
        })
        .unwrap_or_default();

    log::info!(
        "Successfully loaded store data with {} entries",
        store_data.data.len()
    );
    Ok(store_data)
}

fn get_store_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    // Ensure directory exists
    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;

    Ok(app_data_dir.join("store.json"))
}

async fn async_get_store_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    // Ensure directory exists
    tokio::fs::create_dir_all(&app_data_dir)
        .await
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;

    Ok(app_data_dir.join("store.json"))
}

pub async fn save_store_data(app: &AppHandle, store_data: &StoreData) -> Result<(), String> {
    let store_path = async_get_store_path(app).await?;

    let content = serde_json::to_string(store_data)
        .map_err(|e| format!("Failed to serialize store data: {}", e))?;

    tokio::fs::write(&store_path, content)
        .await
        .map_err(|e| format!("Failed to write store file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn store_data(
    app: AppHandle,
    state: State<'_, AppState>,
    key: String,
    data: String,
) -> Result<(), String> {
    log::trace!("[store_data] key: {}", key);

    if key == "serverUrl" {
        *state.store.server_url.write() = data.clone();
    } else if key == "userName" {
        *state.store.user_name.write() = data.clone();
    }

    state.store.data.insert(key, data);
    save_store_data(&app, &state.store).await?;

    Ok(())
}

#[tauri::command]
pub async fn get_data(state: State<'_, AppState>, key: String) -> Result<Option<String>, String> {
    log::trace!("[store_data] key: {}", key);
    Ok(state.store.data.get(&key).map(|v| v.clone()))
}

#[tauri::command]
pub async fn remove_data(
    app: AppHandle,
    state: State<'_, AppState>,
    keys: Vec<String>,
) -> Result<(), String> {
    log::info!("[remove_data] keys: {:?}", keys);

    if keys.contains(&"serverUrl".to_string()) {
        *state.store.server_url.write() = "".to_string();
    }
    if keys.contains(&"userName".to_string()) {
        *state.store.user_name.write() = "".to_string();
    }

    for key in keys {
        state.store.data.remove(&key);
    }

    save_store_data(&app, &state.store).await?;

    Ok(())
}
