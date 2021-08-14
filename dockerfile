FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080

# Build project from typescript to js
RUN npm run build

CMD ["node", "build/index.js"]
