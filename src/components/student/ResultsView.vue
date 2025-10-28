<template>
  <div class="student-results-view">
    <BaseCard>
      <div class="results-summary">
        <div class="score-section">
          <div class="score-circle">
            <div class="score-value">{{ score }}%</div>
            <div class="score-label">Your Score</div>
          </div>
        </div>
        
        <div class="results-details">
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-value">{{ correctAnswers }}</div>
              <div class="detail-label">Correct</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{{ totalQuestions - correctAnswers }}</div>
              <div class="detail-label">Incorrect</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{{ totalQuestions }}</div>
              <div class="detail-label">Total</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{{ formatTime(timeSpent) }}</div>
              <div class="detail-label">Time Spent</div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <div class="performance-feedback">
      <h3>Performance Feedback</h3>
      <div class="feedback-message" :class="performanceClass">
        {{ performanceMessage }}
      </div>
    </div>

    <div class="quick-actions">
      <BaseButton @click="$emit('review-questions')" variant="outline">
        Review Questions
      </BaseButton>
      <BaseButton @click="$emit('retake-quiz')" variant="primary">
        Retake Quiz
      </BaseButton>
      <BaseButton @click="$emit('new-quiz')" variant="secondary">
        Take New Quiz
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseCard from '../common/BaseCard.vue'
import BaseButton from '../common/BaseButton.vue'
import { formatTime } from '../../utils/helpers'

export default {
  name: 'StudentResultsView',
  components: {
    BaseCard,
    BaseButton
  },
  props: {
    score: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true
    }
  },
  emits: ['review-questions', 'retake-quiz', 'new-quiz'],
  setup(props) {
    const performanceClass = computed(() => {
      if (props.score >= 80) return 'excellent'
      if (props.score >= 60) return 'good'
      if (props.score >= 40) return 'average'
      return 'poor'
    })

    const performanceMessage = computed(() => {
      if (props.score >= 90) return 'Outstanding! You have excellent knowledge of this topic.'
      if (props.score >= 80) return 'Great job! You have a strong understanding of this material.'
      if (props.score >= 70) return 'Good work! You have a solid grasp of the concepts.'
      if (props.score >= 60) return 'Not bad! You understand the basics but could use some review.'
      if (props.score >= 50) return 'Keep practicing! Review the material and try again.'
      return 'Don\'t give up! Review the questions and try the quiz again.'
    })

    return {
      formatTime,
      performanceClass,
      performanceMessage
    }
  }
}
</script>

<style scoped>
.student-results-view {
  max-width: 600px;
  margin: 0 auto;
}

.results-summary {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-6);
}

.score-section {
  flex-shrink: 0;
}

.score-circle {
  text-align: center;
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-600);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.score-label {
  color: var(--gray-600);
  font-weight: 500;
  font-size: var(--text-sm);
}

.results-details {
  flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.detail-item {
  text-align: center;
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius);
}

.detail-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.detail-label {
  color: var(--gray-600);
  font-size: var(--text-sm);
  font-weight: 500;
}

.performance-feedback {
  margin: var(--space-6) 0;
  text-align: center;
}

.performance-feedback h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.feedback-message {
  padding: var(--space-4);
  border-radius: var(--radius);
  font-weight: 500;
  line-height: 1.5;
}

.feedback-message.excellent {
  background: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

.feedback-message.good {
  background: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
}

.feedback-message.average {
  background: var(--warning-50);
  color: var(--warning-700);
  border: 1px solid var(--warning-200);
}

.feedback-message.poor {
  background: var(--error-50);
  color: var(--error-700);
  border: 1px solid var(--error-200);
}

.quick-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .results-summary {
    flex-direction: column;
    text-align: center;
    gap: var(--space-6);
  }
  
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions .base-button {
    width: 100%;
  }
}
</style>