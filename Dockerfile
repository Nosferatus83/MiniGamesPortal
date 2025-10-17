# Этап 1: Сборка приложения
FROM node:18-alpine AS build

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Установка зависимостей
# --legacy-peer-deps может быть нужен для некоторых проектов, оставляем его
RUN npm install --legacy-peer-deps

# Копирование всех остальных файлов проекта
COPY . .

# Установка переменной окружения для совместимости с OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider
# Сборка приложения
RUN npm run build

# Этап 2: Запуск приложения с помощью Nginx
FROM nginx:stable-alpine

# Копирование собранных файлов из этапа сборки
COPY --from=build /app/build /usr/share/nginx/html

# Открытие порта 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]