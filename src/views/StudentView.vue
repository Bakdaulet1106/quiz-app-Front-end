<template>
  <div class="student-view">
    <div class="container">
      <div class="student-view__header">
        <h1 class="student-view__title">Площадка для тестирования</h1>
        <p class="student-view__subtitle">
          Выберите квиз и проверьте свои знания
        </p>
      </div>

      <div class="student-view__stats">
        <div class="student-view__stat">
          <div class="student-view__stat-icon">📊</div>
          <div class="student-view__stat-info">
            <div class="student-view__stat-value">{{ resultsStore.totalQuizzesTaken }}</div>
            <div class="student-view__stat-label">Пройдено тестов</div>
          </div>
        </div>

        <div class="student-view__stat">
          <div class="student-view__stat-icon">⭐</div>
          <div class="student-view__stat-info">
            <div class="student-view__stat-value">{{ resultsStore.averageScore }}%</div>
            <div class="student-view__stat-label">Средний результат</div>
          </div>
        </div>

        <div class="student-view__stat">
          <div class="student-view__stat-icon">🎯</div>
          <div class="student-view__stat-info">
            <div class="student-view__stat-value">{{ resultsStore.bestScore }}%</div>
            <div class="student-view__stat-label">Лучший результат</div>
          </div>
        </div>
      </div>

      <QuizList />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useResultsStore } from '@/stores/results'
import QuizList from '@/components/student/QuizList.vue'

const resultsStore = useResultsStore()

onMounted(async () => {
  await resultsStore.loadResults()
})
</script>

<style scoped>
.student-view {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.student-view__header {
  text-align: center;
  margin-bottom: 3rem;
}

.student-view__title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
}

.student-view__subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.25rem;
}

.student-view__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.student-view__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}

.student-view__stat-icon {
  font-size: 2rem;
}

.student-view__stat-info {
  flex: 1;
}

.student-view__stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.student-view__stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .student-view {
    padding: 1rem 0;
  }

  .student-view__header {
    margin-bottom: 2rem;
  }

  .student-view__title {
    font-size: 2rem;
  }

  .student-view__subtitle {
    font-size: 1.125rem;
  }

  .student-view__stats {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .student-view__stat {
    padding: 1.25rem;
  }

  .student-view__stat-value {
    font-size: 1.75rem;
  }
}
</style>