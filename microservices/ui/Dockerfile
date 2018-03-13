# Step 1: Pulls a simple ubuntu image with node 8 installed in it
FROM node:8

# Step 2: Install dependent software packages using apt-get
RUN apt-get update && apt-get install -y build-essential python

# Step 3: Make a new directory called "app"
RUN mkdir /app

# Step 4: Copy the package.json file from your local directory and paste it inside the container, inside the app directory
COPY app/package.json /app/package.json

# Step 5: cd into the app directory and run npm install to install application dependencies
RUN cd /app && npm install 

# Step 6: Install serve globally to be used to serve the app
RUN npm -g install serve

# Step 7: Add all source code into the app directory from your local app directory
ADD app /app/

# Step 8: cd into the app directory and execute the npm run build command
RUN cd /app && npm run build

# Step 9: Set app as our current work directory
WORKDIR /app

# Step 10: Serve the app at port 8080 using the serve package
CMD ["serve", "-s", "build", "-p", "8080"]
