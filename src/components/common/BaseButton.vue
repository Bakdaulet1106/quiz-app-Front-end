<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--disabled': disabled,
        'base-button--loading': loading,
        'base-button--full-width': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" class="base-button__spinner" />
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  font-family: inherit;
}

.base-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--full-width {
  width: 100%;
}

/* Variants */
.base-button--primary {
  background-color: var(--primary-color);
  color: var(--text-light);
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.base-button--secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--primary-color);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: var(--primary-color);
  color: var(--text-light);
}

.base-button--success {
  background-color: var(--success-color);
  color: var(--text-light);
}

.base-button--success:hover:not(.base-button--disabled) {
  opacity: 0.9;
}

.base-button--danger {
  background-color: var(--danger-color);
  color: var(--text-light);
}

.base-button--danger:hover:not(.base-button--disabled) {
  opacity: 0.9;
}

.base-button--warning {
  background-color: var(--warning-color);
  color: var(--text-light);
}

.base-button--warning:hover:not(.base-button--disabled) {
  opacity: 0.9;
}

/* Sizes */
.base-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Loading state */
.base-button--loading {
  cursor: wait;
}

.base-button__spinner {
  width: 1rem;
  height: 1rem;
}

.base-button__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>