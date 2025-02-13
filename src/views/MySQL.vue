<template>
  <div class="mysql">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>MySQL 配置</span>
              <div class="actions">
                <el-button-group>
                  <el-button type="success" size="small" @click="startMySQL">
                    <el-icon><VideoPlay /></el-icon>
                    启动
                  </el-button>
                  <el-button type="danger" size="small" @click="stopMySQL">
                    <el-icon><VideoPause /></el-icon>
                    停止
                  </el-button>
                  <el-button type="warning" size="small" @click="restartMySQL">
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
              v-model="mysqlConfig"
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
              <span class="label">连接数</span>
              <span class="value">{{ status.connections }}</span>
            </div>
            <div class="status-item">
              <span class="label">查询/秒</span>
              <span class="value">{{ status.qps }}</span>
            </div>
            <div class="status-item">
              <span class="label">慢查询数</span>
              <span class="value">{{ status.slowQueries }}</span>
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
              <span>数据库列表</span>
              <el-button type="primary" link @click="refreshDatabases">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <div class="database-list">
            <div v-for="db in databases" :key="db.name" class="database-item">
              <span class="name">{{ db.name }}</span>
              <span class="size">{{ db.size }}</span>
            </div>
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
const mysqlConfig = ref(`# MySQL 配置文件
[mysqld]
# 基本设置
user = mysql
port = 3306
basedir = /usr
datadir = /var/lib/mysql
socket = /var/run/mysqld/mysqld.sock
pid-file = /var/run/mysqld/mysqld.pid

# 字符集设置
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci

# 连接设置
max_connections = 151
max_user_connections = 50
wait_timeout = 28800
interactive_timeout = 28800

# 缓冲区设置
key_buffer_size = 16M
max_allowed_packet = 16M
thread_stack = 192K
thread_cache_size = 8

# InnoDB 设置
innodb_buffer_pool_size = 128M
innodb_log_file_size = 48M
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 1

# 日志设置
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 2

[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4`)

const status = ref({
  running: true,
  pid: 12345,
  version: 'MySQL 8.0.35',
  connections: 23,
  qps: 156,
  slowQueries: 2
})

const errorLogs = ref([
  {
    time: '2024-02-12 20:00:00',
    level: 'error',
    message: '[ERROR] [MY-012592] [InnoDB] Operating system error number 13 in a file operation.'
  },
  {
    time: '2024-02-12 19:30:00',
    level: 'warn',
    message: '[Warning] [MY-010915] [Server] \'root\'@\'localhost\' is created with an empty password! Please consider switching to unix_socket authentication.'
  }
])

const databases = ref([
  { name: 'mysql', size: '102.3 MB' },
  { name: 'information_schema', size: '0.2 MB' },
  { name: 'performance_schema', size: '15.6 MB' },
  { name: 'sys', size: '0.1 MB' },
  { name: 'example_db', size: '256.7 MB' }
])

const startMySQL = async () => {
  try {
    loading.value = true
    // TODO: 实现启动 MySQL 的逻辑
    ElMessage.success('MySQL 启动成功')
    status.value.running = true
  } catch (error) {
    ElMessage.error('MySQL 启动失败')
  } finally {
    loading.value = false
  }
}

const stopMySQL = async () => {
  try {
    loading.value = true
    // TODO: 实现停止 MySQL 的逻辑
    ElMessage.success('MySQL 停止成功')
    status.value.running = false
  } catch (error) {
    ElMessage.error('MySQL 停止失败')
  } finally {
    loading.value = false
  }
}

const restartMySQL = async () => {
  try {
    loading.value = true
    // TODO: 实现重启 MySQL 的逻辑
    ElMessage.success('MySQL 重启成功')
  } catch (error) {
    ElMessage.error('MySQL 重启失败')
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

const refreshDatabases = async () => {
  try {
    loading.value = true
    // TODO: 实现刷新数据库列表的逻辑
  } catch (error) {
    ElMessage.error('刷新数据库列表失败')
  } finally {
    loading.value = false
  }
}

const clearLogs = () => {
  errorLogs.value = []
}
</script>

<style scoped>
.mysql {
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

.database-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.database-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);

  .name {
    font-weight: 500;
  }

  .size {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style> 