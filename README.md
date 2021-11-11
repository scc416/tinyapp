# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

![urls-page.png](./docs/urls-page.png)
*View all of your short URLs*

![show-page.png](./docs/show-page.png)
*You can view the statistics (date created, number of visits, number of unique visitors) and edit the long URL of your short URL*

![show-page-track-visitors.png](./docs/show-page-track-visitors.png)
*Keep track of the visitors that visited your short URL (in desending order of time)*

## Dependencies

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [bcrypt](https://github.com/dcodeIO/bcrypt.js)
- [body-parser](https://github.com/expressjs/body-parser)
- [cookie-session](https://github.com/expressjs/cookie-session)

## Getting Started
- Clone this project to your computer
- `cd` to the folder where this project is cloned
- Install all dependencies with `npm install` command
- Run the development web server with `node express_server.js` command
- Open the broswer and visit: [http://localhost:8080/](http://localhost:8080/)

## File Structure
<pre>
📦tinyapp
 ┣ 📂docs
 ┃ ┣ 📜new-restricted.png
 ┃ ┣ 📜show-page.png
 ┃ ┣ 📜show-page-track-visitors.png
 ┃ ┣ 📜urls-page.png
 ┃ ┣ 📜urls-page-restricted.png
 ┃ ┗ 📜urls-page-restricted-login.png
 ┣ 📂test
 ┃ ┣ 📜authenticateUser_test.js
 ┃ ┣ 📜checkIfURLBelongsToUser_test.js
 ┃ ┣ 📜deleteURL_test.js
 ┃ ┣ 📜editURL_test.js
 ┃ ┣ 📜generateNewShortenURL_test.js
 ┃ ┣ 📜generateRandomString_test.js
 ┃ ┣ 📜getIdForNewUser_test.js
 ┃ ┣ 📜getURLInfoByShortURL_test.js
 ┃ ┣ 📜getURLsOfAnUser_test.js
 ┃ ┣ 📜getUserByEmail_test.js
 ┃ ┣ 📜getUserInfoById_test.js
 ┃ ┣ 📜makeVisitorRecords_test.js
 ┃ ┣ 📜password_test.js
 ┃ ┣ 📜uniqueKeyChecker_test.js
 ┃ ┗ 📜uniqueVisitorsCounter_test.js
 ┣ 📂views
 ┃ ┣ 📂partials
 ┃ ┃ ┗ 📜_header.ejs
 ┃ ┣ 📜urls_error.ejs
 ┃ ┣ 📜urls_index.ejs
 ┃ ┣ 📜urls_login.ejs
 ┃ ┣ 📜urls_new.ejs
 ┃ ┣ 📜urls_register.ejs
 ┃ ┗ 📜urls_show.ejs
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜constants.js
 ┣ 📜database.js
 ┣ 📜express_server.js
 ┣ 📜helpers.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
 </pre>

### 📂 docs
Store images that are displayed in this README document.

### 📂 test
Store unit test for the helper functions (in helper.js).
These test are written with [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/).

### 📂 views
Store all the [EJS](https://ejs.co/) files. Folder `partials` has only one file, `_header.ejs`. It displays the header for all other [EJS](https://ejs.co/) files

### 📜 .gitignore
This file is to ignore the node_modules folder

### 📜 README.md
This document 

### 📜 constants.js
Store all the constants, such as `PORT` for the server and `KEYS` for [cookie-session](https://github.com/expressjs/cookie-session)

### 📜 database.js
Store the database of urls and users

### 📜 express_server.js
The javascript file where the server is defined.

### 📜 helpers.js
Store all the helpers function. The functions which change the database (urls/users) are put in `userHelperGenerator` or `urlHelperGenerator` respectively. Functions that are used by other files are exported.

### 📜 package-lock.json
### 📜 package.json

## Features
