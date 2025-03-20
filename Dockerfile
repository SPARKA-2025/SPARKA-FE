# Stage pertama: Build Aplikasi
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh source code aplikasi
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Stage kedua: Image ringan untuk production
FROM node:18-alpine

# Set working directory untuk aplikasi production
WORKDIR /app

# Salin hasil build dari stage sebelumnya
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/public /app/public

# Install runtime dependencies
RUN npm install --production

# Ekspose port untuk aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
