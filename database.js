const { hashPassword, uniqueVisitorsCounter, createDateString } = require("./helpers.js");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "aJ48lW",
    dateCreated: createDateString(),
    visitorsRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "aJ48lW",
    dateCreated: createDateString(),
    visitorsRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  }
};

const userDatabase = {
  "aJ48lW" : {
    id: "aJ48lW",
    email: "siu@protonmail.com",
    password: hashPassword("123456"),
  }
};

module.exports = { urlDatabase, userDatabase };