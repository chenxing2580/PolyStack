<template>
  <div class="environments">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>环境列表</span>
              <el-button type="primary" size="small" @click="showAddDialog">
                <el-icon><Plus /></el-icon>
                添加环境
              </el-button>
            </div>
          </template>
          <el-table :data="environments" v-loading="loading">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="env_type" label="类型">
              <template #default="{ row }">
                <el-tag>{{ row.env_type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" />
            <el-table-column prop="port" label="端口" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'running' ? 'success' : 'info'">
                  {{ row.status === 'running' ? '运行中' : '已停止' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button-group>
                  <el-button
                    :type="row.status === 'running' ? 'danger' : 'success'"
                    size="small"
                    @click="row.status === 'running' ? stopEnvironment(row.id) : startEnvironment(row.id)"
                  >
                    <el-icon>
                      <component :is="row.status === 'running' ? 'VideoPause' : 'VideoPlay'" />
                    </el-icon>
                    {{ row.status === 'running' ? '停止' : '启动' }}
                  </el-button>
                  <el-button type="primary" size="small" @click="showEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="removeEnvironment(row.id)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>环境详情</span>
            </div>
          </template>
          <div v-if="selectedEnvironment" class="environment-details">
            <p><strong>名称：</strong>{{ selectedEnvironment.name }}</p>
            <p><strong>类型：</strong>{{ selectedEnvironment.env_type }}</p>
            <p><strong>版本：</strong>{{ selectedEnvironment.version }}</p>
            <p><strong>路径：</strong>{{ selectedEnvironment.path }}</p>
            <p><strong>端口：</strong>{{ selectedEnvironment.port }}</p>
            <p><strong>状态：</strong>{{ selectedEnvironment.status }}</p>
            <p><strong>自动启动：</strong>{{ selectedEnvironment.auto_start ? '是' : '否' }}</p>
          </div>
          <el-empty v-else description="请选择一个环境" />
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>环境日志</span>
              <el-button type="primary" size="small" @click="clearLogs">
                清除日志
              </el-button>
            </div>
          </template>
          <div class="environment-logs">
            <p v-for="(log, index) in logs" :key="index" :class="log.type">
              {{ log.time }} - {{ log.content }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加/编辑环境对话框 -->
    <el-dialog
      :title="dialogMode === 'add' ? '添加环境' : '编辑环境'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="environmentForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="environmentForm.name" placeholder="请输入环境名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="environmentForm.env_type" placeholder="请选择环境类型">
            <el-option label="PHP" value="php" />
            <el-option label="Node.js" value="node" />
            <el-option label="Python" value="python" />
            <el-option label="MySQL" value="mysql" />
            <el-option label="Redis" value="redis" />
            <el-option label="Nginx" value="nginx" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="environmentForm.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="安装路径">
          <el-input v-model="environmentForm.path" placeholder="请选择安装路径">
            <template #append>
              <el-button @click="selectPath">
                <el-icon><Folder /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number v-model="environmentForm.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="自动启动">
          <el-switch v-model="environmentForm.auto_start" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEnvironment">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete, VideoPlay, VideoPause, Folder } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useEnvironmentStore } from '../stores/environment'
import type { Environment } from '../stores/environment'

const store = useEnvironmentStore()
const { environments, loading } = store

const selectedEnvironment = ref<Environment | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const environmentForm = ref<Omit<Environment, 'id' | 'status'>>({
  name: '',
  env_type: '',
  version: '',
  path: '',
  port: 80,
  auto_start: false
})

const logs = ref<Array<{ time: string; type: string; content: string }>>([
  {
    time: '2024-02-12 20:00:00',
    type: 'info',
    content: '系统启动'
  }
])

const showAddDialog = () => {
  dialogMode.value = 'add'
  environmentForm.value = {
    name: '',
    env_type: '',
    version: '',
    path: '',
    port: 80,
    auto_start: false
  }
  dialogVisible.value = true
}

const showEditDialog = (environment: Environment) => {
  dialogMode.value = 'edit'
  environmentForm.value = {
    name: environment.name,
    env_type: environment.env_type,
    version: environment.version,
    path: environment.path,
    port: environment.port,
    auto_start: environment.auto_start
  }
  dialogVisible.value = true
}

const saveEnvironment = async () => {
  try {
    if (dialogMode.value === 'add') {
      await store.addEnvironment({
        name: environmentForm.value.name,
        env_type: environmentForm.value.env_type,
        version: environmentForm.value.version,
        path: environmentForm.value.path,
        port: environmentForm.value.port
      })
    } else {
      // TODO: 实现编辑环境的逻辑
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('保存环境失败:', error)
  }
}

const removeEnvironment = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该环境吗？', '提示', {
      type: 'warning'
    })
    await store.removeEnvironment(id)
  } catch {
    // 用户取消操作
  }
}

const startEnvironment = async (id: number) => {
  try {
    await store.startEnvironment(id)
  } catch (error) {
    console.error('启动环境失败:', error)
  }
}

const stopEnvironment = async (id: number) => {
  try {
    await store.stopEnvironment(id)
  } catch (error) {
    console.error('停止环境失败:', error)
  }
}

const selectPath = async () => {
  try {
    // TODO: 实现选择路径的逻辑
  } catch (error) {
    console.error('选择路径失败:', error)
  }
}

const clearLogs = () => {
  logs.value = []
}
</script>

<style scoped>
.environments {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.environment-details {
  p {
    margin: 10px 0;
    color: var(--el-text-color-regular);
  }
}

.environment-logs {
  max-height: 300px;
  overflow-y: auto;

  p {
    margin: 5px 0;
    padding: 5px;
    border-radius: 4px;
    font-family: monospace;
  }

  .info {
    background-color: var(--el-color-info-light);
  }

  .success {
    background-color: var(--el-color-success-light);
  }

  .warning {
    background-color: var(--el-color-warning-light);
  }

  .error {
    background-color: var(--el-color-danger-light);
  }
}
</style>