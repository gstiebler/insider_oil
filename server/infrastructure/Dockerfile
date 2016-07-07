FROM node:argon

WORKDIR /usr/src
RUN git clone https://e5cf28f763f512329e2b83db2b57884597f222dd:x-oauth-basic@github.com/gstiebler/insider_oil.git
WORKDIR /usr/src/insider_oil

RUN chmod +x install.sh
RUN chmod +x start.sh
RUN ./install.sh

EXPOSE 80
CMD bash -C '/usr/src/insider_oil/start.sh'
