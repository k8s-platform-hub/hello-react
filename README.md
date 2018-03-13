This is a simple guide to deploying a basic create-react-app and a simple Node server(Express) on Hasura with zero configuration. Moreover, the guide also explores the various Hasura backend components which you can leverage to develop your application.

## Pre-requisites

- Ensure that you have the HasuraCLI installed on your machine before you continue. If not, you can find instructions to install it [here](https://docs.hasura.io/0.15/manual/install-hasura-cli.html).
- Login/signup into Hasura by running `$ hasura login` on your command shell.

## Getting the project

Run the following in your command shell

```shell
$ hasura quickstart hasura/hello-react
```

The above command does the following:
- Clones a `Hasura Project` into your local computer, into a directory called `hello-react`. The `Hasura Project` consists of the react and the nodejs app.
- A git remote (called hasura) is created and initialized with your `hello-react` project directory.
- Creates a **free Hasura cluster** for your account, where the project will be hosted for free.

#### What is a Hasura cluster ?

A Hasura cluster is a cluster of nodes (VMs) on the cloud that can host any Hasura project. It has all the Hasura microservices running and the necessary tooling for you to deploy your Hasura project. Every Hasura cluster comes with a name and a domain attached to it as well. Eg: awesome45.hasura-app.io.

To get information about your cluster

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

#### What is a Hasura Project ?

A Hasura project is a folder on your filesystem that contains all the source code and configuration for your application. A hasura project has a particular structure and the best way to create a hasura project is by cloning one from [Hasura Hub](https://hasura.io/hub).

Everything resides inside the Hasura Project, be it your application code(react and node in this case) or your cluster configuration. This simple design is powerful because it helps you version control all of your work, including configuration changes which are otherwise done using a GUI making and enables easy collaboration.

## Deploying the project

Deploying any project on Hasura is like pushing to a remote git repository.

```shell
$ cd hello-react
$ git add . && git commit -m "Initial Commit"
$ git push hasura master
```

### What have I deployed ?

You have deployed the Hasura Project on to your free cluster(In this case, `anonymity22`). The Hasura project in this case consisted of two `Custom microservices`,

- A basic create-react-app which will be available on the `ui` subdomain.

```shell
# To open the react app on your browser
$ hasura microservice open ui
```

- A basic nodejs express server running on the `api` subdomain

```shell
# To open the base route on your browser
$ hasura microservice open api
```

#### What is a Microservice ?

Microservices are basically services running on your cluster that provide certain functionalities. They can be your web app, a server, a cron job etc...

Every microservice has a name associated with it which you specify while creating it. In this case, the react microservice is called `ui` and the node microservice is called `api`.

Every Hasura cluster also comes with a set of default microservices, like, `auth` is the microservice which provides you with instant authentication APIs, `data` provides you with JSON APIs to directly connect with a `postgres` database and so on. We will be exploring the various default microservices provided by Hasura in the coming sections.

To get a list of microservices running on your project,

```shell
$ hasura microservice list
```

Although, you will see a list with many microservices, only the ones with an `EXTERNAL-URL` are accessible by you, the others are used by `Hasura` internally.

## Viewing server logs

For the react app:

```shell
$ hasura microservice logs ui
```

For the node app:

```shell
$ hasura microservice logs api
```

Basically, you run `$ hasura microservice logs <microservice-name>` to get the logs for a custom microservice.

>Note: To get the logs for any default microservice, you need to run `$ hasura microservice logs <default-microservice-name> -n hasura`

## Understanding the microservices directory structure

>tl;dr: Each directory inside `microservices` corresponds to a custom microservice. The name of the directory is the name of the microservice. `ui` was the name given to the react microservice, hence everything to do with the react microservice can be found inside the `ui` directory.
While it is recommended that you do look into this section. You can ignore this section as long as you do not change the following:
- The `package.json` file is inside `microservices/ui/app/` for react and inside `microservices/api/src` for the node server.
- The react app is built using the command `npm run build` and run using the serve package. The node server is run using `node server.js`.
- The built react app resides inside the `microservices/ui/app/build` directory.

Everything related to a microservice can be found inside the `microservices` directory. The microservices directory structure in this case looks like:

```
.
└── microservices
    ├── api
    |   ├── src/
    |   ├── Dockerfile
    │   └── k8s.yaml
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
```

- `k8s.yaml`

This is the kubernetes spec file that is used by Hasura. You do not need to understand exactly what this file does to use Hasura. We will be using this file for certain things later on in this guide.

Similarly, you can examine the `microservices/api` directory as well and you will find that it has a similar structure as the `microservices/ui` directory in the sense that there is a directory(`app` for react and `src` for node) which consists of all the source code for the app being deployed as a microservice, a `Dockerfile` and a `k8s.yaml` file.

>Understanding node-express's Dockerfile

```Dockerfile
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
```

## Making changes and deploying

The source code for the react app can be found inside the `microservices/ui/app` directory. After you have made the necessary changes, commit and `git push hasura master` to deploy the changes.

Similarly, the source code for the nodejs server is inside the `microservices/api/src` directory.

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

If you already have a working react app that you want to deploy instead of the one given in this project, you simply have to replace the content of `microservices/ui/app` with the source code of your react app. And if needed, make the necessary changes to the Dockerfile as well, for eg, if you do not want to use `serve` to serve the react app. The same applies to the nodejs-express server.

## Adding environment variables

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

## API console

Apart from helping you deploy your applications really quick, Hasura also provides you with various backend APIs which you can leverage to develop your application faster.

The `API Console` is a web UI to help you manage and explore the various backend components provided by Hasura. Run the following in your command shell to open the API console:

```bash
$ hasura api-console
```

This will automatically open the API Console on your browser.

### The API Explorer

What you see in the picture below is the `API Explorer`, this is where you can try out and experiment with the APIs of the various backend features. Explore the panel on the left to try out the different APIs.

&nbsp;
![api-explorer.png](https://filestore.hasura.io/v1/file/463f07f7-299d-455e-a6f8-ff2599ca8402)
&nbsp;

### The Code Generator

Another nifty feature of the `API Explorer` is the `API Code Generator`. For every request that you try out on the `API Explorer`, you can generate working code in a variety of languages. Click on the `Generate API Code` button on the top right to see the Code Generator in action.

&nbsp;
![CodeGen.png](https://filestore.hasura.io/v1/file/28e9dab3-8daf-4b4f-8327-46175cb37e06)
&nbsp;

### The Learning Center

The `API Console` also consists of a `Learning Center` which consists of tutorials that you can follow to understand and learn the Hasura backend features.

![LearningCenter.png](https://filestore.hasura.io/v1/file/91cde1f6-1cf2-4f31-aa62-2260a70f3ca9)

## Adding Authentication to your app

Hasura provides instant authentication APIs that you can directly use in your apps. The APIs support various types of Authentication like `Username/Password`, `Email/Password` with email verification, `Mobile/Otp` and also social login like `Facebook`, `Google`, `Github` and `LinkedIn`. The quickest way to explore these APIs is the `API Explorer` under `Auth` in the panel on the left. Let's take a look at a simple `Username/Password` API:

### Signup

From the panel on the left, click on `SignUp` under `Username/Password`. Next, fill up your required username and password.

&nbsp;
![AuthSignUp.png](https://filestore.hasura.io/v1/file/b52aaa36-75a4-40e6-8b55-c7c3c0ddac4a)
&nbsp;

We are going with the username "jacksniper" and password "jack@sniper". You can choose any username and password combination. Once you have decided on your username and password, hit on the `Send` button to Sign Up. Your response would look like:

```json
{
    "auth_token": "9cea876c07de13d8336c4a6d80fa9f64648506bc20974fd2",
    "username": "jacksniper",
    "hasura_id": 2,
    "hasura_roles": [
        "user"
    ]
}
```

- **auth_token** is the authorization token for this particular user, which we will use later to access authorized information. You should save this offline in your app to avoid making your user login each time.
- **hasura_id** is the id of the user that is automatically assigned by Hasura on signing up. You should save this offline as well.
- **hasura_roles** are the roles associated with this user. Keep in mind that the role associated with this user is `user`. This is default behaviour. We will get to where this comes into play in a bit.


### Login

Now that we have created a user using the signup endpoint, we can login with the same credentials. Click on `Login` under `Username/Password`. Enter in the same username and password that you used to sign up above and click on `Send`.

![AuthLogIn.png](https://filestore.hasura.io/v1/file/3a0b6ccf-9863-41b2-a4c3-6717017b18bd)

In the response that you get, you will see that the `hasura_id` key has the same value as the one you got after you signed up. In this case, that value is 2.

### Authenticated user requests

To perform any authenticated request, you need the user's authentication token (auth_token from the login/signup endpoint) and pass that as a header.

You can find a list of these APIs under the `Logged in User Actions` title on the left panel.

Let's check out one such API. In the `API Explorer` of the `API Console`, click on `User Information` under `Logged in User Actions` and hit the `Send` button.

![AuthUserInfoLoggedOut.png](https://filestore.hasura.io/v1/file/24445f6a-e363-428c-87f4-b06e1f24f911)

We get the following response:

```json
{
    "code": "unauthorized",
    "message": "you have to be a logged in user",
    "detail": null
}
```

This is because we have not passed the auth_token in the header. Add a new header to the request with key `Authorization` and value `Bearer <auth_token>` (replace `<auth_token>` with the auth_token that you received from your login/signup request. If you did not save it, perform a login request with the same username and password to get an auth_token again)

Hit the `Send` button after adding the `Authorization` header. You will receive a response similar to the one you received after login/signup.

![AuthUserInfo.png](https://filestore.hasura.io/v1/file/37ef4ad7-55ba-43d7-a904-a8513129223e)

>These Authentication APIs are because of the `auth` microservice which comes by default with every Hasura Cluster. And every API related to the `auth` microservice is at `https://auth.<cluster-name>.hasura-app.io`

## Auth UI Kit

Every project comes with an Authentication kit, you can restrict the access to your app to specific user roles.
It comes with a UI for Signup and Login pages out of the box, which takes care of user registration and signing in.

![Auth UI](https://docs.hasura.io/0.15/_images/uikit-dark.png)

>You can read more about the AUTH UI Kit [here](https://docs.hasura.io/0.15/manual/users/uikit.html).

## Database

Hasura comes with data APIs which run on top of a Postgres database to store and retrieve data. To fetch associated data, one can define relationships on tables. Permissions can then be used to authorize the access to data based on user roles.

Head to the `API Console` and click on the `Data` tab

![DataTab.png](https://filestore.hasura.io/v1/file/d03c3b6a-7e93-4376-90f6-a47c2a3bbbbd)

### Creating a table

Click on the `Create Table` button. Let's start off with a table called `user_details` which we will use to store extra information about a user, like their name and gender. We will also be adding an additional column `user_id` to store the `hasura_id` of the user. `user_id` will also be our primary key as the `hasura_id` for every user is always unique.

![DataCreateTable.png](https://filestore.hasura.io/v1/file/920e5e38-66e8-4858-9e32-329205a79917)

Click the `Create` button to create the table.

### Table Permissions & User Roles

Every table created on Hasura can only be accessed by users with an `admin` role. Ergo, the user we created earlier will not be able to access the `user_details` table (since the role associated with that user was `user`). This is done to ensure security on all tables, so that nobody can randomly access data from your database unless you specifically allow that.

>You can read more about roles [here](https://docs.hasura.io/0.15/manual/user-roles/index.html).

In our case, `user_details` table is used to store user specific data. Hence, we want to give every logged in user, permission to insert and select their own data from the `user_details` table. Moreover, as an extra security measure, they should not be able to fetch another users data either.

Under the `Data` tab of the `API Console`, select `user_details` from the left panel and then click on the `Permissions` tab on the right to set permissions for the table. As you can see, an `admin` role has complete permission over the table. No other role has any permission.

![DataPermissions.png](https://filestore.hasura.io/v1/file/be50777b-ece2-444f-9886-5c73f08836a8)

**First**, lets give the `user` role permission to insert data into the table. To do this, click on insert next to user row, check the `with custom check` option, choose `user_id` from the drop down and then select `$eq` and finally click on `X-Hasura-User-Id`. Click on `Save Permissions`.

![DataPermissionsInsert.png](https://filestore.hasura.io/v1/file/2ac519fb-463d-46df-97ed-20984649cd6e)

The permissions set above translates to: *Allow a user to insert into the `user_details` table only if the `user_id` being inserted is the same as the `hasura_id` associated with the user's `auth_token` which is passed as the Authorization token in the header*

**Second**, lets give the `user` role permission to get their data from the table. Click on select next to the user row, check the `with same checks as insert`, also click on the `Toggle All` button next to `With Access to columns`. Click on `Save Permissions`.

![DataPermissionsSelect.png](https://filestore.hasura.io/v1/file/887f519a-c85d-43a3-84ca-4ddef0974550)

The permissions set above translates to: *Let the user only read rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header. Moreover, allow the user to only read the selected columns, in this case, user_id, name and gender*

**Third**, update permissions

![DataPermissionsUpdate.png](https://filestore.hasura.io/v1/file/19cc04e2-85dd-4e72-8be3-870c24c7d2cd)

Translation: *Let the user only update rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header. Moreover, allow the user to only update the selected columns, in this case, the user cannot modify the `user_id`*

Click on `Save Permissions`.

**Finally**, delete permissions

![DataPermissionsDelete.png](https://filestore.hasura.io/v1/file/b9c18e93-26f4-4198-9aa6-cc793a34604d)

Translation: *Let the user only delete rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header.*

Click on `Save Permissions`.

>There can also be times where you want `anonymous` permissions on your table. Foe eg: if you are building an e-commerce app, you would want your users to be able to browse through your products regardless of whether they are logged in or not. You can read more about Data permissions and Access control [here](https://docs.hasura.io/0.15/manual/data/permissions.html).

### Inserting data into the table

Now that we have created our table and also given it permissions, let's see how the API to insert data into the table looks like.

Head to the `API Explorer` tab and click on `v1/query - Query Builder` on the left panel. Click on `type` and select `insert` to insert into a table.

![DataQbInsert.png](https://filestore.hasura.io/v1/file/e7dac415-c2cd-407c-9b1e-e7f2d8ff30ce)

Next, click on `table` and select `user_details` from the list. Fill in the `objects` array with data you want inserted into the table. In the picture shown below, we are adding data for the user we signed up with (`hasura_id`: 2)

![DataQbInsert2.png](https://filestore.hasura.io/v1/file/a180908c-4f8f-4726-aa02-6a3606dc0e2f)

Since we have given `user` role permission to the `user_details` table, we have to add the Authorization header to the insert query. (Add key `Authorization` and value `Bearer <auth_token>` to the header. If you do not have the )

![DataQbInsert3.png](https://filestore.hasura.io/v1/file/4a95b161-5928-4814-b5df-b147f4998432)

> If you try to insert into the `user_details` table with a `user_id` which is not the same as the `hasura_id` as the user making the request, it will fail. This is because of the permissions we set on the `user_details` table.

### Selecting data from the table

Head to the `API Explorer` and click on `v1/query - Query Builder` on the left panel. Click on `type` and select `select` to select from a table. Next, click on `table` and select `user_details` from the list. Select `user_id`, `name` and `gender` for the columns.

![DataQbSelect.png](https://filestore.hasura.io/v1/file/62e89855-5e2e-440f-b0b2-c63176bec5e4)

Since we have given `user` role permission to the `user_details` table, we have to add the Authorization header to the select query (Add key `Authorization` and value `Bearer <auth_token>` to the header). Hit the `Send` button to make this request.

![DataQbSelect2.png](https://filestore.hasura.io/v1/file/7cb68920-0d6f-4dd5-8ae2-090112e63f96)

### Relationships and Foreign Keys

You can also create connections between various tables through foreign key constraints. These can be used to build more complex relationships, which can be used to fetch related data alongside the columns queried, as pseudo columns.

To explore this feature, let's create a new table called `user_education` to store information about each user's educational background like `institution_name` and `degree`. We will also have an additional column `id` of type `Integer (auto increment)` and a `user_id` column to store the `hasura_id` of the user. `id` will be the primary key for this table.

> It is not a good idea to set `user_id` as the primary key as a user can have multiple addresses and setting `user_id` as the primary key will not let us enter more than address for a particular user.

![DataUserEdu.png](https://filestore.hasura.io/v1/file/7a5e3826-8233-40e7-9b21-4551cab40625)

Click on the `Create` button.

Similar to `user_details` table, add `user` permissions on the `user_education` table.

![DataUserEduPerm1.png](https://filestore.hasura.io/v1/file/dcf59541-be99-4015-be2e-2d5cfda9e2b5)
![DataUserEduPerm2.png](https://filestore.hasura.io/v1/file/0d0770e9-f22b-4ef1-8d28-972d81657fd0)
![DataUserEduPerm3.png](https://filestore.hasura.io/v1/file/6ad5452a-261a-464c-bb08-86f7bbdbaff5)
![DataUserEduPerm4.png](https://filestore.hasura.io/v1/file/fd8e67df-006e-4421-b096-e960ee59f028)

What we want to achieve now is that when we fetch user details from the `user_details` table, we should also get the respective education data for the user.

For this, we are going to create an array relationship from the `user_details` table to the `user_education` table. To create a relationship:

**First**, add a foreign key constraint from the `user_id` column of the `user_education` table to the `user_id` column of the `user_details` table. To do this, under the `Modify` tab, click on `edit` next to `user_id`, choose `user_details` as the reference table and `user_id` as the reference column. Click on `Save` to add this foreign key constraint.

![DataUserEduForeignKey.png](https://filestore.hasura.io/v1/file/aa3f98bb-54b1-4997-8fa5-b2c80a0eb116)

**Next**, open up the `user_details` table from the left panel and click on the `Relationships` tab. If you have followed the instructions above correctly, you will now have an entry under the `Suggested Array Relationship` column. Click on `Add` and name the relationship `education` and hit `Save`.

![DataUserDetsRel.png](https://filestore.hasura.io/v1/file/085229f6-3c0d-4992-ac0c-5effeaf5bf0d)

Click on `Browse Rows` and you will now see another column called `education` for the `user_details` table.

>`education` is not really a column, but a pseudo column. You can now use the Data APIs to fetch data from this table which includes education data as well.

![DataUserDetailsBrowse.png](https://filestore.hasura.io/v1/file/7b825a08-3fa6-46de-b5df-6169e67c46ae)

Head to the `API Explorer` and add some data into the `user_education` table for our user (`hasura_id` 2). Ensure that you have added the Authorization header.

![DataEduInsert.png](https://filestore.hasura.io/v1/file/8c0f84a7-d053-48af-9450-5e7898147ffa)

#### Fetching relationship data

We can now fetch the education details for each user from the `user_details` table like so (again, Authorization header is mandatory to fetch data from the `user_details` table):

![DataDetsRelSelect.png](https://filestore.hasura.io/v1/file/cd275c70-6082-46f8-9448-5214d6f2b687)

Your response will look like the following:

```json
[
    {
        "user_id": 2,
        "name": "Jack Sniper",
        "gender": "Male",
        "education": [
            {
                "institution_name": "XYZ University",
                "degree": "BE",
                "id": 1,
                "user_id": 2
            },
            {
                "institution_name": "ABC University",
                "degree": "MS",
                "id": 2,
                "user_id": 2
            }
        ]
    }
]
```

### Migrations

Whenever you make any changes to the database from the `API Console`, migration files get created in the `migrations` directory. These help keep track of the database changes that you have made and help with easy migration to another cluster. For eg: Migrating changes from a staging cluster to a production cluster.

>You can read more about migrations [here](https://docs.hasura.io/0.15/manual/project/directory-structure/migrations/index.html).

## Image Upload and Download

Some apps require the ability to upload and download files, for eg: storing user profile pictures or if you are building an app like google drive. Hasura provides easy to use APIs to upload and download files as well. Under the `API Explorer` tab, explore the APIs under `File`

You can test out the filestore APIs on the `API Explorer` and use the `Code Generator` to include it in your client side code.
