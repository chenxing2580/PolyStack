<template>
  <el-container class="layout">
    <el-aside width="200px">
      <div class="title">
        <span>PolyStack</span>
      </div>
      <el-menu
        :router="true"
        :default-active="route.path"
        class="menu"
      >
        <el-menu-item index="/">
          <el-icon><Monitor /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/websites">
          <el-icon><Grid /></el-icon>
          <span>网站</span>
        </el-menu-item>
        <el-menu-item index="/nginx">
          <el-icon><Connection /></el-icon>
          <span>Nginx</span>
        </el-menu-item>
        <el-menu-item index="/apache">
          <el-icon><Link /></el-icon>
          <span>Apache</span>
        </el-menu-item>
        <el-menu-item index="/mysql">
          <el-icon><DataLine /></el-icon>
          <span>MySQL</span>
        </el-menu-item>
        <el-menu-item index="/php">
          <el-icon><Cpu /></el-icon>
          <span>PHP</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <el-breadcrumb>
            <el-breadcrumb-item>{{ route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            添加网站
          </el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Monitor, Grid, Connection, Link, DataLine, Cpu, Setting, Plus } from '@element-plus/icons-vue'

const route = useRoute()

const showAddDialog = () => {
  // TODO: 实现添加网站的对话框
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.title {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color-light);
}

.menu {
  border-right: none;
}

.el-aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
}

.el-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-main {
  background-color: var(--el-bg-color-page);
  padding: 20px;
}
</style>