FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Use the -p flag to run in production mode and -H to listen on all interfaces
CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"] 