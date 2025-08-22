use std::sync::{Arc, atomic::AtomicBool};

use dashmap::DashMap;
use parking_lot::RwLock;
use serde::{Deserialize, Serialize};

use crate::api::models::{V1MemoRelation, V1Reaction, V1Resource};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct StoreData {
    pub data: DashMap<String, String>,
    pub server_url: Arc<RwLock<String>>,
    pub user_name: Arc<RwLock<String>>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct Memo {
    pub name: String,
    #[serde(default)]
    pub create_time: String,
    #[serde(default)]
    pub update_time: String,
    #[serde(default)]
    pub display_time: String,
    #[serde(default)]
    pub visibility: String,
    #[serde(default)]
    pub content: String,
    #[serde(default)]
    pub pinned: bool,
    pub resources: Vec<V1Resource>,
    pub relations: Vec<V1MemoRelation>,
    pub reactions: Vec<V1Reaction>,
    pub tags: Vec<String>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct MemoDataCache {
    pub memo: Memo,
    #[serde(skip)]
    pub is_updated: AtomicBool,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct MemoMeta {
    pub name: String,
    pub create_time: String,
    pub update_time: String,
    pub display_time: String,
    pub visibility: String,
    pub pinned: bool,
    pub tags: Vec<String>,
}

#[derive(Debug, Default)]
pub struct CacheData {
    pub memos: DashMap<String, MemoDataCache>,
    pub all_memo_meta: DashMap<String, MemoMeta>,
    pub is_all_memo_meta_updated: AtomicBool,
}

#[derive(Debug, Default)]
pub struct AppState {
    pub store: StoreData,
    pub cache: Arc<CacheData>,
}
