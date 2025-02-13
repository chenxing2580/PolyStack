<template>
  <div class="settings">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本设置</span>
            </div>
          </template>
          <el-form :model="settings" label-width="120px">
            <el-form-item label="默认安装路径">
              <el-input v-model="settings.defaultInstallPath" placeholder="请选择默认安装路径">
                <template #append>
                  <el-button @click="selectPath">
                    <el-icon><Folder /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="主题">
              <el-select v-model="settings.theme">
                <el-option label="浅色" value="light" />
                <el-option label="深色" value="dark" />
                <el-option label="跟随系统" value="system" />
              </el-select>
            </el-form-item>

            <el-form-item label="语言">
              <el-select v-model="settings.language">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>

            <el-form-item label="开机自启动">
              <el-switch v-model="settings.autoStart" />
            </el-form-item>

            <el-form-item label="自动检查更新">
              <el-radio-group v-model="settings.updateCheck">
                <el-radio label="never">从不</el-radio>
                <el-radio label="daily">每天</el-radio>
                <el-radio label="weekly">每周</el-radio>
                <el-radio label="monthly">每月</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveSettings" :loading="loading">
                保存设置
              </el-button>
              <el-button @click="resetSettings" :loading="loading">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>高级设置</span>
            </div>
          </template>
          <el-form :model="advancedSettings" label-width="120px">
            <el-form-item label="日志级别">
              <el-select v-model="advancedSettings.logLevel">
                <el-option label="调试" value="debug" />
                <el-option label="信息" value="info" />
                <el-option label="警告" value="warning" />
                <el-option label="错误" value="error" />
              </el-select>
            </el-form-item>

            <el-form-item label="日志保留天数">
              <el-input-number v-model="advancedSettings.logRetention" :min="1" :max="365" />
            </el-form-item>

            <el-form-item label="代理设置">
              <el-input v-model="advancedSettings.proxy" placeholder="http://proxy.example.com:8080" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveAdvancedSettings" :loading="loading">
                保存高级设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>关于</span>
            </div>
          </template>
          <div class="about">
            <img src="../assets/logo.png" alt="PolyStack" class="logo">
            <h2>PolyStack</h2>
            <p class="version">版本 {{ version }}</p>
            <p class="description">
              强大的开发环境管理工具，帮助开发者轻松管理和切换不同的开发环境。
            </p>
            <div class="actions">
              <el-button type="primary" @click="checkUpdate" :loading="checking">
                检查更新
              </el-button>
              <el-button @click="openDocs">
                <el-icon><Document /></el-icon>
                文档
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <p><strong>操作系统：</strong>{{ systemInfo.os }}</p>
            <p><strong>CPU：</strong>{{ systemInfo.cpu }}</p>
            <p><strong>内存：</strong>{{ systemInfo.memory }}</p>
            <p><strong>磁盘空间：</strong>{{ systemInfo.disk }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const version = '0.1.0'
const loading = ref(false)
const checking = ref(false)

const settings = ref({
  defaultInstallPath: 'C:\\Program Files\\PolyStack',
  theme: 'system',
  language: 'zh-CN',
  autoStart: false,
  updateCheck: 'weekly'
})

const advancedSettings = ref({
  logLevel: 'info',
  logRetention: 30,
  proxy: ''
})

const systemInfo = ref({
  os: 'Windows 10 Pro',
  cpu: 'Intel Core i7-10700K',
  memory: '32GB',
  disk: '500GB 可用/1TB 总计'
})

const selectPath = async () => {
  try {
    // TODO: 实现选择路径的逻辑
  } catch (error) {
    ElMessage.error('选择路径失败')
  }
}

const saveSettings = async () => {
  loading.value = true
  try {
    // TODO: 实现保存设置的逻辑
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  } finally {
    loading.value = false
  }
}

const resetSettings = () => {
  settings.value = {
    defaultInstallPath: 'C:\\Program Files\\PolyStack',
    theme: 'system',
    language: 'zh-CN',
    autoStart: false,
    updateCheck: 'weekly'
  }
  ElMessage.success('设置已重置')
}

const saveAdvancedSettings = async () => {
  loading.value = true
  try {
    // TODO: 实现保存高级设置的逻辑
    ElMessage.success('高级设置保存成功')
  } catch (error) {
    ElMessage.error('高级设置保存失败')
  } finally {
    loading.value = false
  }
}

const checkUpdate = async () => {
  checking.value = true
  try {
    // TODO: 实现检查更新的逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.info('当前已是最新版本')
  } finally {
    checking.value = false
  }
}

const openDocs = () => {
  // TODO: 实现打开文档的逻辑
  window.open('https://github.com/your-username/polystack/wiki', '_blank')
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about {
  text-align: center;
  padding: 20px 0;

  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }

  h2 {
    margin: 10px 0;
    color: var(--el-text-color-primary);
  }

  .version {
    color: var(--el-text-color-secondary);
    margin-bottom: 10px;
  }

  .description {
    color: var(--el-text-color-regular);
    margin-bottom: 20px;
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}

.system-info {
  p {
    margin: 10px 0;
    color: var(--el-text-color-regular);
  }
}
</style> 