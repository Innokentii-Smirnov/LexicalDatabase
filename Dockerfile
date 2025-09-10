# Originally forked from: git@github.com:gasi/docker-node-hello.git

FROM docker.io/node:18.13.0

ARG email="anna@example.com"
LABEL "maintainer"=$email
LABEL "rating"="Five Stars" "class"="First Class"

USER root

ENV AP /data/app
ENV SCPATH /etc/supervisor/conf.d

RUN apt-get -y update

# The daemons
RUN apt-get -y install supervisor
RUN mkdir -p /var/log/supervisor

# Supervisor Configuration
COPY ./supervisord/conf.d/* $SCPATH/

# Application Code
WORKDIR $AP
COPY ./package.json ./
RUN npm install && npm install typescript -g
COPY ./src ./src
RUN tsc ./src/* --module NodeNext --outDir . --moduleResolution nodenext

CMD ["supervisord", "-n"]

