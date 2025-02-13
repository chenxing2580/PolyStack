<template>
  <div class="php">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>PHP-FPM 配置</span>
              <div class="actions">
                <el-button-group>
                  <el-button type="success" size="small" @click="startPHP">
                    <el-icon><VideoPlay /></el-icon>
                    启动
                  </el-button>
                  <el-button type="danger" size="small" @click="stopPHP">
                    <el-icon><VideoPause /></el-icon>
                    停止
                  </el-button>
                  <el-button type="warning" size="small" @click="restartPHP">
                    <el-icon><RefreshRight /></el-icon>
                    重启
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
              v-model="phpConfig"
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
              <span class="label">活动连接</span>
              <span class="value">{{ status.activeConnections }}</span>
            </div>
            <div class="status-item">
              <span class="label">内存使用</span>
              <span class="value">{{ status.memoryUsage }}</span>
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

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>已加载扩展</span>
            </div>
          </template>
          <div class="extension-list">
            <el-tag
              v-for="ext in extensions"
              :key="ext.name"
              :type="ext.enabled ? 'success' : 'info'"
              class="extension-item"
            >
              {{ ext.name }} {{ ext.version }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoPlay, VideoPause, RefreshRight, Refresh, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const phpConfig = ref(`[global]
pid = /run/php-fpm.pid
error_log = /var/log/php-fpm.log
daemonize = yes

[www]
user = www-data
group = www-data
listen = 127.0.0.1:9000
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
pm.max_requests = 500

php_admin_value[error_log] = /var/log/php-fpm/www-error.log
php_admin_flag[log_errors] = on
php_value[session.save_handler] = files
php_value[session.save_path] = /var/lib/php/sessions
php_value[soap.wsdl_cache_dir] = /var/lib/php/wsdlcache

security.limit_extensions = .php .php3 .php4 .php5 .php7

php_admin_value[upload_max_filesize] = 32M
php_admin_value[post_max_size] = 32M
php_admin_value[memory_limit] = 128M
php_admin_value[max_execution_time] = 300
php_admin_value[max_input_time] = 300

env[HOSTNAME] = $HOSTNAME
env[PATH] = /usr/local/bin:/usr/bin:/bin
env[TMP] = /tmp
env[TMPDIR] = /tmp
env[TEMP] = /tmp`)

const status = ref({
  running: true,
  pid: 12345,
  version: 'PHP 8.2.12',
  workers: 4,
  activeConnections: 12,
  memoryUsage: '128MB'
})

const errorLogs = ref([
  {
    time: '2024-02-12 20:00:00',
    level: 'error',
    message: 'PHP Fatal error: Allowed memory size of 134217728 bytes exhausted'
  },
  {
    time: '2024-02-12 19:30:00',
    level: 'warn',
    message: 'PHP Warning: Unknown: failed to open stream: Permission denied'
  }
])

const extensions = ref([
  { name: 'mysqli', version: '8.2.12', enabled: true },
  { name: 'pdo_mysql', version: '8.2.12', enabled: true },
  { name: 'gd', version: '2.3.0', enabled: true },
  { name: 'curl', version: '7.29.0', enabled: true },
  { name: 'openssl', version: '1.1.1', enabled: true },
  { name: 'zip', version: '1.15.6', enabled: true },
  { name: 'redis', version: '5.3.7', enabled: true },
  { name: 'xdebug', version: '3.2.2', enabled: false }
])

const startPHP = async () => {
  try {
    loading.value = true
    // TODO: 实现启动 PHP-FPM 的逻辑
    ElMessage.success('PHP-FPM 启动成功')
    status.value.running = true
  } catch (error) {
    ElMessage.error('PHP-FPM 启动失败')
  } finally {
    loading.value = false
  }
}

const stopPHP = async () => {
  try {
    loading.value = true
    // TODO: 实现停止 PHP-FPM 的逻辑
    ElMessage.success('PHP-FPM 停止成功')
    status.value.running = false
  } catch (error) {
    ElMessage.error('PHP-FPM 停止失败')
  } finally {
    loading.value = false
  }
}

const restartPHP = async () => {
  try {
    loading.value = true
    // TODO: 实现重启 PHP-FPM 的逻辑
    ElMessage.success('PHP-FPM 重启成功')
  } catch (error) {
    ElMessage.error('PHP-FPM 重启失败')
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
.php {
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

.extension-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.extension-item {
  margin: 0;
}
</style> 