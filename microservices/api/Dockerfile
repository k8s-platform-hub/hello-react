# Step 1: Pulls a simple ubuntu image with node 8 installed in it
FROM node:8

# Step 2: Make a new directory called "src"
RUN mkdir /src

# Step 3: Copy the package.json file from your local directory and paste it inside the container, inside the src directory
COPY src/package.json /src/package.json

# Step 4: cd into the src directory and run npm install to install application dependencies
RUN cd /src && npm install

# Step 5: Add all source code into the src directory from your local src directory
ADD src /src

# Step 6: Set src as our current work directory
WORKDIR /src

# Step 7: Run node server.js inside the src directory
CMD ["node", "server.js"]
