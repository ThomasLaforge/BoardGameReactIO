# LimiteLimite

To install for dev: 
    - run "npm run compile"
    - add package.json on build/src/common 
    - cd build/src/common
    - npm link
    - cd ../../../src/client
    - npm link limitelimite-common
    - cd ../../..
    - npm run server 
    - npm run client

Install on NAS:
    - run "npm run build:server"
    - run "npm run build:client"
    - copy client build on main build folder => cp -r src/client/build build client
    - scp -r build package.json nastomju@192.168.1.23:/var/services/web/www/testScp
    - ssh nastomju@192.168.1.23
    - cd /var/services/web/www/testScp
    - npm install
    - npm start