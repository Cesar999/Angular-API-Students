FROM node:10.8.0-alpine as node
COPY server.js .
COPY package.json .
COPY urls_const.js .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
