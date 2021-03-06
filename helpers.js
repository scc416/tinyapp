const bcrypt = require("bcryptjs");

const generateRandomChar = () => {
  const possibleChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numOfPossibleChar = possibleChars.length;
  
  const randomFloat = Math.random() * numOfPossibleChar;
  const randomInt = Math.floor(randomFloat);
  const randomChar = possibleChars[randomInt];
  return randomChar;
};

const generateRandomString = () => {
  const lengthOfString = 6;
  let randomString = "";
  for (let i = 0; i < lengthOfString; i++) {
    randomString += generateRandomChar();
  }
  return randomString;
};

const createDateString = () => {
  const date = new Date();
  const options = {
    timeZone: 'America/Toronto',
    timeZoneName: 'short'
  };
  const dateString = date.toLocaleString('en-US', options);
  return dateString;
};

const assignVisitorIdToCookie = (cookie) => {
  const { visitorId } = cookie;
  if (!visitorId) cookie.visitorId = generateRandomString();
};

const uniqueKeyChecker = (newKey, database) => {
  for (const key in database) {
    const keyAreSame = key === newKey;
    if (keyAreSame) return false;
  }
  return true;
};

// function to use as method in url database object
const uniqueVisitorsCounter = function() {
  const visitors = [];
  const visitorRecord = this.visitorRecord;
  for (const record of visitorRecord) {
    const visitorId = record.visitorId;
    const counted = visitors.includes(visitorId);
    if (!counted) visitors.push(visitorId);
  }

  const count = visitors.length;
  return count;
};

const hashPassword = password => bcrypt.hashSync(password, 10);
const checkPassword = (password, hash) => bcrypt.compareSync(password, hash);

// closure for user database
const userHelperGenerator = (userDatabase) => {
  
  const getUserByEmail = (email) => {
    for (const userId in userDatabase) {
      const { email: userEmail } = userDatabase[userId];
      const emailIsRegistered = email === userEmail;
      if (emailIsRegistered) return userId;
    }
  };

  const getUserInfoById = (userId) => {
    if (userId) {
      const userInfo = userDatabase[userId];
      return userInfo;
    }
  };

  const getIdForNewUser = (email, password) => {

    const emailIsEmpty = email === "";
    if (emailIsEmpty) {
      return { data: null, err: "Email address cannot be empty." };
    }
  
    const passwordIsEmpty = password === "";
    if (passwordIsEmpty) {
      return { data: null, err: "Password cannot be empty." };
    }
  
    const existingUserId = getUserByEmail(email);
    if (existingUserId) {
      return { data: null, err: "The email address is already registered." };
    }
  
    let id = generateRandomString();
    while (!uniqueKeyChecker(id, userDatabase)) {
      id = generateRandomString();
    }

    const hashedPassword = hashPassword(password);
    const newUserInfo = { id, email, password: hashedPassword };
    userDatabase[id] = newUserInfo;
  
    return { data: id, err: null };
  };

  const authenticateUser = (emailInput, passwordInput) => {
    const someInfoIsEmpty = emailInput === "" || passwordInput === "";
    if (someInfoIsEmpty) {
      return { data: null, err: "Please fill in email address and password." };
    }

    const userId = getUserByEmail(emailInput);
    if (!userId) {
      return { data: null, err: "The email address is not registered." };
    }

    const userInfo = getUserInfoById(userId);
    const { password } = userInfo;
    const passwordIsCorrect = checkPassword(passwordInput, password);
  
    if (!passwordIsCorrect) {
      return { data: null, err: "The password doesn't match with the email address." };
    }

    return { data: userId, err: null };
  };

  return { getUserByEmail, getUserInfoById, getIdForNewUser, authenticateUser };
};

// closure for urls database
const urlHelperGenerator = (urlDatabase) => {

  const makeVisitorRecords = (shortURL, visitorId) => {
    const record = { visitorId, timestamp: createDateString() };
    const { visitorRecord } = urlDatabase[shortURL];
    visitorRecord.push(record);
  };

  const getURLsOfAnUser = (id) => {
    const urls = {};
    for (const shortURL in urlDatabase) {
      const urlInfo = urlDatabase[shortURL];
      const { userId: urlUserId } = urlInfo;
      const urlBelongsToUser = urlUserId === id;
      if (urlBelongsToUser) urls[shortURL] = urlInfo;
    }
    return urls;
  };
  
  const deleteURL = (shortURL) => {
    delete urlDatabase[shortURL];
  };

  const editURL = (shortURL, longURL) => {
    const urlInfo = urlDatabase[shortURL];
    urlInfo.longURL = longURL;
  };

  const generateNewShortenURL = (longURL, userId) => {
    let shortURL = generateRandomString();

    while (!uniqueKeyChecker(shortURL, urlDatabase)) {
      shortURL = generateRandomString();
    }

    const urlInfo = {
      longURL,
      userId,
      visitorRecord: [],
      dateCreated: createDateString(),
      numOfUniqueVisitors: uniqueVisitorsCounter
    };
    urlDatabase[shortURL] = urlInfo;
    
    return shortURL;
  };

  // parameter getUserInfoById is a function
  // it is passed in to check the userId with the user database
  // meanwhile, this function (checkIfURLBelongsToUser) itself deal with the url database
  const checkIfURLBelongsToUser = (info, getUserInfoById) => {
    const { userId, shortURL, errMsgForNotLoggedIn, errMsgForURLNotBelongToUser } = info;
    
    const urlInfo = urlDatabase[shortURL];
    if (!urlInfo) {
      return { data: null, err: "This shorten url does not exist." };
    }

    const userInfo = getUserInfoById(userId);
    if (!userInfo) {
      return { data: null, err: errMsgForNotLoggedIn };
    }
  
    const { userId: urlUserId } = urlInfo;
    const urlBelongsToUser = userId === urlUserId;
    if (!urlBelongsToUser) {
      return { data: null, err: errMsgForURLNotBelongToUser };
    }
    return { data: userInfo, err: null };
  };
  
  const getURLInfoByShortURL = (shortURL) => {
    const urlInfo = urlDatabase[shortURL];
    if (!urlInfo) return { data: null, err: "This short URL does not exist." };
    return { data: urlInfo, err: null };
  };

  return {
    makeVisitorRecords,
    getURLsOfAnUser,
    editURL,
    deleteURL,
    generateNewShortenURL,
    checkIfURLBelongsToUser,
    getURLInfoByShortURL
  };

};

module.exports = {
  userHelperGenerator,
  urlHelperGenerator,
  hashPassword,
  checkPassword,
  generateRandomString,
  uniqueKeyChecker,
  uniqueVisitorsCounter,
  assignVisitorIdToCookie,
  createDateString
};