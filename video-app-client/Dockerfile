# Sử dụng Node.js làm base image
FROM node:22-alpine

# Cài đặt công cụ 'serve' để phục vụ file tĩnh
RUN npm install -g serve

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy thư mục build vào container
COPY ./dist/video-app-client/browser /app

# Expose port 3000 (hoặc port khác bạn muốn sử dụng)
EXPOSE 4200

# Chạy ứng dụng với 'serve'
CMD ["serve", "-s", ".", "-l", "4200"]