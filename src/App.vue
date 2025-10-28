<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>

<style scoped>
.main-content {
  flex: 1;
  min-height: calc(100vh - 140px);
  padding: var(--space-6) 0;
}
</style>