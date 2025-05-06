FROM node:18-alpine AS builder

WORKDIR /app

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:8000
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including dev dependencies needed for build
RUN npm ci && \
    npm install -g tailwindcss postcss autoprefixer && \
    npm install --save-dev tailwindcss postcss autoprefixer

# Copy configuration files first (specifically for tailwind)
COPY tailwind.config.js postcss.config.js ./

# Copy the rest of the application code
COPY . .

# Create an empty .env.production file 
RUN touch .env.production

# Build the application with better error handling
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build || (echo "Build failed. See error details above." && exit 1)

# Production image
FROM node:18-alpine

WORKDIR /app

# Set environment variables for runtime
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# Copy from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]