npm install gulp -g
git pull
cd client
npm install
gulp deploy
cd ../server
npm install
./node_modules/typescript/bin/tsc
npm start