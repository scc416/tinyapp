const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const PORT = 8080; // default port 8080

const app = express();

const {
  generateRandomString,
  getUserByEmail,
  getUrlsOfAnUser,
  hashPassword,
  checkPassword
} = require("./helpers.js");

const { urlDatabase, users } = require("./database.js");

//Middleware
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

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
  const { userId } = req.session;
  if (!userId) return res.status(403).send("Login to see your shorten URLs.");

  const userInfo = users[userId];
  const urlsOfTheUser = getUrlsOfAnUser(userId, urlDatabase);
  const templateVars = { urls: urlsOfTheUser, userInfo };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(403).send('Log in to create new url.');

  const { longURL } = req.body;
  const shortURL = generateRandomString();
  const urlInfo = { longURL, userId };
  urlDatabase[shortURL] = urlInfo;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.redirect("/login");

  const userInfo = users[userId];
  const templateVars = { userInfo };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const { userId } = req.session;
  if (userId) res.redirect("/urls");

  const templateVars = { userInfo: null };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const { email: emailInput, password: passwordInput } = req.body;
  const emailIsEmpty = emailInput === "";
  if (emailIsEmpty) return res.status(400).send('Email address cannot be empty.');

  const passwordIsEmpty = passwordInput === "";
  if (passwordIsEmpty) return res.status(400).send('Password cannot be empty.');

  const existingUserId = getUserByEmail(emailInput, users);
  if (existingUserId) return res.status(400).send('The email address is already registered.');

  const id = generateRandomString();
  const hashedPassword = hashPassword(passwordInput);
  const userInfo = { id, email: emailInput, password: hashedPassword };
  users[id] = userInfo;
  req.session.userId = id;
  res.redirect(`/urls`);
});

app.get("/login", (req, res) => {
  const { userId } = req.session;
  if (userId) res.redirect("/urls");

  const templateVars = { userInfo: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email: emailInput, password: passwordInput } = req.body;
  const userId = getUserByEmail(emailInput, users);
  if (!userId) return res.status(403).send("The email address is not registered");

  const { password } = users[userId];
  const passwordIsCorrect = checkPassword(passwordInput, password);
  if (!passwordIsCorrect) return res.status(400).send("The password doesn't match with the email address.");

  req.session.userId = userId;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const { userId } = req.session;
  if (!userId) return res.status(403).send("You have to login to delete url.");

  const urlInfo = urlDatabase[shortURL];
  const { userId: urlUserId } = urlInfo;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot delete url of another user.");

  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(403).send("You have to login to edit url.");

  const { shortURL } = req.params;
  const urlInfo = urlDatabase[shortURL];
  const { userId: urlUserId } = urlInfo;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot edit url of another user.");

  const { longURL } = req.body;
  urlDatabase[shortURL] = { userId, longURL };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(403).send("You have to login to edit url.");

  const { shortURL } = req.params;
  const urlInfo = urlDatabase[shortURL];
  if (!urlInfo) return res.status(404).send("The short url does not exist.");

  const { userId: urlUserId } = urlInfo;
  const urlBelongsToUser = userId === urlUserId;
  if (!urlBelongsToUser) return res.status(403).send("You cannot edit url of another user.");

  const userInfo = users[userId];
  const { longURL } = urlDatabase[shortURL];
  const templateVars = { longURL, shortURL, userInfo };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { longURL } = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
