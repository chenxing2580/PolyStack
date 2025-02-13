import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { ElMessage } from 'element-plus'

export interface Settings {
  defaultInstallPath: string
  autoStart: boolean
  startWithSystem: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  updateCheck: 'never' | 'daily' | 'weekly' | 'monthly'
}

const defaultSettings: Settings = {
  defaultInstallPath: 'C:\\Program Files\\PolyStack',
  autoStart: false,
  startWithSystem: false,
  theme: 'system',
  language: 'zh-CN',
  updateCheck: 'weekly'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({ ...defaultSettings })
  const loading = ref(false)

  const loadSettings = async () => {
    loading.value = true
    try {
      const loadedSettings = await invoke<Settings>('load_settings')
      settings.value = loadedSettings
    } catch (error) {
      console.error('加载设置失败:', error)
      ElMessage.error('加载设置失败')
      settings.value = { ...defaultSettings }
    } finally {
      loading.value = false
    }
  }

  const saveSettings = async () => {
    loading.value = true
    try {
      await invoke('save_settings', { settings: settings.value })
      ElMessage.success('保存设置成功')
    } catch (error) {
      console.error('保存设置失败:', error)
      ElMessage.error('保存设置失败')
    } finally {
      loading.value = false
    }
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
  }

  const updateSettings = (updates: Partial<Settings>) => {
    settings.value = { ...settings.value, ...updates }
  }

  // 初始加载设置
  loadSettings()

  return {
    settings,
    loading,
    loadSettings,
    saveSettings,
    resetSettings,
    updateSettings
  }
}) 