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

The application offers a "Getting Started" walk through of the application, starting at the landing page and guiding a user through the major components of the application.

On starting the application, each section is populated with default values, providing a template on how further information should be input. These values can be modified immediately or used to explore the complete functionality of the application.

The four principle components are described in detail below. In short, the values input to the Instructors, Lessons, and Private Lessons components are used to create a schedule in the Grid component.


## Major Components

eggbeatr is composed of 4 major components: Instructors, Lessons, Private Lessons, Grid. Each component combines their data in order to produce a schedule.

The information input to each component is stored locally in the web browser using Session Storage. This allows the information to be persistent through browser refresh, but not transfer from browser tab/page to another. In the future, this information will be stored in a database, so it may e persistent between sessions. To clear the stored information, pass the query parameter "clearStorage=session", like this:
http://web.uvic.ca/~ibs/?clearStorage=session

### Instructors

Instructors are a required component to creating a schedule. This component stores information on the instructors: name, date of hire, WSI certification, and lesson preferences.

The WSI certification field reacts to the currency the instructor's certification. The three status codes are as follows:

* Standard colouring: The certification is valid for more than 90 days.
* Yellow: The certification will expire in 90 days or less.
* Red: The certification has expired.

To facilitate the colour coding, the dates must be input with forward slashes as separators (e.g., 31/12/00) and ordered either as dd/mm/yy or mm/dd/yy. If only one value for the field is input, the preceding value will be interpreted as zero.

It is important to note that instructors with expired WSI certifications will not be included in the process to create grids, and will not be included in the checklist.

Instructors may be given preferences on the lessons they teach. It is important to note that they give priority to the selected lesson types and does not prevent them from teaching non-preferred lesson types. An instructor's preferences default to any of the available lesson types.

The values input to the Instructors section must match specific patterns, listed below:

* Instructor: At least one of uppercase or lowercase letters, followed by uppercase or lowercase letters or spaces.
* Date of Hire: Three numbers (four digits, two digits, two digits), separated by hyphens slashes, that parse into a valid date.
* WSI Expiration: Same as Date of Hire.


### Lessons

The Lessons component is the main data field of the application. This section takes the quantities of each lesson type to populate the schedule. Upon input to a field in this section, the quantities are automatically updated. This section only accepts inputs of numbers 0 to 9. Any other value will not update with the new value and will display an error notification in that cell.


### Private Lessons

The Private Lessons component is similar to the Lessons component, however, these lessons have fixed instructors, times, and durations.

A private lesson can be added to the schedule by entering the required information. By default, each private lesson will be included in the schedule.

The private lessons are mapped to instructors by the "Instructor" fields of both components. As an example, if an instructor named "Alice" is added in the Instructors component, any private lessons with the name "Alice" will be linked to the instructor "Alice". It is important to note that names are case sensitive; "Alice" and "alice" are two different names and will be evaluated differently.

For the application to evaluate the input values properly, the values are expected to follow these conventions:

* Instructor: At least one of uppercase or lowercase letters, followed by uppercase or lowercase letters or spaces.
* Time: Two numbers, 1 to 12 and 0 to 59, separated by a colon.
* Duration: Any integer value greater than 10.

Any value not following these conventions will have an error notification displayed.


### The Grid

The Grid component is responsible for creating and displaying the schedules. In order for a schedule to be created, at least one instructor must be available and at least one lesson must be available, which may be a private lesson. If these requirements are not met, a schedule will not be created. These requirements are outlined in the Grid Checklist, which has status codes:

* Standard colouring: The component has an acceptable value.
* Yellow: (Lessons only) Only private lessons will be included.
* Red: The component has an unacceptable value.

The checklist updates automatically when the Instructors, Lessons, or Private Lessons components are updated.

In addition to minimum values, there is also a threshold on maximum values. In short, there must be enough slots to place lessons. As an example, six instructors can teach six lessons, however, one instructor may not teach six lessons.

The product of this section is a list of schedules that meet the input requirements. Since there is usually more than one possibility, these many possibilities are displayed. An individual schedule may be exported as a PDF document for further use, such as distribution. There are cases where only one possibility exists (i.e., private lessons only) and only one schedule will be created.
