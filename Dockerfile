FROM node:8.2.1-alpine

ENV GTT_VERSION 1.5.4

RUN yarn global add --prefix /usr/local "gitlab-time-tracker@$GTT_VERSION"

VOLUME ["/root"]
ENTRYPOINT ["gtt"]
CMD ["--help"]
