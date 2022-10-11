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

FROM main as app_dev
EXPOSE 15694
CMD ["yarn","start"]

# TODO: execute only for production
# current user should add to sudo groups and 
# update the ownership of /build folder to current user

FROM main as app_prod
CMD ["yarn","build"]