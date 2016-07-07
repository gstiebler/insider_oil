git pull
./install.sh
cd client
gulp deploy
cd ../server
./node_modules/typescript/bin/tsc
npm start