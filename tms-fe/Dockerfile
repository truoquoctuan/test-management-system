# #Build stage
# FROM node:16.14.2-alpine as build-stage
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# #Production
# FROM nginx:1.17-alpine as production-stage
# COPY --from=build-stage /app/build /usr/share/nginx/html

# COPY default.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD [ "nginx", "-g", "daemon off;" ]

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5893

CMD ["npm", "start"]