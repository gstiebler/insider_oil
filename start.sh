git pull
./install.sh
cd client
gulp deploy
cd ../server
rm -rf out
./node_modules/typescript/bin/tsc
npm start