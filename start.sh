git pull
./install.sh
cd client
rm -rf out
./node_modules/gulp/bin/gulp.js deploy
cd ../server
rm -rf out
./node_modules/typescript/bin/tsc
npm start
