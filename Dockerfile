FROM node:10-alpine

RUN npm install typescript -g 

COPY ./src/ ./src/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY package-lock.json .

# Installs
RUN npm install
RUN cd src/client && npm install

# Link Common
RUN npm run link
RUN npm run build

RUN cp -r /src/client/build/* /build/src/client/

CMD npm start