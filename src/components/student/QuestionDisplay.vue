<template>
  <div class="question-display">
    <div class="question-header">
      <h3 class="question-text">{{ question.question }}</h3>
      <div class="question-meta">
        <span class="meta-badge" :style="{ backgroundColor: getDifficultyColor(question.difficulty) }">
          {{ question.difficulty }}
        </span>
        <span class="meta-badge category">{{ question.category }}</span>
      </div>
    </div>

    <div class="options-list">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        @click="!isReview && !showCorrect && handleOptionSelect(index)"
        :class="[
          'option-item',
          {
            'selected': selectedAnswer === index,
            'correct': showCorrect && index === question.correctAnswer,
            'incorrect': showCorrect && selectedAnswer === index && selectedAnswer !== question.correctAnswer,
            'disabled': isReview || showCorrect
          }
        ]"
      >
        <div class="option-marker">
          <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
        </div>
        <div class="option-content">
          {{ option }}
        </div>
        <div v-if="showCorrect" class="option-status">
          <span v-if="index === question.correctAnswer" class="correct-icon">✓</span>
          <span v-else-if="selectedAnswer === index && selectedAnswer !== question.correctAnswer" class="incorrect-icon">✗</span>
        </div>
      </div>
    </div>

    <div v-if="showCorrect && question.explanation" class="explanation">
      <strong>Explanation:</strong> {{ question.explanation }}
    </div>
  </div>
</template>

<script>
import { getDifficultyColor } from '../../utils/helpers'

export default {
  name: 'QuestionDisplay',
  props: {
    question: {
      type: Object,
      required: true
    },
    selectedAnswer: {
      type: Number,
      default: undefined
    },
    showCorrect: {
      type: Boolean,
      default: false
    },
    isReview: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answer-selected'],
  setup(props, { emit }) {
    const handleOptionSelect = (index) => {
      if (!props.isReview && !props.showCorrect) {
        emit('answer-selected', index)
      }
    }

    return {
      getDifficultyColor,
      handleOptionSelect
    }
  }
}
</script>

<style scoped>
.question-display {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.question-header {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
}

.question-text {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
  line-height: 1.5;
}

.question-meta {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.meta-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-size: var(--text-xs);
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

.meta-badge.category {
  background: var(--gray-500);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.option-item:hover:not(.disabled) {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.option-item.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.option-item.correct {
  border-color: var(--success-500);
  background: var(--success-50);
}

.option-item.incorrect {
  border-color: var(--error-500);
  background: var(--error-50);
}

.option-item.disabled {
  cursor: default;
}

.option-marker {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
}

.option-item:hover:not(.disabled) .option-marker {
  border-color: var(--primary-500);
}

.option-item.selected .option-marker {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.option-item.correct .option-marker {
  background: var(--success-500);
  border-color: var(--success-500);
  color: white;
}

.option-item.incorrect .option-marker {
  background: var(--error-500);
  border-color: var(--error-500);
  color: white;
}

.option-letter {
  font-weight: 600;
  font-size: var(--text-sm);
}

.option-content {
  flex: 1;
  font-weight: 500;
  color: var(--gray-700);
}

.option-item.correct .option-content,
.option-item.incorrect .option-content {
  font-weight: 600;
}

.option-status {
  margin-left: auto;
}

.correct-icon {
  color: var(--success-500);
  font-weight: bold;
  font-size: var(--text-lg);
}

.incorrect-icon {
  color: var(--error-500);
  font-weight: bold;
  font-size: var(--text-lg);
}

.explanation {
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius);
  border-left: 4px solid var(--primary-500);
  color: var(--gray-700);
  line-height: 1.5;
}

.explanation strong {
  color: var(--gray-900);
}

@media (max-width: 640px) {
  .question-display {
    padding: var(--space-4);
  }
  
  .option-item {
    padding: var(--space-3);
  }
  
  .option-marker {
    width: 28px;
    height: 28px;
  }
}
</style>