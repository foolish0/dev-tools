<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <h1>DevTools</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :router="true"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-sub-menu index="formatter">
          <template #title>
            <el-icon><document /></el-icon>
            <span>格式化工具</span>
          </template>
          <el-menu-item index="/formatter/json">JSON格式化</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="encoder">
          <template #title>
            <el-icon><lock /></el-icon>
            <span>编码解码</span>
          </template>
          <el-menu-item index="/encoder/base64">Base64编解码</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="generator">
          <template #title>
            <el-icon><magic-stick /></el-icon>
            <span>生成工具</span>
          </template>
          <el-menu-item index="/generator/uuid">UUID生成器</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container class="main-container">
      <el-header height="60px" class="header">
        <h2>{{ currentTitle }}</h2>
      </el-header>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document as document, Lock as lock, MagicStick as magicStick } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta.title as string)
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b3648;
}

.logo h1 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.el-menu {
  border-right: none;
  flex: 1;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.main-container {
  height: 100vh;
  overflow: hidden;
}

.header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>