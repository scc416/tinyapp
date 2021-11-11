const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { PORT, KEYS } = require("./constants.js");
const { userHelperGenerator, urlHelperGenerator, assignVisitorIdToCookie } = require("./helpers.js");
const { userDatabase, urlDatabase } = require("./database.js");

const { getUserInfoById, getIdForNewUser, authenticateUser } =
  userHelperGenerator(userDatabase);

const {
  getURLsOfAnUser,
  deleteURL,
  editURL,
  generateNewShortenURL,
  checkIfURLBelongsToUser,
  getURLInfoByShortURL,
  makeVisitorRecords,
} =
  urlHelperGenerator(urlDatabase);

const app = express();

//Middleware
app.use(cookieSession({
  keys: KEYS
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  assignVisitorIdToCookie(req.session);
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  assignVisitorIdToCookie(req.session);
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  assignVisitorIdToCookie(req.session);
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res, next) => {
  assignVisitorIdToCookie(req.session);
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);
  
  if (!userInfo) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: "Login to see your shorten URLs." }));
  }

  const urlsOfTheUser = getURLsOfAnUser(loggedInId);

  const templateVars = { urls: urlsOfTheUser, userInfo };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {

  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);

  if (!userInfo) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: "Login to create new url." }));
  }

  const { longURL } = req.body;
  const shortURL = generateNewShortenURL(longURL, loggedInId);
  
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  assignVisitorIdToCookie(req.session);
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);
  if (!userInfo) return res.redirect("/login");

  const templateVars = { userInfo };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  assignVisitorIdToCookie(req.session);
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);

  if (userInfo) res.redirect("/urls");

  const templateVars = { userInfo: null };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const { email: emailInput, password: passwordInput } = req.body;

  const result = getIdForNewUser(emailInput, passwordInput);

  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }
  
  const { data: userId } = result;
  req.session.userId = userId;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  assignVisitorIdToCookie(req.session);
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);

  if (userInfo) res.redirect("/urls");

  const templateVars = { userInfo: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email: emailInput, password: passwordInput } = req.body;
  const result = authenticateUser(emailInput, passwordInput);

  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  const { data: userId } = result;
  req.session.userId = userId;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { userId: loggedInId } = req.session;
  const { shortURL } = req.params;
  const errMsgForNotLoggedIn = "You have to login to delete url.";
  const errMsgForURLNotBelongToUser = "You cannot delete url of another user.";
  const infoToDeleteURL = { userId: loggedInId, shortURL, errMsgForNotLoggedIn, errMsgForURLNotBelongToUser };
  const result = checkIfURLBelongsToUser(infoToDeleteURL, getUserInfoById);
  
  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  deleteURL(shortURL);
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const { userId: loggedInId } = req.session;
  const errMsgForNotLoggedIn = "You have to login to edit url.";
  const errMsgForURLNotBelongToUser = "You cannot edit url of another user.";
  const { shortURL } = req.params;
  const infoToEditURL = { userId: loggedInId, shortURL, errMsgForNotLoggedIn, errMsgForURLNotBelongToUser };
  const result = checkIfURLBelongsToUser(infoToEditURL, getUserInfoById);
  
  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  const { longURL: newLongURL } = req.body;
  editURL(shortURL, newLongURL);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  assignVisitorIdToCookie(req.session);
  const { userId: loggedInId } = req.session;
  const errMsgForNotLoggedIn = "You have to login to edit url.";
  const errMsgForURLNotBelongToUser = "You cannot edit url of another user.";

  const { shortURL } = req.params;
  const infoToViewURLDetails = { userId: loggedInId, shortURL, errMsgForNotLoggedIn, errMsgForURLNotBelongToUser };
  const result = checkIfURLBelongsToUser(infoToViewURLDetails, getUserInfoById);
  
  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  const { data: userInfo } = result;
  const result2 = getURLInfoByShortURL(shortURL);
  const { data: urlInfo } = result2;
  const templateVars = { shortURL, urlInfo, userInfo };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  assignVisitorIdToCookie(req.session);
  const { shortURL } = req.params;
  const { visitorId } = req.session;
  const result = getURLInfoByShortURL(shortURL);

  const errMsg = result.err;
  if (errMsg) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: errMsg }));
  }

  makeVisitorRecords(shortURL, visitorId);
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});