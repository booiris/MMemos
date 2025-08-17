use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::RwLock};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct StoreData {
    pub data: HashMap<String, String>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct AppState {
    pub data: RwLock<StoreData>,
}
