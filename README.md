# QuizMaster - Modern Quiz Application

A full-featured quiz application built with Vue 3, Pinia, and Vite. Features role-based access (Admin/Student), timed quizzes, random question selection, and comprehensive result tracking.

## Features

### 🎯 Core Features
- **Role-based Access**: Separate interfaces for Admins and Students
- **Timed Quizzes**: Configurable time limits with visual timer
- **Random Question Selection**: Automatic question shuffling
- **Progress Tracking**: Save and resume quiz progress
- **Comprehensive Results**: Detailed analytics and question review

### 👨‍🏫 Admin Features
- Create and manage quizzes
- Build question bank with categories and difficulty levels
- View platform analytics and student performance
- Manage quiz settings and availability

### 👨‍🎓 Student Features
- Browse available quizzes
- Take timed quizzes with progress saving
- Review results with detailed explanations
- Track personal progress over time

## Tech Stack

- **Frontend**: Vue 3 + Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **API**: JSON Server (Mock backend)
- **Storage**: LocalStorage/IndexedDB for offline support
- **Styling**: CSS3 with CSS Variables
- **Code Quality**: ESLint + Prettier

## Project Structure

quiz-app/
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 eslint.config.js
├── 📄 prettier.config.js
├── 📄 db.json
├── 📄 README.md
├── 📁 public/
│   └── 🎨 favicon.svg
└── 📁 src/
    ├── 🚀 main.js
    ├── 🎯 App.vue
    ├── 📁 assets/
    │   └── 📁 styles/
    │       ├── 🎨 main.css
    │       └── 🎨 variables.css
    ├── 📁 components/
    │   ├── 📁 common/
    │   │   ├── 🎯 BaseButton.vue
    │   │   ├── 🎯 BaseCard.vue
    │   │   ├── 🎯 BaseModal.vue
    │   │   └── 🎯 LoadingSpinner.vue
    │   ├── 📁 layout/
    │   │   ├── 🎯 AppHeader.vue
    │   │   └── 🎯 AppFooter.vue
    │   ├── 📁 auth/
    │   │   ├── 🎯 LoginForm.vue
    │   │   └── 🎯 RegisterForm.vue
    │   ├── 📁 admin/
    │   │   ├── 🎯 QuestionForm.vue
    │   │   ├── 🎯 QuestionList.vue
    │   │   └── 🎯 QuizManager.vue
    │   └── 📁 student/
    │       ├── 🎯 QuizCard.vue
    │       ├── 🎯 QuizTimer.vue
    │       ├── 🎯 QuestionDisplay.vue
    │       └── 🎯 ResultsView.vue
    ├── 📁 views/
    │   ├── 🖼️ LoginView.vue
    │   ├── 🖼️ RegisterView.vue
    │   ├── 🖼️ DashboardView.vue
    │   ├── 🖼️ AdminView.vue
    │   ├── 🖼️ QuizListView.vue
    │   ├── 🖼️ QuizView.vue
    │   └── 🖼️ ResultsView.vue
    ├── 📁 stores/
    │   ├── 🔧 auth.js
    │   ├── 🔧 questions.js
    │   ├── 🔧 quizzes.js
    │   └── 🔧 results.js
    ├── 📁 services/
    │   ├── 🔧 api.js
    │   ├── 🔧 authService.js
    │   ├── 🔧 questionService.js
    │   ├── 🔧 quizService.js
    │   └── 🔧 storageService.js
    ├── 📁 router/
    │   └── 🔧 index.js
    └── 📁 utils/
        ├── 🔧 constants.js
        ├── 🔧 helpers.js
        └── 🔧 validators.js

📋 СПИСОК ВСЕХ ФАЙЛОВ (44 файла)
🏗️ КОРНЕВЫЕ ФАЙЛЫ (6 файлов)
index.html - Главный HTML файл

package.json - Зависимости и скрипты

vite.config.js - Конфигурация Vite

eslint.config.js - Конфигурация ESLint

prettier.config.js - Конфигурация Prettier

db.json - База данных JSON Server

🎨 ПУБЛИЧНЫЕ АССЕТЫ (1 файл)
public/favicon.svg - Иконка приложения

🚀 ИСХОДНЫЙ КОД SRC (37 файлов)
📁 Assets (2 файла)
src/assets/styles/variables.css - CSS переменные

src/assets/styles/main.css - Основные стили

📁 Components (15 файлов)
src/components/common/BaseButton.vue - Базовая кнопка

src/components/common/BaseCard.vue - Карточка

src/components/common/BaseModal.vue - Модальное окно

src/components/common/LoadingSpinner.vue - Индикатор загрузки

src/components/layout/AppHeader.vue - Шапка приложения

src/components/layout/AppFooter.vue - Подвал приложения

src/components/auth/LoginForm.vue - Форма входа

src/components/auth/RegisterForm.vue - Форма регистрации

src/components/admin/QuestionForm.vue - Форма создания вопроса

src/components/admin/QuestionList.vue - Список вопросов

src/components/admin/QuizManager.vue - Управление квизами

src/components/student/QuizCard.vue - Карточка квиза

src/components/student/QuizTimer.vue - Таймер квиза

src/components/student/QuestionDisplay.vue - Отображение вопроса

src/components/student/ResultsView.vue - Просмотр результатов

📁 Views (7 файлов)
src/views/LoginView.vue - Страница входа

src/views/RegisterView.vue - Страница регистрации

src/views/DashboardView.vue - Главная страница

src/views/AdminView.vue - Админ панель

src/views/QuizListView.vue - Список квизов

src/views/QuizView.vue - Страница прохождения квиза

src/views/ResultsView.vue - Страница результатов

📁 Stores (4 файла)
src/stores/auth.js - Хранилище аутентификации

src/stores/questions.js - Хранилище вопросов

src/stores/quizzes.js - Хранилище квизов

src/stores/results.js - Хранилище результатов

📁 Services (5 файлов)
src/services/api.js - API клиент

src/services/authService.js - Сервис аутентификации

src/services/questionService.js - Сервис вопросов

src/services/quizService.js - Сервис квизов

src/services/storageService.js - Сервис локального хранилища

📁 Router (1 файл)
src/router/index.js - Конфигурация маршрутизатора

📁 Utils (3 файла)
src/utils/constants.js - Константы приложения

src/utils/helpers.js - Вспомогательные функции

src/utils/validators.js - Валидаторы форм

🎯 Основные файлы (2 файла)
src/main.js - Точка входа приложения

src/App.vue - Корневой компонент

🎯 ОСНОВНЫЕ ФУНКЦИОНАЛЬНЫЕ БЛОКИ
🔐 Аутентификация
Login/Register формы с валидацией

Ролевая модель (Admin/Student)

JWT-токены (симуляция)

Защищенные маршруты

📊 Админ панель
Управление вопросами (CRUD)

Создание квизов с выбором вопросов

Аналитика платформы

Просмотр результатов студентов

🎓 Студентский интерфейс
Просмотр доступных квизов

Таймер и прогресс-бар

Сохранение прогресса

Детальные результаты

⚡ Технические особенности
Vue 3 Composition API

Pinia для state management

Vue Router для навигации

Vite для сборки

Адаптивный дизайн

Оффлайн-поддержка

Default Users
Admin Account
Email: galymzhan02@quiz.com

Password: galymzhan02

Role: Admin

Student Account
Email: bakdaulet11062005@gmail.com

Password: ABBA1106

Role: Student