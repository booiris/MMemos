use crate::store::model::{AppState, StoreData};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State};

pub mod model;

pub fn load_store_data(app: &AppHandle) -> Result<StoreData, String> {
    let store_path = get_store_path(app)?;

    if !store_path.exists() {
        log::info!("Store file does not exist, creating default store data");
        let store_data = StoreData::default();
        let content = serde_json::to_string(&store_data)
            .map_err(|e| format!("Failed to serialize default store data: {}", e))?;
        log::info!(
            "Writing default store data to file: {}",
            store_path.display()
        );
        std::fs::write(&store_path, content)
            .map_err(|e| format!("Failed to write default store file: {}", e))?;
        return Ok(store_data);
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

fn save_store_data(app: &AppHandle, store_data: &StoreData) -> Result<(), String> {
    let store_path = get_store_path(app)?;

    let content = serde_json::to_string(store_data)
        .map_err(|e| format!("Failed to serialize store data: {}", e))?;

    std::fs::write(&store_path, content)
        .map_err(|e| format!("Failed to write store file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn store_data(
    app: AppHandle,
    state: State<'_, AppState>,
    key: String,
    data: String,
) -> Result<(), String> {
    log::trace!("[store_data] key: {}", key);
    let mut store_data = state.data.write().map_err(|e| {
        log::error!("[store_data] Failed to write store data: {}", e);
        "[store_data] ".to_string() + &e.to_string()
    })?;
    store_data.data.insert(key, data);

    save_store_data(&app, &store_data)?;

    Ok(())
}

#[tauri::command]
pub fn get_data(state: State<'_, AppState>, key: String) -> Result<Option<String>, String> {
    log::trace!("[store_data] key: {}", key);
    let store_data = state.data.read().map_err(|e| {
        log::error!("[get_data] Failed to read store data: {}", e);
        "[get_data]".to_string() + &e.to_string()
    })?;
    Ok(store_data.data.get(&key).cloned())
}

#[tauri::command]
pub fn remove_data(
    app: AppHandle,
    state: State<'_, AppState>,
    keys: Vec<String>,
) -> Result<(), String> {
    log::info!("[remove_data] keys: {:?}", keys);
    let mut store_data = state.data.write().map_err(|e| {
        log::error!("[remove_data] Failed to write store data: {}", e);
        "[remove_data] ".to_string() + &e.to_string()
    })?;
    for key in keys {
        store_data.data.remove(&key);
    }

    save_store_data(&app, &store_data)?;

    Ok(())
}
