<template>
  <div class="websites">
    <el-table :data="websites" v-loading="loading">
      <el-table-column prop="name" label="网站名称" />
      <el-table-column prop="domain" label="域名" />
      <el-table-column prop="path" label="根目录" />
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              :type="row.status === 'running' ? 'danger' : 'success'"
              size="small"
              @click="row.status === 'running' ? stopWebsite(row.id) : startWebsite(row.id)"
            >
              <el-icon>
                <component :is="row.status === 'running' ? 'VideoPause' : 'VideoPlay'" />
              </el-icon>
              {{ row.status === 'running' ? '停止' : '启动' }}
            </el-button>
            <el-button type="primary" size="small" @click="openConfig(row)">
              <el-icon><Setting /></el-icon>
              配置
            </el-button>
            <el-button type="danger" size="small" @click="removeWebsite(row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 配置对话框 -->
    <el-dialog
      v-model="configDialogVisible"
      :title="currentWebsite?.name + ' - 配置'"
      width="800px"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="configForm" label-width="100px">
            <el-form-item label="网站名称">
              <el-input v-model="configForm.name" />
            </el-form-item>
            <el-form-item label="域名">
              <el-input v-model="configForm.domain" />
            </el-form-item>
            <el-form-item label="根目录">
              <el-input v-model="configForm.path">
                <template #append>
                  <el-button @click="selectPath">
                    <el-icon><Folder /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="PHP 版本">
              <el-select v-model="configForm.phpVersion">
                <el-option label="PHP 8.2" value="8.2" />
                <el-option label="PHP 8.1" value="8.1" />
                <el-option label="PHP 8.0" value="8.0" />
                <el-option label="PHP 7.4" value="7.4" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Nginx 配置" name="nginx">
          <el-input
            v-model="configForm.nginxConfig"
            type="textarea"
            :rows="15"
            font-family="monospace"
          />
        </el-tab-pane>
        <el-tab-pane label="SSL 证书" name="ssl">
          <el-form :model="configForm.ssl" label-width="120px">
            <el-form-item label="启用 HTTPS">
              <el-switch v-model="configForm.ssl.enabled" />
            </el-form-item>
            <template v-if="configForm.ssl.enabled">
              <el-form-item label="证书文件">
                <el-input v-model="configForm.ssl.cert" />
              </el-form-item>
              <el-form-item label="私钥文件">
                <el-input v-model="configForm.ssl.key" />
              </el-form-item>
            </template>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="configDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveConfig">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoPlay, VideoPause, Setting, Delete, Folder } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

interface Website {
  id: number
  name: string
  domain: string
  path: string
  type: string
  status: 'running' | 'stopped'
}

// 模拟数据
const websites = ref<Website[]>([
  {
    id: 1,
    name: '示例网站',
    domain: 'example.com',
    path: 'C:\\www\\example',
    type: 'PHP',
    status: 'running'
  }
])

const loading = ref(false)
const configDialogVisible = ref(false)
const activeTab = ref('basic')
const currentWebsite = ref<Website | null>(null)

const configForm = ref({
  name: '',
  domain: '',
  path: '',
  phpVersion: '8.2',
  nginxConfig: '',
  ssl: {
    enabled: false,
    cert: '',
    key: ''
  }
})

const startWebsite = async (id: number) => {
  try {
    // TODO: 实现启动网站的逻辑
  } catch (error) {
    console.error('启动网站失败:', error)
  }
}

const stopWebsite = async (id: number) => {
  try {
    // TODO: 实现停止网站的逻辑
  } catch (error) {
    console.error('停止网站失败:', error)
  }
}

const openConfig = (website: Website) => {
  currentWebsite.value = website
  configForm.value = {
    name: website.name,
    domain: website.domain,
    path: website.path,
    phpVersion: '8.2',
    nginxConfig: '# Nginx configuration\nserver {\n    listen 80;\n    server_name example.com;\n}',
    ssl: {
      enabled: false,
      cert: '',
      key: ''
    }
  }
  configDialogVisible.value = true
}

const removeWebsite = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该网站吗？', '提示', {
      type: 'warning'
    })
    // TODO: 实现删除网站的逻辑
  } catch {
    // 用户取消操作
  }
}

const selectPath = async () => {
  try {
    // TODO: 实现选择路径的逻辑
  } catch (error) {
    console.error('选择路径失败:', error)
  }
}

const saveConfig = async () => {
  try {
    // TODO: 实现保存配置的逻辑
    configDialogVisible.value = false
  } catch (error) {
    console.error('保存配置失败:', error)
  }
}
</script>

<style scoped>
.websites {
  padding: 20px;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
}
</style> 