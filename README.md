This project consists of a simple create-react-app which can be deployed with zero configuration.

## Pre-requisites

- Ensure that you have the HasuraCLI installed on your machine before you continue. If not, you can find instructions to install it [here](https://docs.hasura.io/0.15/manual/install-hasura-cli.html).
- Login/signup into Hasura by running `$ hasura login` on your command shell.

## Getting the project

Run the following in your command shell

```shell
$ hasura quickstart hasura/hello-react
```

The above command does the following:
- Clones a `Hasura Project` into your local computer, into a directory called `hello-react`. The `Hasura Project` consists of the react app.
- A git remote (called hasura) is created and initialized with your `hello-react` project directory.
- Creates a **free Hasura cluster** for your account, where the project will be hosted for free.

To get information about your cluster, run the following in your terminal, inside the project directory

```shell
$ hasura cluster status
```

You will get the following output

```shell
Cluster name:       anonymity22
Cluster alias:      hasura
Kubectl context:    anonymity22
Platform version:   v0.15.28
......
```

`anonymity22` is the name of the cluster.

## Deploying the project

Deploying any project on Hasura is like pushing to a remote git repository.

```shell
# ensure that you are inside the project directory, if not, cd into it
$ git add . && git commit -m "Initial Commit"
$ git push hasura master
```

## Hosting the react app

- After deploying successfully you will have a basic create-react-app which will be available on the `ui` subdomain.

```shell
# To open the react app on your browser
$ hasura microservice open ui
```

### Viewing server logs

```shell
$ hasura microservice logs ui
```

### Understanding the directory structure

The code for the react app lives inside the `microservices` directory. Each directory inside `microservices` corresponds to a custom microservice. The name of the directory is the name of the microservice. `ui` was the name given to the react microservice, hence everything to do with the react microservice can be found inside the `ui` directory.

While it is recommended that you do look into this section. You can ignore this section as long as you do not change the following:
- The `package.json` file is inside `microservices/ui/app/` for react.
- The react app is built using the command `npm run build` and run using the serve package.
- The built react app resides inside the `microservices/ui/app/build` directory.

Everything related to a microservice can be found inside the `microservices` directory. The microservices directory structure in this case looks like:

```
.
└── microservices
    └── ui
        ├── app/
        ├── Dockerfile
        └── k8s.yaml
```

The name of the directory inside `microservices` is the name of the microservice. Hence, everything to do with the react microservice resides inside the `ui` directory. Inside the `ui` directory, you will find:

- An `app` directory:

The `app` directory contains the create-react-app source code. The content inside the `app` directory is exactly what you would get if you were to generate a new react app using create-react-app.

- `Dockerfile`

Hasura has a CI system that can build and deploy any microservice based on the Dockerfile and source code pushed to a cluster. The `Dockerfile` consists of instructions to deploy the microservice. Hence, understanding the `Dockerfile` for the react app in this project will help you in case you need to modify the way your app should be deployed or in case you want to migrate your existing react app into this project.

```
# Step 1: Pulls a simple ubuntu image with node 8 installed in it
FROM node:8

# Step 2: Make a new directory called "app"
RUN mkdir /app

# Step 3: Copy the package.json file from your local directory and paste it inside the container, inside the app directory
COPY app/package.json /app/package.json

# Step 4: cd into the app directory and run npm install to install application dependencies
RUN cd /app && npm install

# Step 5: Install serve globally to be used to serve the app
RUN npm -g install serve

# Step 6: Add all source code into the app directory from your local app directory
ADD app /app/

# Step 7: cd into the app directory and execute the npm run build command
RUN cd /app && npm run build

# Step 8: Set app as our current work directory
WORKDIR /app

# Step 9: Serve the app at port 8080 using the serve package
CMD ["serve", "-s", "build", "-p", "8080"]
```

- `k8s.yaml`

This is the kubernetes spec file that is used by Hasura. You do not need to understand exactly what this file does to use Hasura.

### Making changes and deploying

The source code for the react app can be found inside the `microservices/ui/app` directory. After you have made the necessary changes, commit and `git push hasura master` to deploy the changes.

### Update create-react-app version

Create-react-app can be updated by updating the `react-scripts` version in the `package.json` file located at `microservices/ui/app/`.

```
....
"dependencies": {
  ....
  "react-scripts": "1.0.14",
  ....
},
....
```
After changing the version, commit and `git push hasura master` to deploy the changes.

### Migrating an existing React app

If you already have a working react app that you want to deploy instead of the one given in this project, you simply have to replace the content of `microservices/ui/app` with the source code of your react app. And if needed, make the necessary changes to the Dockerfile as well, for eg, if you do not want to use `serve` to serve the react app.

### Adding environment variables

To add environment variables for the react app:
- Specify it during the `build` or `start` script
```
{
....
  "scripts": {
    "start": "REACT_APP_API_KEY=<value> react-scripts start",
    "build": "REACT_APP_API_KEY=<value> react-scripts build",
    "test": "REACT_APP_API_KEY=<value> react-scripts test --env=jsdom",
    "eject": "REACT_APP_API_KEY=<value> react-scripts eject"
  }
}
```
- Specify it in a .env file. You can get more information from the create-react-app [docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-development-environment-variables-in-env)

>Note: The Environment variable name needs to be pre-fixed with REACT_APP_

In case you want to template your environment variables, check out the docs [here](https://docs.hasura.io/0.15/manual/project/directory-structure/microservices/k8s.yaml.html#environment-variables).

### Hot reloading

Change the line starting with `CMD` in `Dockerfile` to the following:

```dockerfile
CMD ["npm", "start"]
```

Git push the changes and start the `sync` command:

```bash
$ git add microservices/ui/Dockerfile
$ git commit -m "enable hot reloading"
$ git push hasura master
$ hasura microservices sync ui microservices/ui/app/src:/app/src
```

In a new terminal, execute the command to open the microservice in a browser and make some changes to code to see it deployed live on the browser:

```bash
$ hasura microservice open ui
# edit some files inside src to see the changes live
```

## Database and using GraphQL

You can create a table in the `API Console`. To open the `API Console` run the following command in your command shell:

```bash
$ hasura api-console
```

This will automatically open the API Console on your browser. Click on the `Data` tab.

![DataTab.png](https://filestore.hasura.io/v1/file/d03c3b6a-7e93-4376-90f6-a47c2a3bbbbd)

### Creating a table

Click on the `Create Table` button. Let's create a table called `product` to store product information like the `name`, `quantity` and `price` of a product. We will also be adding an additional column `id` of type `Integer (auto increment)`. `id` will also be our primary key.

![DataCreateTable.png](https://filestore.hasura.io/v1/file/85c2061e-b75a-438a-8d5c-2d6f6b3af5c8)

Click the `Create` button to create the table.

### Mutation to insert data into the table

The GraphQL mutation to insert data into this table will be

```
mutation addProduct {
  insert_product(objects: [{"name": "Product 1", "price": "100 INR", "quantity": 10}]) {
      affected_rows
      returning {
        id
        name
        price
        quantity
      }
    }
}
```

You can test this out in the `API Explorer` by clicking on `GraphQL` on the left panel

![InsertMutation](https://filestore.hasura.io/v1/file/cb857691-1130-4e8c-87a8-d5625096a12a)

### Selecting data from the table

The GraphQL query to select data from the table would be

```
query getProducts{
  product {
    id
    name
    price
    quantity
  }
}
```

![SelectQuery](https://filestore.hasura.io/v1/file/0c2ade36-3eb9-466c-aa9e-6624044fc46c)

>Note: In both the cases above, an `Authorization` token was added as a header to the GraphQL request. This is because every table created on Hasura only is accessible to admin users by default. You can read about how to set your own custom permissions on the tables in our [docs](https://docs.hasura.io/0.15/manual/data/permissions.html). Furthermore, you can also create relationships and foreign key constraints on these tables, you can read about how to set them [here](https://docs.hasura.io/0.15/manual/data/relationships.html).

You can read more about the GraphQL APIs in our [docs](https://docs.hasura.io/0.15/manual/data/graphql.html).

### Making GraphQL Queries from the react app

We are going to be using the `Apollo Client` to make the GraphQL APIs from the react app. Follow the documentation [here](https://docs.hasura.io/0.15/manual/guides/graphql-react.html) to set it up in your react app.

### Migrations

Whenever you make any changes to the database from the `API Console`, migration files get created in the `migrations` directory. These help keep track of the database changes that you have made and help with easy migration to another cluster. For eg: Migrating changes from a staging cluster to a production cluster.

>You can read more about migrations [here](https://docs.hasura.io/0.15/manual/project/directory-structure/migrations/index.html).

## Authentication

The fastest way to add Authentication to your react app is to use the Auth UI Kit provided by Hasura.

&nbsp;
![Auth UI](https://docs.hasura.io/0.15/_images/uikit-dark.png)
&nbsp;

To enable Authentication on the react app, open up the `routes.yaml` file from the `conf/` directory. Scroll to the following portion

```yaml
- subdomain: ui
  paths:
  - path: /
    upstreamService:
      name: ui
      namespace: {{ cluster.metadata.namespaces.user }}
      path: /
      port: 80
    corsPolicy: allow_all
```

Add the following under the `- path: /`

```yaml
authorizationPolicy:
  restrictToRoles: ["user"]
  noSessionRedirectUrl: https://auth.{{ cluster.name }}.hasura-app.io/ui/
  noAccessRedirectUrl: https://auth.{{ cluster.name }}.hasura-app.io/ui/restricted
```

This is how the content of the `ui` subdomain will look like after you have made the necessary changes

```yaml
- subdomain: ui
  paths:
  - path: /
    authorizationPolicy:
      restrictToRoles: ["user"]
      noSessionRedirectUrl: https://auth.{{ cluster.name }}.hasura-app.io/ui/
      noAccessRedirectUrl: https://auth.{{ cluster.name }}.hasura-app.io/ui/restricted
    upstreamService:
      name: ui
      namespace: {{ cluster.metadata.namespaces.user }}
      path: /
      port: 80
    corsPolicy: allow_all
```

After making the above changes, you have to deploy the project for the changes to take effect. To deploy,

```bash
$ git add conf/routes.yaml && git commit -m "Added authorizationPolicy to the react app"
$ git push hasura master
```

After the deployment is complete, try opening the react app in your browser, you will be redirected to an Authentication Page.

>Note: The Auth UI Kit can be customized to fit your application. You can learn more about the Auth UI Kit [here](https://docs.hasura.io/0.15/manual/auth-ui-kit/index.html).

Alternatively, you can also use the Auth APIs directly without the Auth UI Kit. Check out our [docs](https://docs.hasura.io/0.15/manual/auth/index.html) to know more.

### Working with the Auth UI Kit Locally

To integrate the Auth UI Kit with your local workflow, you have to programmatically redirect the user to `https://auth.<CLUSTER_NAME>.hasura-app.io/ui?redirect_url=<REDIRECT_URL>`

- replace `<CLUSTER_NAME>` with the name of your cluster. You can get the name by running `$ hasura cluster status` inside the project directory.
- replace `<REDIRECT_URL>` with the url to your react app running locally (eg: `http://localhost:3000`)

Moreover, on successful authentication, the Auth UI Kit sets a cookie for the respective domain it is on. You can then just `include` this `cookie` while making subsequent requests which requires an authentication header.

#### Setting up the Apollo Client to use the Cookie

```javascript
const client = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include' // Include this to send the cookie along with every request
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
});
```

## File Upload and Download

Some apps require the ability to upload and download files, for eg: storing user profile pictures or if you are building an app like google drive. Hasura provides easy to use APIs to upload and download files as well. Under the `API Explorer` tab, explore the APIs under `File`

You can test out the filestore APIs on the `API Console`. (Open the `API Console` by running `$ hasura api-console` inside your project directory)

![Filestore](https://filestore.hasura.io/v1/file/a090fb6f-e62c-4aa2-aebf-0a9d07cb8bb0)

## Deploying other microservices

Sometimes you may also need to write your own custom APIs using a nodejs-express server or have a cron job running. You can add microservices from other quickstarts into your project

- To add a nodejs-express microservice

```bash
$ hasura microservice clone api --from hasura/hello-nodejs-express
```

You will now have this microservice inside your microservices/api directory. You can find the source code for the nodejs-express server inside microservices/api/src/server.js

Next, we have to ensure that HasuraCtl knows that this microservice needs to be git pushed. To do this, we need to add configuration to your conf/ci.yaml file so that git push hasura master will automatically deploy your source code, build the docker image, and rollout the update!

```bash
$ hasura conf generate-remote cron >> conf/ci.yaml
```

To expose the microservice via an external URL

```bash
$ hasura conf generate-route cron >> conf/routes.yaml
```

To deploy this microservice to your cluster:

```bash
# Ensure that you are inside your project directory
git add microservices/cron && git commit -m "Added nodejs express microservice"
git push hasura master
```

>You can read more about microservices in our [docs](https://docs.hasura.io/0.15/manual/microservices/index.html).
