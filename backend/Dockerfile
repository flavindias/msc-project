FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY prisma ./prisma/ 


# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npx prisma generate
RUN npm install

CMD ["npm", "start"]
EXPOSE 3001