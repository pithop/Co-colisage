# ==============================================================================
# Stage 1: Build BagVoyage Frontend Assets with Node.js 22 Alpine
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install --prefer-offline --no-audit

# Copy source code and build SSG static bundles
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Serve optimized static bundle with Nginx 1.27 Alpine
# ==============================================================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
