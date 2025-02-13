use serde::Serialize;
use sysinfo::{System, Disks, CpuRefreshKind, RefreshKind, MemoryRefreshKind, ProcessRefreshKind};
use std::collections::HashMap;

#[derive(Serialize)]
pub struct SystemStatus {
    cpu_usage: f32,
    memory_total: u64,
    memory_used: u64,
    disk_total: u64,
    disk_used: u64,
    services: HashMap<String, bool>,
}

#[tauri::command]
pub fn get_system_status() -> SystemStatus {
    let refresh_kind = RefreshKind::new()
        .with_cpu(CpuRefreshKind::everything())
        .with_memory(MemoryRefreshKind::everything())
        .with_processes(ProcessRefreshKind::everything());
    let mut sys = System::new_with_specifics(refresh_kind);
    sys.refresh_all();

    // 获取 CPU 使用率
    let cpu_usage = sys.global_cpu_info().cpu_usage();

    // 获取内存信息
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();

    // 获取磁盘信息
    let disks = Disks::new_with_refreshed_list();
    let mut disk_total = 0;
    let mut disk_used = 0;
    for disk in disks.list() {
        disk_total += disk.total_space();
        disk_used += disk.total_space() - disk.available_space();
    }

    // 检查服务状态
    let mut services = HashMap::new();
    for process in sys.processes().values() {
        match process.name().to_lowercase().as_str() {
            "nginx" | "nginx.exe" => services.insert("nginx".to_string(), true),
            "httpd" | "apache2" | "httpd.exe" => services.insert("apache".to_string(), true),
            "mysqld" | "mysqld.exe" => services.insert("mysql".to_string(), true),
            "php-fpm" | "php-fpm.exe" => services.insert("php".to_string(), true),
            _ => continue,
        };
    }

    // 如果服务没有运行，设置为 false
    for service in ["nginx", "apache", "mysql", "php"] {
        services.entry(service.to_string()).or_insert(false);
    }

    SystemStatus {
        cpu_usage,
        memory_total,
        memory_used,
        disk_total,
        disk_used,
        services,
    }
} 