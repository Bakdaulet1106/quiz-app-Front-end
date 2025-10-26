<template>
  <div class="admin-view">
    <div class="container">
      <div class="admin-view__header">
        <h1 class="admin-view__title">Панель администратора</h1>
        <p class="admin-view__subtitle">
          Управление вопросами и просмотр статистики
        </p>
      </div>

      <div class="admin-view__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'admin-view__tab',
            { 'admin-view__tab--active': activeTab === tab.id }
          ]"
          @click="activeTab = tab.id"
        >
          <span class="admin-view__tab-icon">{{ tab.icon }}</span>
          <span class="admin-view__tab-text">{{ tab.name }}</span>
        </button>
      </div>

      <div class="admin-view__content">
        <div v-if="activeTab === 'questions'" class="admin-view__tab-content">
          <QuestionList
            @add-question="showQuestionForm(null)"
            @edit-question="showQuestionForm($event)"
          />
        </div>

        <div v-if="activeTab === 'question-form'" class="admin-view__tab-content">
          <QuestionForm
            :question="selectedQuestion"
            @submit="handleQuestionSubmit"
            @cancel="activeTab = 'questions'"
          />
        </div>

        <div v-if="activeTab === 'stats'" class="admin-view__tab-content">
          <QuizStats />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuestionList from '@/components/admin/QuestionList.vue'
import QuestionForm from '@/components/admin/QuestionForm.vue'
import QuizStats from '@/components/admin/QuizStats.vue'

const activeTab = ref('questions')
const selectedQuestion = ref(null)

const tabs = [
  { id: 'questions', name: 'Вопросы', icon: '❓' },
  { id: 'stats', name: 'Статистика', icon: '📊' }
]

const showQuestionForm = (question) => {
  selectedQuestion.value = question
  activeTab.value = 'question-form'
}

const handleQuestionSubmit = () => {
  activeTab.value = 'questions'
  selectedQuestion.value = null
}
</script>

<style scoped>
.admin-view {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.admin-view__header {
  text-align: center;
  margin-bottom: 3rem;
}

.admin-view__title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
}

.admin-view__subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.25rem;
}

.admin-view__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--bg-primary);
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
}

.admin-view__tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 3px solid transparent;
}

.admin-view__tab:hover {
  color: var(--primary-color);
  background-color: var(--bg-primary);
}

.admin-view__tab--active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background-color: var(--bg-primary);
}

.admin-view__tab-icon {
  font-size: 1.25rem;
}

.admin-view__tab-text {
  font-size: 1rem;
}

.admin-view__content {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  min-height: 500px;
}

.admin-view__tab-content {
  padding: 0;
}

@media (max-width: 768px) {
  .admin-view {
    padding: 1rem 0;
  }

  .admin-view__header {
    margin-bottom: 2rem;
  }

  .admin-view__title {
    font-size: 2rem;
  }

  .admin-view__subtitle {
    font-size: 1.125rem;
  }

  .admin-view__tabs {
    flex-direction: column;
    gap: 0.25rem;
  }

  .admin-view__tab {
    border-radius: var(--border-radius);
    border-bottom: 2px solid transparent;
    justify-content: center;
  }

  .admin-view__tab--active {
    border-bottom-color: var(--primary-color);
  }
}
</style>