const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');

const { generateRandomString, getUserByEmail } = require("./helper_functions.js");

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const checkPassword = (password, hash) => bcrypt.compareSync(password, hash);

//Middleware
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "aJ48lW"
  }
};

const users = {
  "aJ48lW" : {
    id: "aJ48lW",
    email: "siu@protonmail.com",
    password: hashPassword("123456")
  }
};

const getUrlsOfAnUser = (id) => {
  const urls = {};
  for (const shortURL in urlDatabase) {
    const urlInfo = urlDatabase[shortURL];
    const urlUserId = urlInfo.userId;
    const urlBelongsToUser = urlUserId === id;
    if (urlBelongsToUser) {
      const longURL = urlInfo.longURL;
      urls[shortURL] = longURL;
    }
  }
  return urls;
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
  const userId = req.session.userId;
  if (!userId) return res.status(403).send("Login to see your shorten URLs.");
  const userInfo = users[userId];
  const urlsOfTheUser = getUrlsOfAnUser(userId);
  const templateVars = { urls: urlsOfTheUser, userInfo };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/login");
  const userInfo = users[userId];
  const templateVars = { userInfo };
  res.render("urls_new", templateVars);
});

app.post("/login", (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  const userInfo = getUserByEmail(enteredEmail, users);
  if (!userInfo) return res.status(403).send("The email address is not registered");
  const password = userInfo.password;
  const passwordIsCorrect = checkPassword(enteredPassword, password);
  if (!passwordIsCorrect) return res.status(400).send("The password doesn't match with the email address.");
  const userId = userInfo.id;
  req.session.userId = userId;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  if (userId) res.redirect("/urls");
  const templateVars = { userInfo: null };
  res.render("urls_login", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.userId;
  if (!userId) return res.status(403).send("You have to login to delete url.");
  const urlInfo = urlDatabase[shortURL];
  const urlUserId = urlInfo.userId;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot delete url of another user.");
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(403).send("You have to login to edit url.");
  const shortURL = req.params.shortURL;
  const urlInfo = urlDatabase[shortURL];
  const urlUserId = urlInfo.userId;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot edit url of another user.");
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { userId, longURL };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const emailIsEmpty = email === "";
  if (emailIsEmpty) return res.status(400).send('Email address cannot be empty.');
  const passwordIsEmpty = password === "";
  if (passwordIsEmpty) return res.status(400).send('Password cannot be empty.');
  const existingUserInfo = getUserByEmail(email, users);
  if (existingUserInfo) return res.status(400).send('The email address is already registered.');
  const id = generateRandomString();
  const hashedPassword = hashPassword(password);
  const userInfo = { id, email, password: hashedPassword };
  users[id] = userInfo;
  req.session.userId = id;
  res.redirect(`/urls`);
});

app.get("/register", (req, res) => {
  const userId = req.session.userId;
  if (userId) res.redirect("/urls");
  const templateVars = { userInfo: null };
  res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(403).send("You have to login to edit url.");
  const shortURL = req.params.shortURL;
  const urlInfo = urlDatabase[shortURL];
  if (!urlInfo) return res.status(404).send("The short url does not exist.");
  const urlUserId = urlInfo.userId;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot edit url of another user.");
  const userInfo = users[userId];
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { longURL, shortURL, userInfo };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(403).send('Log in to create new url.');
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userId };
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
