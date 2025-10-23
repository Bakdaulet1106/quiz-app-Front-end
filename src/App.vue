<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()

const showHeader = computed(() => !route.meta.hideLayout)
const showFooter = computed(() => !route.meta.hideLayout)
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 0;
}
</style>