FROM node:16 as builder

ARG ROOT_APP_DIR=/var/www/html
WORKDIR $ROOT_APP_DIR

# Add `/app/node_modules/.bin` to $PATH
ENV PATH=$ROOT_APP_DIR/node_modules/.bin:$PATH
COPY ./package.json $ROOT_APP_DIR

# RUN npm i -g yarn
RUN yarn install && \
    yarn add react-scripts@5.0.1

FROM node:16-alpine as main

ARG ROOT_APP_DIR=/var/www/html
WORKDIR $ROOT_APP_DIR

COPY --from=builder  $ROOT_APP_DIR ./

EXPOSE 3000
#TODO: execute only for production
#RUN yarn run build

CMD ["yarn","start"]