FROM node:lts-buster
RUN git clone https://github.com/srijan907/What-md/root/iksrijon
WORKDIR /root/iksrijon
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
