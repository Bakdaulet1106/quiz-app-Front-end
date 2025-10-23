<template>
  <div :class="['loading-spinner', `loading-spinner--${size}`]">
    <div class="loading-spinner__circle"></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner__circle {
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner--small .loading-spinner__circle {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.loading-spinner--medium .loading-spinner__circle {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.loading-spinner--large .loading-spinner__circle {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>