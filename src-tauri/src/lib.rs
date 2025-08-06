use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct LinkInfo {
    pub title: Option<String>,
    pub content: Option<String>,
    pub url: String,
    pub description: Option<String>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, fetch_link_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
