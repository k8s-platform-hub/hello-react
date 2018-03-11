This is a react quickstart which will have you deploying a fully working react app in minutes using Hasura. Moreover, the included react app also utilizes the various backend components of Hasura to implement features like:
- Authentication
- Storing and retrieving data from a database
- Uploading and downloading files

Follow along with the tutorial to learn how everything works to make the most out of Hasura.

## What does this come with?

* A working React.js Hello World Project
  * Automatic reloading and bundling
  * All *create-react-app* feature
  * react-scripts with inbuilt webpack bundling
* Deployed with the [**serve**](https://www.npmjs.com/package/serve) package
* **Dockerfile** (automatically used by Hasura for deployment)

```
FROM node:8

RUN apt-get update && apt-get install -y build-essential python

#Install deps
RUN mkdir /app
COPY app/package.json /app/package.json
RUN cd /app && npm install
RUN npm -g install serve

#Add all source code
ADD app /app/
RUN cd /app && npm run build

WORKDIR /app

#Default command
CMD ["serve", "-s", "build", "-p", "8080"]
```
* A simple Nodejs Express server

## Deployment instructions

Before you continue:

- Ensure that you have the HasuraCLI installed on your machine before you continue. If not, you can find instructions to install it [here](https://docs.hasura.io/0.15/manual/install-hasura-cli.html).
- Log into Hasura by running `$ hasura login` on your command shell.

### Basic deployment:

Run the following commands on your command shell to deploy the app:

```bash
$ hasura quickstart hasura/hello-react
$ cd hello-react
$ git add . && git commit -m "Initial Commit"
$ git push hasura master
```

* The `hasura quickstart` command clones the project repository to your local computer, and also creates a **free Hasura cluster**, where the project will be hosted for free.
* A git remote (called hasura) is created and initialized with your project directory.
* `git push hasura master` deploys this project on the cluster that was created in the first step.

### Open the react app in the browser

* Run the below command to open your shiny new deployed react app.

``` shell
$ hasura microservice open ui
```

### Code Structure

The contents inside the `hello-react` directory are what constitutes a `Hasura Project`. A `Hasura Project` is designed in such a way that all the configurations to your cluster as well the source code for your app resides within the `Hasura Project`. This simple design brings in the advantage of having everything you do under version control and helps with easy collaboration with other developers.

The source code for the `react` app can be found inside the `microservices/ui/app` directory.

>Everything that you deploy on Hasura is a "microservice". You can read more about microservices [here](https://docs.hasura.io/0.15/manual/microservices/index.html)

#### Making changes and deploying

* To make changes to the project, browse to `/microservices/ui/app/src` and edit the `HasuraExampleApp.js` file in `hasuraExamples` folder according to your app.
* Commit the changes, and perform `git push hasura master` to deploy the changes.

### Local development

To test and make changes to this app locally, follow the below instructions.
* Open Terminal and `cd` into `microservices/ui/app`
* Run `npm install` to install all the project dependencies
* Run `npm start` and `npm build` in the terminal to build and run it.
* Make changes to the app, and see the changes in the browser

### View server logs

You can view the logs emitted by the ‘serve’ package by running the below command:

``` shell
$ hasura microservice logs ui
```
You can see the logs in your terminal, press `CTRL + C` to stop logging.

### Managing app dependencies

* System dependencies, like changing the web-server can be made in the Dockerfile
* npm/yarn deps can be managed by editing **package.json**.

If changes have been done to the dependencies, `git commit`, and perform `git push hasura master` to deploy the changes.

### Migrating your existing React.js app

* If you have an existing react app which you would like to deploy, replace the code inside `/microservices/ui/src/` according to your app.
* You may need to modify the Dockerfile if your `package.json` or the build directory location has changed, but in most cases, it won't be required.
* Commit, and run `git push hasura master` to deploy your app.

#### Understanding the Dockerfile

Understanding what the Dockerfile does will help you modify it based on your requirement.

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

# Step 6: Install server globally
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

## Adding backend features

Hasura comes with BaaS APIs to make it easy to add backend features to your apps.

### Add instant authentication via Hasura’s web UI kit

Every project comes with an Authentication kit, you can restrict the access to your app to specific user roles.
It comes with a UI for Signup and Login pages out of the box, which takes care of user registration and signing in.

![Auth UI](https://docs.hasura.io/0.15/_images/uikit-dark.png)

Navigate to the `/user-info` path of the react app to see the Auth UI Kit in action.

>You can read more about the AUTH UI Kit [here](https://docs.hasura.io/0.15/manual/users/uikit.html).

This particular example shows a Username/password based authentication. Hasura also provides other authentication providers like Email/password, mobile/otp, google, facebook etc. You can learn more about authentication and the various providers [here](https://docs.hasura.io/0.15/manual/auth/index.html).

### API console

The API Console is a web UI to help you manage and explore the various backend components provided by Hasura.

#### Run this command inside the project directory

```bash
$ hasura api-console
```

This will automatically open the API Console on your browser.

#### The API Explorer

What you see in the picture below is the `API Explorer`, this is where you can try out and experiment with the APIs of the various backend features. Explore the panel on the left to try out the different APIs.

&nbsp;
![api-explorer.png](https://filestore.hasura.io/v1/file/463f07f7-299d-455e-a6f8-ff2599ca8402)
&nbsp;

#### The Code Generator

Another nifty feature of the `API Explorer` is the `API Code Generator`. For every request that you try out on the `API Explorer`, you can generate working code in a variety of languages.

Let's take a look at an example:

**First**, let's try out the `signup` endpoint under `Username-Password`

&nbsp;
 ![API Explorer CodeGenButton](https://filestore.hasura.io/v1/file/0374dde1-ddd8-40e4-8d62-1d8a3f10dc44)
&nbsp;

Choose the username and password that you would like to signup with and click on `Send`.

**Second**, now that we have tried out the API, we want to implement this API in our react app. To do that, click on the `Generate API Code` button on the top right. In the pop up that comes up, choose `Javascript Fetch` from the list on the left.

&nbsp;
 ![API Explorer CodeGen](https://filestore.hasura.io/v1/file/ad733031-42b8-453c-afa9-c75ddfa8a864)
&nbsp;

This will print out the code to make this API in `Javascript` using the `Fetch` library.

### Storing and retrieving information from a database

Hasura comes with set of Data APIs to access the Postgres database which comes bundled with every Hasura cluster. The advantage of this system is that each time you create a table, you can instantly access and modify that table with HTTP APIs.

This quickstart by default comes with two tables `article` and `author` with some sample data. Let's take a look at how we can fetch data from one of these tables.

**First**, head to the `API Explorer` and click on `/v1/query - Query Builder` in the panel on the left. In the query builder that comes up, click on `type` and choose `select` from the list that comes.

![API Explorer Select](https://filestore.hasura.io/v1/file/35a48509-6d37-44bb-ae2f-ef4acc652c7a)

**Next**, choose a `table`, in this case, let's go with `article`. Select all the columns. Let's also set a condition to fetch only the article with an `id` value of 1.

 ![API Explorer Query](https://filestore.hasura.io/v1/file/950defac-eca0-4b16-98ae-5f922fb21f7d)


Hit the `Send` button. You will receive the following response:

```json
[
    {
        "id": 1,
        "title": "sem ut dolor dapibus gravida.",
        "content": "Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere vulputate, lacus. Cras interdum. Nunc sollicitudin commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed et libero. Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet posuere, enim nisl",
        "rating": 4
    }
]
```

As you can see the article has an `id` of 1. Alternatively, you can also take off the `where` clause completely and hit the `Send` button. In this case, you will get a list of all the articles from the `article` table.

>Try out the `Generate API Code` button to generate the code to make this request in other languages and frameworks.

Similarly, you can also `insert`, `update` and `delete` data from the tables. Moreover, every table you create, by default, have permissions on them which prevent anyone but an admin user from accessing or modifying the data. This is done to ensure that you don't accidentally open up your application data to the outside world unless you specifically want to.

>To make the most out of the Data APIs, it is recommended that you go through the detailed [docs](https://docs.hasura.io/0.15/manual/data/index.html).


To see the Data APIs being used in the react app, head to the `/data` route and the source code can be found in `microservices/ui/app/src/hasuraExamples/Data.js`


### File upload and download

Some apps require the ability to upload and download files, for eg: storing user profile pictures or if you are building an app like google drive. Hasura provides easy to use APIs to upload and download files as well. Under the `API Explorer` tab, explore the APIs under `File`

You can test out the filestore APIs on the `API Explorer` and use the `Code Generator` to include it in your client side code.

&nbsp;
![Filestore](https://raw.githubusercontent.com/hasura/hello-android/master/readme-assets/filestore-explore.png)
&nbsp;

To see this being used in the react app, navigate to the `/filestore` route. You can find the source code for this feature implementation in `microservices/ui/app/src/hasuraExamples/Filestore.js`


&nbsp;
>Go though the [docs](https://docs.hasura.io/0.15/manual/filestore/index.html), to know more about the filestore and to understand how you can set permissions on it. Currently, the permission defaults to allowing anyone to download files but only authenticated users are allowed to upload files.
&nbsp;

## Add a custom API

Similar to how we have a custom microservice running our react app. We can also create another microservice which can host a server that can provide us with custom APIs based on our requirement.

This quickstart comes with one such custom service written in `nodejs` using the `express` framework. Check it out in action at `https://api.cluster-name.hasura-app.io` . Currently, it just returns a "Hello-React" at that endpoint.

The source code for this nodejs server can be found in `microservices/api/src`.

#### Making changes and deploying

* To make changes, browse to `/microservices/api/app/src` and make the necessary changes.
* Commit the changes, and perform `git push hasura master` to deploy the changes.

### Local development

To test and make changes locally, follow the below instructions.
* Open Terminal and `cd` into `microservices/api/src`
* Run `npm install` to install all the project dependencies
* Run `node server.js` in the terminal to build and run it.
* Make changes to the app, and see the changes in the browser

### View server logs

You can view the logs emitted by running the following:

``` shell
$ hasura microservice logs api
```
You can see the logs in your terminal, press `CTRL + C` to stop logging.


>Alternatively, you can also add your own custom microservice, follow the [documentation](https://docs.hasura.io/0.15/manual/custom-microservices/index.html) to know more.
