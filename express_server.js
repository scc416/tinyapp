const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { PORT, KEYS } = require("./constants.js");
const favicon = require("serve-favicon");
const path = require('path');

// all functions that involve url/user database are put into closure: userHelperGenerator, urlHelperGenerator
const { userHelperGenerator, urlHelperGenerator, assignVisitorIdToCookie } = require("./helpers.js");
const { userDatabase, urlDatabase } = require("./database.js");
const methodOverride = require('method-override');

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
app.use(favicon(path.join(__dirname, "public", "favicon.png")));

app.use(cookieSession({
  keys: KEYS
}));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // assignVisitorIdToCookie is in all "get method"
  // it put visitor Id into cookies if cookie doesn't have one yet
  assignVisitorIdToCookie(req.session);

  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);

  // truthy userInfo means user is logged in
  if (userInfo) return res.redirect("/urls");
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
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

  // this function return the shortURL after adding it and other info into the URL database
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
  if (userInfo) return res.redirect("/urls");

  const templateVars = { userInfo };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);
  if (userInfo) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: "Logout to create account." }));
  }

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

  if (userInfo) return res.redirect("/urls");

  const templateVars = { userInfo: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);
  if (userInfo) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: "You are already logged in." }));
  }

  const { email: emailInput, password: passwordInput } = req.body;
  const result = authenticateUser(emailInput, passwordInput);

  const error = result.err;
  if (error) {
    return (
      res
        .status(400)
        .render('urls_error', { userInfo: null, error }));
  }

  const { data: userId } = result;
  req.session.userId = userId;
  res.redirect("/urls");
});

app.delete("/urls/:shortURL/", (req, res) => {
  const { userId: loggedInId } = req.session;
  const { shortURL } = req.params;
  const errMsgForNotLoggedIn = "You have to login to delete url.";
  const errMsgForURLNotBelongToUser = "You cannot delete url of another user.";
  const infoToDeleteURL = {
    shortURL,
    errMsgForNotLoggedIn,
    errMsgForURLNotBelongToUser,
    userId: loggedInId
  };
  const result = checkIfURLBelongsToUser(infoToDeleteURL, getUserInfoById);
  
  const error = result.err;
  if (error) {
    const userInfo = getUserInfoById(loggedInId);
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  deleteURL(shortURL);
  res.redirect("/urls");
});

app.put("/urls/:shortURL", (req, res) => {
  const { userId: loggedInId } = req.session;
  const errMsgForNotLoggedIn = "You have to login to edit url.";
  const errMsgForURLNotBelongToUser = "You cannot edit url of another user.";
  const { shortURL } = req.params;
  const infoToEditURL = {
    shortURL,
    errMsgForNotLoggedIn,
    errMsgForURLNotBelongToUser,
    userId: loggedInId
  };
  const result = checkIfURLBelongsToUser(infoToEditURL, getUserInfoById);
  
  const error = result.err;
  if (error) {
    const userInfo = getUserInfoById(loggedInId);
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  const { longURL: newLongURL } = req.body;
  editURL(shortURL, newLongURL);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  assignVisitorIdToCookie(req.session);

  const { userId: loggedInId } = req.session;
  const errMsgForNotLoggedIn = "You have to login to edit url.";
  const errMsgForURLNotBelongToUser = "You cannot edit url of another user.";

  const { shortURL } = req.params;
  const infoToViewURLDetails = {
    shortURL,
    errMsgForNotLoggedIn,
    errMsgForURLNotBelongToUser,
    userId: loggedInId
  };
  const result = checkIfURLBelongsToUser(infoToViewURLDetails, getUserInfoById);
  
  const error = result.err;
  if (error) {
    const userInfo = getUserInfoById(loggedInId);
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error }));
  }

  const { data: userInfo } = result;

  // it is certain that result2 doesn't have error
  // checkIfURLBelongsToUser has already scan for all possible errors
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
    const { userId: loggedInId } = req.session;
    const userInfo = getUserInfoById(loggedInId);
    return (
      res
        .status(400)
        .render('urls_error', { userInfo, error: errMsg }));
  }

  const { longURL } = result.data;
  makeVisitorRecords(shortURL, visitorId);
  res.redirect(longURL);
});

app.get("*", (req, res) => {
  assignVisitorIdToCookie(req.session);

  const { userId: loggedInId } = req.session;
  const userInfo = getUserInfoById(loggedInId);
  const errMsg = `This path does not exist. Please check the url.`;
  res
    .status(404)
    .render('urls_error', { userInfo, error: errMsg });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});