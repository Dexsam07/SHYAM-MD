FROM quay.io/dexsam07/shyam-md:latest

WORKDIR /root/shyam-md

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:optimized"]
