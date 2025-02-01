# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use a smaller image to run the production build
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the production build from the builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/chubJSONs ./src/chubJSONs

# Expose port 80
EXPOSE 80

# Set environment variable to tell Next.js to run in production mode
ENV NODE_ENV=production

# Command to start the app on port 80
CMD ["npm", "run", "start", "--", "-p", "80"]
