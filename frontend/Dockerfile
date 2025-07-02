# Dockerfile для готового Next.js билда
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем только production зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем готовый билд
COPY .next ./.next
COPY public ./public

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

# Запускаем Next.js в production режиме
CMD ["npm", "start"] 