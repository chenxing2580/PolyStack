<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <router-view></router-view>
</template>

<style>
/* 全局样式已移至 assets/styles/main.css */
</style>