<template>
  <div class="nginx">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Nginx 配置</span>
              <div class="actions">
                <el-button-group>
                  <el-button type="success" size="small" @click="startNginx">
                    <el-icon><VideoPlay /></el-icon>
                    启动
                  </el-button>
                  <el-button type="danger" size="small" @click="stopNginx">
                    <el-icon><VideoPause /></el-icon>
                    停止
                  </el-button>
                  <el-button type="warning" size="small" @click="reloadNginx">
                    <el-icon><Refresh /></el-icon>
                    重载
                  </el-button>
                </el-button-group>
                <el-button type="primary" size="small" @click="saveConfig">
                  <el-icon><Check /></el-icon>
                  保存配置
                </el-button>
              </div>
            </div>
          </template>
          <div class="config-editor">
            <el-input
              v-model="nginxConfig"
              type="textarea"
              :rows="25"
              font-family="monospace"
              resize="none"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>状态信息</span>
              <el-button type="primary" link @click="refreshStatus">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <div class="status-info" v-loading="loading">
            <div class="status-item">
              <span class="label">运行状态</span>
              <el-tag :type="status.running ? 'success' : 'danger'">
                {{ status.running ? '运行中' : '已停止' }}
              </el-tag>
            </div>
            <div class="status-item">
              <span class="label">进程 ID</span>
              <span class="value">{{ status.pid }}</span>
            </div>
            <div class="status-item">
              <span class="label">版本</span>
              <span class="value">{{ status.version }}</span>
            </div>
            <div class="status-item">
              <span class="label">工作进程</span>
              <span class="value">{{ status.workers }}</span>
            </div>
            <div class="status-item">
              <span class="label">连接数</span>
              <span class="value">{{ status.connections }}</span>
            </div>
            <div class="status-item">
              <span class="label">请求数/秒</span>
              <span class="value">{{ status.requests }}</span>
            </div>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>错误日志</span>
              <el-button type="primary" link @click="clearLogs">
                清除日志
              </el-button>
            </div>
          </template>
          <div class="error-logs">
            <p v-for="(log, index) in errorLogs" :key="index" :class="log.level">
              {{ log.time }} [{{ log.level }}] {{ log.message }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoPlay, VideoPause, Refresh, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const nginxConfig = ref(`# Nginx 配置文件
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    include /etc/nginx/conf.d/*.conf;
}`)

const status = ref({
  running: true,
  pid: 12345,
  version: 'nginx/1.24.0',
  workers: 4,
  connections: 156,
  requests: 234
})

const errorLogs = ref([
  {
    time: '2024-02-12 20:00:00',
    level: 'error',
    message: '[emerg] 1#1: unknown directive "servr" in /etc/nginx/nginx.conf:12'
  },
  {
    time: '2024-02-12 19:30:00',
    level: 'warn',
    message: '[warn] 1#1: conflicting server name "example.com" on 0.0.0.0:80'
  }
])

const startNginx = async () => {
  try {
    loading.value = true
    // TODO: 实现启动 Nginx 的逻辑
    ElMessage.success('Nginx 启动成功')
    status.value.running = true
  } catch (error) {
    ElMessage.error('Nginx 启动失败')
  } finally {
    loading.value = false
  }
}

const stopNginx = async () => {
  try {
    loading.value = true
    // TODO: 实现停止 Nginx 的逻辑
    ElMessage.success('Nginx 停止成功')
    status.value.running = false
  } catch (error) {
    ElMessage.error('Nginx 停止失败')
  } finally {
    loading.value = false
  }
}

const reloadNginx = async () => {
  try {
    loading.value = true
    // TODO: 实现重载 Nginx 的逻辑
    ElMessage.success('Nginx 重载成功')
  } catch (error) {
    ElMessage.error('Nginx 重载失败')
  } finally {
    loading.value = false
  }
}

const saveConfig = async () => {
  try {
    loading.value = true
    // TODO: 实现保存配置的逻辑
    ElMessage.success('配置保存成功')
  } catch (error) {
    ElMessage.error('配置保存失败')
  } finally {
    loading.value = false
  }
}

const refreshStatus = async () => {
  try {
    loading.value = true
    // TODO: 实现刷新状态的逻辑
  } catch (error) {
    ElMessage.error('刷新状态失败')
  } finally {
    loading.value = false
  }
}

const clearLogs = () => {
  errorLogs.value = []
}
</script>

<style scoped>
.nginx {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.config-editor {
  :deep(.el-textarea__inner) {
    font-family: monospace;
    font-size: 14px;
    line-height: 1.6;
  }
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-item .label {
  color: var(--el-text-color-secondary);
}

.status-item .value {
  font-weight: 500;
}

.error-logs {
  max-height: 300px;
  overflow-y: auto;

  p {
    margin: 5px 0;
    padding: 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error {
    background-color: var(--el-color-danger-light);
    color: var(--el-color-danger);
  }

  .warn {
    background-color: var(--el-color-warning-light);
    color: var(--el-color-warning);
  }
}
</style> 