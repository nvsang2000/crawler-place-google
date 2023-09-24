# Dockerfile
FROM node:16

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build
RUN npm run postinstall

# COPY
COPY . .
# define port
EXPOSE 80/tcp

# Start the server using the production build
CMD [ "node", "dist/src/main" ]
