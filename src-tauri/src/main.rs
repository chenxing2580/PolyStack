// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::Manager;

mod environment;
use environment::{Environment, EnvironmentManager};

mod system_info;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    default_install_path: String,
    auto_start: bool,
    start_with_system: bool,
    theme: String,
    language: String,
    update_check: String,
}

struct AppState {
    env_manager: Mutex<EnvironmentManager>,
}

#[tauri::command]
async fn get_environments(state: tauri::State<'_, AppState>) -> Result<Vec<Environment>, String> {
    let manager = state.env_manager.lock().unwrap();
    manager.get_environments()
}

#[tauri::command]
async fn add_environment(
    state: tauri::State<'_, AppState>,
    name: String,
    env_type: String,
    version: String,
    path: String,
    port: u16,
) -> Result<Environment, String> {
    let manager = state.env_manager.lock().unwrap();
    manager.add_environment(name, env_type, version, path, port)
}

#[tauri::command]
async fn remove_environment(state: tauri::State<'_, AppState>, id: i32) -> Result<(), String> {
    let manager = state.env_manager.lock().unwrap();
    manager.remove_environment(id)
}

#[tauri::command]
async fn start_environment(state: tauri::State<'_, AppState>, id: i32) -> Result<(), String> {
    let manager = state.env_manager.lock().unwrap();
    manager.start_environment(id)
}

#[tauri::command]
async fn stop_environment(state: tauri::State<'_, AppState>, id: i32) -> Result<(), String> {
    let manager = state.env_manager.lock().unwrap();
    manager.stop_environment(id)
}

#[tauri::command]
async fn load_settings() -> Result<Settings, String> {
    // TODO: 从配置文件加载设置
    Ok(Settings {
        default_install_path: "C:\\Program Files\\PolyStack".to_string(),
        auto_start: false,
        start_with_system: false,
        theme: "system".to_string(),
        language: "zh-CN".to_string(),
        update_check: "weekly".to_string(),
    })
}

#[tauri::command]
async fn save_settings(settings: Settings) -> Result<(), String> {
    // TODO: 保存设置到配置文件
    println!("保存设置: {:?}", settings);
    Ok(())
}

fn main() {
    let app_state = AppState {
        env_manager: Mutex::new(EnvironmentManager::new()),
    };

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            get_environments,
            add_environment,
            remove_environment,
            start_environment,
            stop_environment,
            load_settings,
            save_settings,
            system_info::get_system_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
