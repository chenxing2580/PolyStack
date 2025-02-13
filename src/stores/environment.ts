import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { ElMessage } from 'element-plus'

export interface Environment {
  id: number
  name: string
  env_type: string
  version: string
  path: string
  port: number
  status: 'running' | 'stopped'
  auto_start: boolean
}

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<Environment[]>([])
  const loading = ref(false)

  const loadEnvironments = async () => {
    loading.value = true
    try {
      environments.value = await invoke<Environment[]>('get_environments')
    } catch (error) {
      console.error('加载环境列表失败:', error)
      ElMessage.error('加载环境列表失败')
    } finally {
      loading.value = false
    }
  }

  const addEnvironment = async (env: Omit<Environment, 'id' | 'status' | 'auto_start'>) => {
    loading.value = true
    try {
      const newEnv = await invoke<Environment>('add_environment', {
        name: env.name,
        envType: env.env_type,
        version: env.version,
        path: env.path,
        port: env.port
      })
      environments.value.push(newEnv)
      ElMessage.success('添加环境成功')
    } catch (error) {
      console.error('添加环境失败:', error)
      ElMessage.error('添加环境失败')
    } finally {
      loading.value = false
    }
  }

  const removeEnvironment = async (id: number) => {
    loading.value = true
    try {
      await invoke('remove_environment', { id })
      const index = environments.value.findIndex(env => env.id === id)
      if (index !== -1) {
        environments.value.splice(index, 1)
      }
      ElMessage.success('删除环境成功')
    } catch (error) {
      console.error('删除环境失败:', error)
      ElMessage.error('删除环境失败')
    } finally {
      loading.value = false
    }
  }

  const startEnvironment = async (id: number) => {
    loading.value = true
    try {
      await invoke('start_environment', { id })
      const env = environments.value.find(env => env.id === id)
      if (env) {
        env.status = 'running'
      }
      ElMessage.success('启动环境成功')
    } catch (error) {
      console.error('启动环境失败:', error)
      ElMessage.error('启动环境失败')
    } finally {
      loading.value = false
    }
  }

  const stopEnvironment = async (id: number) => {
    loading.value = true
    try {
      await invoke('stop_environment', { id })
      const env = environments.value.find(env => env.id === id)
      if (env) {
        env.status = 'stopped'
      }
      ElMessage.success('停止环境成功')
    } catch (error) {
      console.error('停止环境失败:', error)
      ElMessage.error('停止环境失败')
    } finally {
      loading.value = false
    }
  }

  // 初始加载环境列表
  loadEnvironments()

  return {
    environments,
    loading,
    loadEnvironments,
    addEnvironment,
    removeEnvironment,
    startEnvironment,
    stopEnvironment
  }
}) 