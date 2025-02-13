import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { ElMessage } from 'element-plus'

export interface SystemInfo {
  os: string
  cpu: string
  memory: string
  disk: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

export interface Activity {
  id: number
  type: 'success' | 'warning' | 'info' | 'error'
  content: string
  time: string
}

export const useSystemStore = defineStore('system', () => {
  const systemInfo = ref<SystemInfo>({
    os: '',
    cpu: '',
    memory: '',
    disk: '',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0
  })

  const activities = ref<Activity[]>([])
  const loading = ref(false)

  const loadSystemInfo = async () => {
    loading.value = true
    try {
      // TODO: 从后端加载系统信息
      // const info = await invoke('get_system_info')
      // systemInfo.value = info
    } catch (error) {
      console.error('加载系统信息失败:', error)
      ElMessage.error('加载系统信息失败')
    } finally {
      loading.value = false
    }
  }

  const loadActivities = async () => {
    loading.value = true
    try {
      // TODO: 从后端加载活动记录
      // const records = await invoke('get_activities')
      // activities.value = records
    } catch (error) {
      console.error('加载活动记录失败:', error)
      ElMessage.error('加载活动记录失败')
    } finally {
      loading.value = false
    }
  }

  const addActivity = (activity: Omit<Activity, 'id' | 'time'>) => {
    const id = activities.value.length + 1
    const time = new Date().toLocaleString()
    activities.value.unshift({ ...activity, id, time })

    // 保持最多显示 50 条记录
    if (activities.value.length > 50) {
      activities.value.pop()
    }
  }

  const clearActivities = () => {
    activities.value = []
  }

  // 定期更新系统信息
  const startMonitoring = () => {
    loadSystemInfo()
    const interval = setInterval(loadSystemInfo, 5000)
    return () => clearInterval(interval)
  }

  // 初始加载
  loadSystemInfo()
  loadActivities()
  const stopMonitoring = startMonitoring()

  // 组件卸载时停止监控
  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    systemInfo,
    activities,
    loading,
    loadSystemInfo,
    loadActivities,
    addActivity,
    clearActivities
  }
}) 