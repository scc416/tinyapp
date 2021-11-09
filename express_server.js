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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "aJ48lW" : {
    id: "aJ48lW",
    email: "siu@gmail.com",
    password: "123456"
  }
};

const checkIfEmailIsRegistered = (newEmail) => {
  for (const user in users) {
    const userInfo = users[user];
    const email = userInfo.email;
    const emailIsRegistered = newEmail === email;
    if (emailIsRegistered) return true;
  }
  return false;
};

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
  if (!userId) return res.redirect("/login");
  const userInfo = users[userId];
  const templateVars = { userInfo };
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
};

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailIsRegistered = checkIfEmailIsRegistered(email);
  if (!emailIsRegistered) return res.status(403).send("The email address is not registered");
  const userId = findIdWithUserInfo(email, password);
  if (!userId) return res.status(400).send("The password doesn't match with the email address.");
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) res.redirect("/urls");
  const templateVars = { userInfo: null };
  res.render("urls_login", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { userId, longURL };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
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
  if (userId) res.redirect("/urls");
  const templateVars = { userInfo: null };
  res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userId = req.cookies.user_id;
  const userInfo = users[userId];
  const templateVars = { longURL, shortURL, userInfo };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) return res.status(401).send('Log in to create new url.');
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userId };
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
