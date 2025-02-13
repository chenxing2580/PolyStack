<template>
  <div class="services">
    <el-tabs v-model="activeTab" class="service-tabs">
      <el-tab-pane label="Web 服务器" name="web">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Web 服务器配置</span>
              <div class="actions">
                <el-button type="primary" size="small" @click="restartService('web')">
                  <el-icon><Refresh /></el-icon>
                  重启服务
                </el-button>
              </div>
            </div>
          </template>
          <el-form :model="webConfig" label-width="120px">
            <el-form-item label="服务器类型">
              <el-radio-group v-model="webConfig.type">
                <el-radio label="nginx">Nginx</el-radio>
                <el-radio label="apache">Apache</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="监听端口">
              <el-input-number v-model="webConfig.port" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="配置文件">
              <el-input
                v-model="webConfig.config"
                type="textarea"
                :rows="10"
                placeholder="配置文件内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig('web')">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="数据库" name="database">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>数据库服务配置</span>
              <div class="actions">
                <el-button type="primary" size="small" @click="restartService('database')">
                  <el-icon><Refresh /></el-icon>
                  重启服务
                </el-button>
              </div>
            </div>
          </template>
          <el-form :model="dbConfig" label-width="120px">
            <el-form-item label="数据库类型">
              <el-radio-group v-model="dbConfig.type">
                <el-radio label="mysql">MySQL</el-radio>
                <el-radio label="postgresql">PostgreSQL</el-radio>
                <el-radio label="mongodb">MongoDB</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="端口">
              <el-input-number v-model="dbConfig.port" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="dbConfig.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="dbConfig.password" type="password" show-password />
            </el-form-item>
            <el-form-item label="配置文件">
              <el-input
                v-model="dbConfig.config"
                type="textarea"
                :rows="10"
                placeholder="配置文件内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig('database')">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="缓存" name="cache">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>缓存服务配置</span>
              <div class="actions">
                <el-button type="primary" size="small" @click="restartService('cache')">
                  <el-icon><Refresh /></el-icon>
                  重启服务
                </el-button>
              </div>
            </div>
          </template>
          <el-form :model="cacheConfig" label-width="120px">
            <el-form-item label="缓存类型">
              <el-radio-group v-model="cacheConfig.type">
                <el-radio label="redis">Redis</el-radio>
                <el-radio label="memcached">Memcached</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="端口">
              <el-input-number v-model="cacheConfig.port" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="最大内存">
              <el-input-number v-model="cacheConfig.maxMemory" :min="1" :step="128" />
              <span class="unit">MB</span>
            </el-form-item>
            <el-form-item label="配置文件">
              <el-input
                v-model="cacheConfig.config"
                type="textarea"
                :rows="10"
                placeholder="配置文件内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig('cache')">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('web')

// Web 服务器配置
const webConfig = ref({
  type: 'nginx',
  port: 80,
  config: '# Nginx 配置\nserver {\n  listen 80;\n  server_name localhost;\n}'
})

// 数据库配置
const dbConfig = ref({
  type: 'mysql',
  port: 3306,
  username: 'root',
  password: '',
  config: '# MySQL 配置\n[mysqld]\nport=3306\nmax_connections=100'
})

// 缓存配置
const cacheConfig = ref({
  type: 'redis',
  port: 6379,
  maxMemory: 128,
  config: '# Redis 配置\nport 6379\nmaxmemory 128mb'
})

const restartService = async (type: string) => {
  try {
    // TODO: 实现重启服务的逻辑
    ElMessage.success(`${type} 服务重启成功`)
  } catch (error) {
    ElMessage.error(`${type} 服务重启失败`)
  }
}

const saveConfig = async (type: string) => {
  try {
    // TODO: 实现保存配置的逻辑
    ElMessage.success(`${type} 配置保存成功`)
  } catch (error) {
    ElMessage.error(`${type} 配置保存失败`)
  }
}
</script>

<style scoped>
.services {
  padding: 20px;
}

.service-tabs {
  background-color: var(--el-bg-color);
  padding: 20px;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  margin-left: 10px;
  color: var(--el-text-color-secondary);
}
</style> 