import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { ElMessage } from 'element-plus'

export interface WebConfig {
  type: 'nginx' | 'apache'
  port: number
  config: string
}

export interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'mongodb'
  port: number
  username: string
  password: string
  config: string
}

export interface CacheConfig {
  type: 'redis' | 'memcached'
  port: number
  maxMemory: number
  config: string
}

const defaultWebConfig: WebConfig = {
  type: 'nginx',
  port: 80,
  config: '# Nginx 配置\nserver {\n  listen 80;\n  server_name localhost;\n}'
}

const defaultDatabaseConfig: DatabaseConfig = {
  type: 'mysql',
  port: 3306,
  username: 'root',
  password: '',
  config: '# MySQL 配置\n[mysqld]\nport=3306\nmax_connections=100'
}

const defaultCacheConfig: CacheConfig = {
  type: 'redis',
  port: 6379,
  maxMemory: 128,
  config: '# Redis 配置\nport 6379\nmaxmemory 128mb'
}

export const useServiceStore = defineStore('service', () => {
  const webConfig = ref<WebConfig>({ ...defaultWebConfig })
  const databaseConfig = ref<DatabaseConfig>({ ...defaultDatabaseConfig })
  const cacheConfig = ref<CacheConfig>({ ...defaultCacheConfig })
  const loading = ref(false)

  const loadConfigs = async () => {
    loading.value = true
    try {
      // TODO: 从后端加载配置
      // const configs = await invoke('load_service_configs')
      // webConfig.value = configs.web
      // databaseConfig.value = configs.database
      // cacheConfig.value = configs.cache
    } catch (error) {
      console.error('加载服务配置失败:', error)
      ElMessage.error('加载服务配置失败')
    } finally {
      loading.value = false
    }
  }

  const saveWebConfig = async () => {
    loading.value = true
    try {
      // TODO: 保存 Web 服务配置
      // await invoke('save_web_config', { config: webConfig.value })
      ElMessage.success('Web 服务配置保存成功')
    } catch (error) {
      console.error('保存 Web 服务配置失败:', error)
      ElMessage.error('保存 Web 服务配置失败')
    } finally {
      loading.value = false
    }
  }

  const saveDatabaseConfig = async () => {
    loading.value = true
    try {
      // TODO: 保存数据库配置
      // await invoke('save_database_config', { config: databaseConfig.value })
      ElMessage.success('数据库配置保存成功')
    } catch (error) {
      console.error('保存数据库配置失败:', error)
      ElMessage.error('保存数据库配置失败')
    } finally {
      loading.value = false
    }
  }

  const saveCacheConfig = async () => {
    loading.value = true
    try {
      // TODO: 保存缓存配置
      // await invoke('save_cache_config', { config: cacheConfig.value })
      ElMessage.success('缓存配置保存成功')
    } catch (error) {
      console.error('保存缓存配置失败:', error)
      ElMessage.error('保存缓存配置失败')
    } finally {
      loading.value = false
    }
  }

  const restartService = async (type: 'web' | 'database' | 'cache') => {
    loading.value = true
    try {
      // TODO: 重启服务
      // await invoke('restart_service', { type })
      ElMessage.success(`${type} 服务重启成功`)
    } catch (error) {
      console.error(`重启 ${type} 服务失败:`, error)
      ElMessage.error(`重启 ${type} 服务失败`)
    } finally {
      loading.value = false
    }
  }

  // 初始加载配置
  loadConfigs()

  return {
    webConfig,
    databaseConfig,
    cacheConfig,
    loading,
    loadConfigs,
    saveWebConfig,
    saveDatabaseConfig,
    saveCacheConfig,
    restartService
  }
}) 