const express = require("express");
const generateRandomString = require("./generate_random_string.js");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

const checkIfEmailIsRegistered = (newEmail) => {
  for (const user in users) {
    const userInfo = users[user];
    const email = userInfo.email;
    const emailIsRegistered = newEmail === email;
    if(emailIsRegistered) return true;
  }
  return false;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { urls: urlDatabase, userInfo };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { username, userInfo };
  res.render("urls_new", templateVars);
});

const findIdWithUserInfo = (enteredEmail, enteredPassword) => {
  const userIds = Object.keys(users);
  const usersNum = userIds.length;
  for (let i = 0; i < usersNum; i++) {
    const userId = userIds[i];
    const userInfo = users[userId];
    const email = userInfo.email;
    const emailIsFound = email === enteredEmail;
    if (emailIsFound) {
      const password = userInfo.password;
      const passwordIsCorrect = enteredPassword === password;
      if (passwordIsCorrect) return userId;
    }
  }
}

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = findIdWithUserInfo(email, password);
  if (!userId) return res.status(400).send("Your login information was incorrect.");
  res.cookie("user_id", userId);
  res.redirect("/urls/");
});

app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { userInfo };
  res.render("urls_login", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailIsEmpty = email === "";
  if (emailIsEmpty) return res.status(400).send('Email address cannot be empty.');
  const passwordIsEmpty = password === "";
  if (passwordIsEmpty) return res.status(400).send('Password cannot be empty.');
  const emailIsRegistered = checkIfEmailIsRegistered(email);
  if (emailIsRegistered) return res.status(400).send('The email address is already registered.');
  const id = generateRandomString();
  const userInfo = { id, email, password };
  users[id] = userInfo;
  res.cookie("user_id", id);
  res.redirect(`/urls`);
});

app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { userInfo };
  res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { longURL, shortURL, userInfo };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
