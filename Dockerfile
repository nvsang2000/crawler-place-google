# Dockerfile
FROM node:18-buster

RUN mkdir /app
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# COPY
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build
RUN npm run postinstall

# define port
EXPOSE 80/tcp

# Start the server using the production build
CMD [ "node", "dist/src/main" ]
