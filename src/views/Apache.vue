<template>
  <div class="apache">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Apache 配置</span>
              <div class="actions">
                <el-button-group>
                  <el-button type="success" size="small" @click="startApache">
                    <el-icon><VideoPlay /></el-icon>
                    启动
                  </el-button>
                  <el-button type="danger" size="small" @click="stopApache">
                    <el-icon><VideoPause /></el-icon>
                    停止
                  </el-button>
                  <el-button type="warning" size="small" @click="reloadApache">
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
              v-model="apacheConfig"
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
              <span class="label">MPM</span>
              <span class="value">{{ status.mpm }}</span>
            </div>
            <div class="status-item">
              <span class="label">工作进程</span>
              <span class="value">{{ status.workers }}</span>
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

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>已加载模块</span>
            </div>
          </template>
          <div class="module-list">
            <el-tag
              v-for="module in modules"
              :key="module"
              class="module-item"
            >
              {{ module }}
            </el-tag>
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
const apacheConfig = ref(`# Apache 配置文件
ServerRoot "/etc/httpd"
Listen 80

LoadModule mpm_prefork_module modules/mod_mpm_prefork.so
LoadModule authn_file_module modules/mod_authn_file.so
LoadModule authn_core_module modules/mod_authn_core.so
LoadModule authz_host_module modules/mod_authz_host.so
LoadModule authz_groupfile_module modules/mod_authz_groupfile.so
LoadModule authz_user_module modules/mod_authz_user.so
LoadModule authz_core_module modules/mod_authz_core.so
LoadModule access_compat_module modules/mod_access_compat.so
LoadModule auth_basic_module modules/mod_auth_basic.so
LoadModule reqtimeout_module modules/mod_reqtimeout.so
LoadModule filter_module modules/mod_filter.so
LoadModule mime_module modules/mod_mime.so
LoadModule log_config_module modules/mod_log_config.so
LoadModule env_module modules/mod_env.so
LoadModule headers_module modules/mod_headers.so
LoadModule setenvif_module modules/mod_setenvif.so
LoadModule version_module modules/mod_version.so
LoadModule unixd_module modules/mod_unixd.so
LoadModule status_module modules/mod_status.so
LoadModule autoindex_module modules/mod_autoindex.so
LoadModule dir_module modules/mod_dir.so
LoadModule alias_module modules/mod_alias.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule php_module modules/libphp.so

<IfModule unixd_module>
    User apache
    Group apache
</IfModule>

ServerAdmin root@localhost
ServerName localhost:80

<Directory />
    AllowOverride none
    Require all denied
</Directory>

DocumentRoot "/var/www/html"

<Directory "/var/www">
    AllowOverride None
    Require all granted
</Directory>

<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

<IfModule dir_module>
    DirectoryIndex index.html index.php
</IfModule>

<Files ".ht*">
    Require all denied
</Files>

ErrorLog "logs/error_log"
LogLevel warn

<IfModule log_config_module>
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
    LogFormat "%h %l %u %t \"%r\" %>s %b" common

    <IfModule logio_module>
        LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %I %O" combinedio
    </IfModule>

    CustomLog "logs/access_log" combined
</IfModule>

<IfModule mime_module>
    TypesConfig /etc/mime.types
    AddType application/x-compress .Z
    AddType application/x-gzip .gz .tgz
    AddType application/x-httpd-php .php
    AddType application/x-httpd-php-source .phps
</IfModule>

AddDefaultCharset UTF-8

<IfModule mime_magic_module>
    MIMEMagicFile conf/magic
</IfModule>

EnableSendfile on

IncludeOptional conf.d/*.conf`)

const status = ref({
  running: true,
  pid: 12345,
  version: 'Apache/2.4.57',
  mpm: 'prefork',
  workers: 8,
  requests: 156
})

const errorLogs = ref([
  {
    time: '2024-02-12 20:00:00',
    level: 'error',
    message: '[core:error] [pid 12345] (13)Permission denied: [client 127.0.0.1:50000] AH00035: access to /restricted.html denied'
  },
  {
    time: '2024-02-12 19:30:00',
    level: 'warn',
    message: '[core:warn] [pid 12345] (92)Protocol not available: AH00076: Failed to enable APR_TCP_DEFER_ACCEPT'
  }
])

const modules = ref([
  'core_module',
  'so_module',
  'http_module',
  'mpm_prefork_module',
  'authn_file_module',
  'authn_core_module',
  'authz_host_module',
  'authz_user_module',
  'authz_core_module',
  'access_compat_module',
  'auth_basic_module',
  'php_module'
])

const startApache = async () => {
  try {
    loading.value = true
    // TODO: 实现启动 Apache 的逻辑
    ElMessage.success('Apache 启动成功')
    status.value.running = true
  } catch (error) {
    ElMessage.error('Apache 启动失败')
  } finally {
    loading.value = false
  }
}

const stopApache = async () => {
  try {
    loading.value = true
    // TODO: 实现停止 Apache 的逻辑
    ElMessage.success('Apache 停止成功')
    status.value.running = false
  } catch (error) {
    ElMessage.error('Apache 停止失败')
  } finally {
    loading.value = false
  }
}

const reloadApache = async () => {
  try {
    loading.value = true
    // TODO: 实现重载 Apache 的逻辑
    ElMessage.success('Apache 重载成功')
  } catch (error) {
    ElMessage.error('Apache 重载失败')
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
.apache {
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

.module-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.module-item {
  margin: 0;
}
</style>