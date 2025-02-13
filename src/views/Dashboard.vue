<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(status, serviceName) in services" :key="serviceName">
        <el-card shadow="hover">
          <div class="status-card">
            <el-progress
              type="dashboard"
              :percentage="100"
              :status="status ? 'success' : 'exception'"
              :width="120"
            >
              <template #default>
                <div class="progress-content">
                  <span class="status-text">{{ status ? '运行中' : '已停止' }}</span>
                  <span class="service-name">{{ getServiceDisplayName(serviceName) }}</span>
                </div>
              </template>
            </el-progress>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div class="status-card">
            <el-progress
              type="dashboard"
              :percentage="Math.round(cpuUsage)"
              :color="getProgressColor(cpuUsage)"
              :width="120"
            >
              <template #default>
                <div class="progress-content">
                  <span class="value">{{ Math.round(cpuUsage) }}%</span>
                  <span class="label">CPU</span>
                </div>
              </template>
            </el-progress>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div class="status-card">
            <el-progress
              type="dashboard"
              :percentage="Math.round(memoryUsagePercentage)"
              :color="getProgressColor(memoryUsagePercentage)"
              :width="120"
            >
              <template #default>
                <div class="progress-content">
                  <span class="value">{{ Math.round(memoryUsagePercentage) }}%</span>
                  <span class="label">内存</span>
                </div>
              </template>
            </el-progress>
            <div class="detail-text">
              已用: {{ formatBytes(memoryUsed) }} / {{ formatBytes(memoryTotal) }}
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div class="status-card">
            <el-progress
              type="dashboard"
              :percentage="Math.round(diskUsagePercentage)"
              :color="getProgressColor(diskUsagePercentage)"
              :width="120"
            >
              <template #default>
                <div class="progress-content">
                  <span class="value">{{ Math.round(diskUsagePercentage) }}%</span>
                  <span class="label">磁盘</span>
                </div>
              </template>
            </el-progress>
            <div class="detail-text">
              已用: {{ formatBytes(diskUsed) }} / {{ formatBytes(diskTotal) }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="primary" link @click="clearActivities">
                清除活动
              </el-button>
            </div>
          </template>
          <div class="activities">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <el-tag
                :type="activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'danger'"
                size="small"
              >
                {{ activity.type === 'success' ? '成功' : activity.type === 'warning' ? '警告' : '错误' }}
              </el-tag>
              <span class="activity-content">{{ activity.content }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { invoke } from '@tauri-apps/api'

interface SystemStatus {
  cpu_usage: number
  memory_total: number
  memory_used: number
  disk_total: number
  disk_used: number
  services: Record<string, boolean>
}

interface Activity {
  id: number
  type: string
  content: string
  time: string
}

const cpuUsage = ref(0)
const memoryTotal = ref(0)
const memoryUsed = ref(0)
const diskTotal = ref(0)
const diskUsed = ref(0)
const services = ref<Record<string, boolean>>({})

const memoryUsagePercentage = computed(() => 
  (memoryUsed.value / memoryTotal.value) * 100 || 0
)

const diskUsagePercentage = computed(() => 
  (diskUsed.value / diskTotal.value) * 100 || 0
)

const getServiceDisplayName = (name: string) => {
  const displayNames: Record<string, string> = {
    nginx: 'Nginx',
    apache: 'Apache',
    mysql: 'MySQL',
    php: 'PHP'
  }
  return displayNames[name] || name
}

const getProgressColor = (percentage: number) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const updateSystemStatus = async () => {
  try {
    const status: SystemStatus = await invoke('get_system_status')
    cpuUsage.value = status.cpu_usage
    memoryTotal.value = status.memory_total
    memoryUsed.value = status.memory_used
    diskTotal.value = status.disk_total
    diskUsed.value = status.disk_used
    services.value = status.services
  } catch (error) {
    console.error('获取系统状态失败:', error)
  }
}

let statusInterval: number | null = null

onMounted(() => {
  updateSystemStatus()
  statusInterval = window.setInterval(updateSystemStatus, 2000)
})

onUnmounted(() => {
  if (statusInterval !== null) {
    clearInterval(statusInterval)
  }
})

// 最近活动
const recentActivities = ref<Activity[]>([
  {
    id: 1,
    type: 'success',
    content: 'Nginx 服务启动成功',
    time: '10:00'
  },
  {
    id: 2,
    type: 'warning',
    content: 'MySQL 数据库需要优化',
    time: '09:30'
  },
  {
    id: 3,
    type: 'error',
    content: 'PHP-FPM 进程异常退出',
    time: '09:00'
  }
])

const clearActivities = () => {
  recentActivities.value = []
}

const refreshServices = () => {
  // TODO: 实现刷新服务状态的逻辑
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.value {
  font-size: 24px;
  font-weight: bold;
}

.label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.status-text {
  font-size: 16px;
  font-weight: bold;
}

.service-name {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.detail-text {
  margin-top: 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activities {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  font-weight: 500;
}
</style> 