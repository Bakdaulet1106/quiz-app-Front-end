<template>
  <header class="app-header">
    <div class="container">
      <div class="app-header__content">
        <div class="app-header__brand">
          <router-link to="/dashboard" class="app-header__logo">
            🎯 QuizMaster
          </router-link>
        </div>

        <nav class="app-header__nav" v-if="authStore.isAuthenticated">
          <router-link 
            to="/dashboard" 
            class="app-header__nav-link"
            :class="{ 'app-header__nav-link--active': $route.path === '/dashboard' }"
          >
            📊 Дашборд
          </router-link>
          
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin" 
            class="app-header__nav-link"
            :class="{ 'app-header__nav-link--active': $route.path === '/admin' }"
          >
            ⚙️ Админка
          </router-link>
          
          <router-link 
            v-if="authStore.isStudent"
            to="/student" 
            class="app-header__nav-link"
            :class="{ 'app-header__nav-link--active': $route.path === '/student' }"
          >
            🎓 Студент
          </router-link>
        </nav>

        <div class="app-header__user" v-if="authStore.isAuthenticated">
          <span class="app-header__user-name">👋 {{ authStore.userName }}</span>
          <BaseButton 
            variant="secondary" 
            size="small" 
            @click="handleLogout"
            class="app-header__logout-btn"
          >
            🚪 Выйти
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import BaseButton from './BaseButton.vue'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--text-light);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.app-header__brand {
  flex-shrink: 0;
}

.app-header__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-light);
  text-decoration: none;
  transition: var(--transition);
}

.app-header__logo:hover {
  transform: scale(1.05);
}

.app-header__nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.app-header__nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  opacity: 0.9;
}

.app-header__nav-link:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.app-header__nav-link--active {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header__user-name {
  font-weight: 500;
}

.app-header__logout-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.app-header__logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .app-header__content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
  }

  .app-header__nav {
    gap: 1rem;
  }

  .app-header__user {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>