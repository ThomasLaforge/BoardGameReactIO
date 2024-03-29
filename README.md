# BoardGameReactIO

## Goal

This project is the a web site to play boardgames with your friends.

## Installation

### Dev 
    - npm run compile  
    - add package.json on build/src/common   
    - cd build/src/common  
    - npm link  
    - cd ../../../src/client  
    - npm link boardgamereactio-common  
    - cd ../../..  
    - npm run server   
    - npm run client  

### Publish:
    - npm i
    - cd src/client && npm i
    - run "npm run build:server"  
    - run "npm run build:client"  
    - copy client build on main build folder => cp -r src/client/build build client  
    - scp -r build package.json USER@DOMAIN:/var/services/web/www/YOUR_DIRECTORY  
    - ssh USER@DOMAIN  
    - cd /var/services/web/www/boardgame-react-io  
    - npm install  
    - npm run dev:server  

# Docker
docker build .
docker image ls
docker run -d -p 3000:3027 DOCKER_IMAGE_ID

go to localhost:3000

MIT License

Copyright (c) 2019 Thomas Laforge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.