FROM node:11.14.0-alpine
WORKDIR /code
RUN npm install -g yarn
COPY package.json /code/
RUN yarn install
COPY ./ /code/
CMD ["yarn", "start"]