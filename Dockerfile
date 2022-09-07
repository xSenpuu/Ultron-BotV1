FROM node:14

WORKDIR /usr/src/app

RUN git clone https://github.com/xSenpuu/Ultron-BotV1.git .
RUN npm install


CMD ["node", "src/bot.js"]
