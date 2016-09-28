git clone https://e5cf28f763f512329e2b83db2b57884597f222dd:x-oauth-basic@github.com/gstiebler/insider_oil.git
cd insider_oil/server
npm install
./node_modules/typescript/bin/tsc
nodeunit out/test