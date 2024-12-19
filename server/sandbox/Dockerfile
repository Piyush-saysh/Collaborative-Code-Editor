FROM node:18-alpine

WORKDIR /app

RUN adduser -D sandboxuser
USER sandboxuser

CMD ["node", "/app/usercode.js"]