# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Cài đặt dependencies
# RUN npm install --only=production
RUN npm install

# Copy mã nguồn ứng dụng
COPY dist ./dist

# Stage 2: Deployment Stage
FROM node:22-alpine

WORKDIR /app

# Copy thư mục dist và node_modules từ stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]