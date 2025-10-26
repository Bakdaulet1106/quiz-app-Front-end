<template>
  <div class="quiz-card">
    <div class="quiz-card__header">
      <h3 class="quiz-card__title">{{ quiz.title }}</h3>
      <span 
        class="quiz-card__difficulty"
        :style="{ backgroundColor: getDifficultyColor(quiz.difficulty) }"
      >
        {{ getDifficultyLabel(quiz.difficulty) }}
      </span>
    </div>

    <div class="quiz-card__content">
      <div class="quiz-card__info">
        <div class="quiz-card__info-item">
          <span class="quiz-card__info-icon">📚</span>
          <span class="quiz-card__info-text">{{ quiz.category }}</span>
        </div>
        
        <div class="quiz-card__info-item">
          <span class="quiz-card__info-icon">❓</span>
          <span class="quiz-card__info-text">{{ quiz.questionCount }} вопросов</span>
        </div>

        <div class="quiz-card__info-item">
          <span class="quiz-card__info-icon">⏱️</span>
          <span class="quiz-card__info-text">~{{ estimatedTime }} мин</span>
        </div>
      </div>

      <div class="quiz-card__description">
        <p>Проверьте свои знания в категории "{{ quiz.category }}"</p>
      </div>
    </div>

    <div class="quiz-card__footer">
      <BaseButton 
        variant="primary" 
        @click="$emit('start-quiz', quiz)"
        fullWidth
        class="quiz-card__start-btn"
      >
        🚀 Начать квиз
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDifficultyColor, getDifficultyLabel } from '@/utils/helpers'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

defineEmits(['start-quiz'])

const estimatedTime = computed(() => {
  return Math.ceil((props.quiz.questionCount * 30) / 60)
})
</script>

<style scoped>
.quiz-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.quiz-card__header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 1.5rem;
  color: white;
  position: relative;
}

.quiz-card__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.quiz-card__difficulty {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quiz-card__content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quiz-card__info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quiz-card__info-icon {
  font-size: 1.125rem;
  width: 1.5rem;
  text-align: center;
}

.quiz-card__info-text {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.quiz-card__description {
  flex: 1;
  display: flex;
  align-items: center;
}

.quiz-card__description p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
}

.quiz-card__footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.quiz-card__start-btn {
  font-weight: 600;
  transition: var(--transition);
}

.quiz-card__start-btn:hover {
  transform: scale(1.02);
}

@media (max-width: 480px) {
  .quiz-card__header {
    padding: 1.25rem;
  }

  .quiz-card__content {
    padding: 1.25rem;
  }

  .quiz-card__footer {
    padding: 1.25rem;
  }
}
</style>