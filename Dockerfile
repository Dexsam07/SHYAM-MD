FROM quay.io/qasimtech/Shyam-bot:latest

WORKDIR /root/shyam-md

RUN git clone https://github.com/Dexsam07/SHYAM-MD . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
