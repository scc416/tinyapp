const generateRandomChar = () => {
  const numOfPossibleChar = 62; // 10 (0-9 digits) + 26 (26 letters in capital) + 26 (26 letters in lower case)
  const randomFloat = Math.random() * numOfPossibleChar;
  const randomInt = Math.floor(randomFloat);
  const randomIntIsBelow10 = randomInt < 10;
  if (randomIntIsBelow10) return randomInt;
  const randomIntIsBelow36 = randomInt < 36;
  let charCode = randomInt;
  if (randomIntIsBelow36) charCode += 55; //charCode of "A" is 65, 65 - 10 = 55
  if (!randomIntIsBelow36) charCode += 61; //charCode of "a" is 97, 97 - 36 = 61
  const randomLetter = String.fromCharCode(charCode);
  return randomLetter;
};

const generateRandomString = () => {
  let randomString = "";
  const lengthOfString = 6;
  for (let i = 0; i < lengthOfString; i++) {
    randomString += generateRandomChar();
  }
  return randomString;
};

const getUserByEmail = function(email, database) {
  for (const user in database) {
    const userInfo = database[user];
    const userEmail = userInfo.email;
    const emailIsRegistered = email === userEmail;
    if (emailIsRegistered) return userInfo;
  }
};


module.exports = { generateRandomString, getUserByEmail };