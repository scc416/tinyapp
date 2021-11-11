# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

![urls-page.png](./docs/urls-page.png)
*Keep track of your short URL*

![show-page.png](./docs/show-page.png)
*You can edit the long URL of your short URL*

![show-page-track-visitors.png](./docs/show-page-track-visitors.png)
*Keep track of the visitors that visited your short URL (in desending order of time)*

## Dependencies

### Node.js
### Express
### EJS
### bcrypt
### body-parser
### cookie-session

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

## Features
