FROM node:19

RUN apt-get update -qq

RUN mkdir /app
WORKDIR /app
COPY . .
