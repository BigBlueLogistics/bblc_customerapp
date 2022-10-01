FROM node:16-slim as builder

ARG ROOT_APP_DIR=/var/www/html
WORKDIR $ROOT_APP_DIR

# Add `/app/node_modules/.bin` to $PATH
ENV PATH=$ROOT_APP_DIR/node_modules/.bin:$PATH

COPY --chown=node:node . $ROOT_APP_DIR

RUN npm install

FROM node:16-alpine as main

ARG ROOT_APP_DIR=/var/www/html
WORKDIR $ROOT_APP_DIR

COPY --from=builder $ROOT_APP_DIR ./

EXPOSE 3000
# TODO: execute only for production
# current user should add to sudo groups and 
# update the ownership of /build folder to current user

#RUN yarn run build

CMD ["yarn","start"]