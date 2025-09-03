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

RUN npm install typescript
RUN npm install @types/node
RUN tsc src --module es6 --outDir

# Application Code
COPY src $AP/

WORKDIR $AP

RUN npm install

CMD ["supervisord", "-n"]

