# eggbeatr

eggbeatr is a web application to schedule instructors with  lessons. It does the tedious work, leaving you with creative control.


### Goal

The goal of this project is to improve the schedule generating process, taking on the repetitive aspects.


### Hosting

Currently, eggbeatr is not hosted on a public domain.


## Getting Started

First off, clone the project:
```
git clone https://github.com/istreight/eggbeatr.git
```

### Dependencies

> For how to use the application, see "How To Use" below.
>
> To avoid building the application, it may be accessed using the link in the Hosting section above (if available).

Using [Node.js](https://nodejs.org/en/), eggbeatr runs on a [ReactJS](https://reactjs.org) front-end and [Express](http://expressjs.com) back-end, with a connection to a [PostgreSQL](https://www.postgresql.org) database.

The front-end development server is managed by [Webpack](https://webpack.js.org) & [Babel](https://babeljs.io). The back-end is managed by [Nodemon](https://nodemon.io).

eggbeatr also has dependencies within [Node.js](https://nodejs.org/en/), however these are handled by [npm](https://www.npmjs.com). The dependencies include [node-postgres](https://node-postgres.com), [Sequelize](http://docs.sequelizejs.com), [jsPDF](https://parall.ax/products/jspdf), and [jsPDFAutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable).

### Installation

The project requires [Node.js](https://nodejs.org/en/) and [PostgeSQL](https://www.postgresql.org/download/), which can be installed with the instructions on the linked pages.

##### Verify installations

To verify [Node.js](https://nodejs.org/en/), [Node Packet Manager](https://www.npmjs.com), and [PostgeSQL](https://www.postgresql.org/download/) have successfully been installed successfully, run the following commands and verify the results don't cause errors:
```
$ node --version
v10.11.0
$ npm --version
6.4.1
$ psql --version
psql (PostgreSQL) 10.5
```

Once [Node.js](https://nodejs.org/en/) and [PostgeSQL](https://www.postgresql.org/download/) are installed, the app can be set up and run automatically using `npm run install-app`. This process takes care of the following NPM installations and database set-up & intialization.

It is important to note that, currently, this script will only automatically run the application if AppleScript is installed on the machine (default installed on OSX). All other part of the installation should succeed. To run the application without AppleScript, see the **Run** section below.

##### NPM Installations

Installation of other dependencies is handled by the [Node Packet Manager](https://www.npmjs.com). These dependencies can be installed by running `npm run packages:install` from the project root.

##### Database Set-Up

To set up the database, run `npm run db:setup`. This will create the user and database required by the application. The application requires a user named `eggbeatr` and a database named `eggbeatr`. Additionally, this will populate the database with the default data.

##### Database Initialization

To initialize the database (without creating a new user), there are two NPM scripts: `npm run db:init` & `npm run db:empty`. Both will drop the current database, removing any data, and create a new, fresh database. The difference between the two is that the `db:init` script will populate the database with default data whereas the `db:empty` script will not populate the database with any data.

### Run

To run the client-side of the project, navigate to the `/src/client` directory and start the webpack development server:
```
cd src/client
npm run start
```
To run the server-side of the project, navigate to the `/src/server` directory and start the webpack development server:
```
cd src/server
npm run start
```

The project may also be run with `npm run start` in the root directory, however, this requires AppleScript.

By default, the eggbeatr UI is hosted at localhost:8080 and the eggbeatr API is hosted at localhost:8081.

### NPM scripts

`db:init`
* Initialize the database with the default values. The raw values can be found in [/etc/defaults/ComponentData.js](https://github.com/istreight/eggbeatr/blob/master/etc/defaults/ComponentData.js) and are set in the database by the [seeders](https://github.com/istreight/eggbeatr/tree/master/src/server/src/seeders).

`db:empty`
* Initialize the database without the default values.

`db:setup`
* Create the required user and database, then populate the database with the default values. The default values can be removed by subsequently running `npm run db:empty`.

`install-app`
* Clean the project, drop the database and user, install and update NPM packages, set up the database, and run the application.

`packages:build`
* Using Webpack, the project is built and concentrated to `bundle.client.js` and `bundle.server.js`.

`packages:clean`
* Via the [/bin/clean](https://github.com/istreight/eggbeatr/blob/master/bin/clean) script, all the files and directories listed in [.gitignore](https://github.com/istreight/eggbeatr/blob/master/.gitignore) are removed from the [root](https://github.com/istreight/eggbeatr), [client](https://github.com/istreight/eggbeatr/tree/master/src/client), and [server](https://github.com/istreight/eggbeatr/tree/master/src/server) directories.

`packages:install`
* Installs the npm dependencies in the root, client, and server directories.

`packages:update`
* Applies updates to npm dependencies in the root, client, and server, where dependencies have updates.

`start`
* Using AppleScript, two additional Terminals are opened with local servers for the client-side and server-side. To start the project without AppleScript, see the **Run** section above.

### Built With

* [Babel](https://babeljs.io) - JavaScript Compiler
* [Express](http://expressjs.com) - Middleware Web Framework for Node.js
* [Nodemon](https://nodemon.io) - Hot Reloading for Development Server
* [PostgreSQL](https://www.postgresql.org) - Open Source Relational Database
* [ReactJS](https://reactjs.org) - JavaScript UI Library
* [Webpack](https://webpack.js.org) - JavaScript Module Bundler


## How To Use

> For how to clone & run the application, see "Getting Started" above.

Check out the [eggbeatr wiki](https://github.com/istreight/eggbeatr/wiki) to learn how to use the app!
