<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="logo">
            <div class="logo-icon">Q</div>
            <span class="logo-text">QuizMaster</span>
          </div>
          <p class="footer-description">
            Modern quiz platform for students and educators. 
            Test your knowledge and track your progress.
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <router-link to="/" class="footer-link">Dashboard</router-link>
          <router-link to="/quizzes" class="footer-link">Quizzes</router-link>
          <router-link to="/results" class="footer-link">Results</router-link>
        </div>
        
        <div class="footer-section">
          <h4>Support</h4>
          <a href="#" class="footer-link">Help Center</a>
          <a href="#" class="footer-link">Contact Us</a>
          <a href="#" class="footer-link">Privacy Policy</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 QuizMaster. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background: var(--gray-800);
  color: white;
  padding: var(--space-8) 0 var(--space-4);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.footer-section h4 {
  margin-bottom: var(--space-4);
  color: white;
  font-size: var(--text-lg);
}

.footer-description {
  color: var(--gray-300);
  line-height: 1.6;
  margin-top: var(--space-3);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: bold;
  font-size: var(--text-xl);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.footer-link {
  display: block;
  color: var(--gray-300);
  text-decoration: none;
  margin-bottom: var(--space-2);
  transition: var(--transition);
}

.footer-link:hover {
  color: var(--primary-300);
}

.footer-bottom {
  border-top: 1px solid var(--gray-700);
  padding-top: var(--space-4);
  text-align: center;
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}
</style>