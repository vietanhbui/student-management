FROM node:10.16.0

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_HOST=mongodb://db:27017/student-management

ENV PORT=4040

ENV JWT_SECRET=BVA1998

EXPOSE 4040

CMD npm start