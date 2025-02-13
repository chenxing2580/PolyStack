// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Builder;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
