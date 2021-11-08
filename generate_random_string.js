const generateRandomChar = () => {
  const randomFloat = Math.random() * 36;
  const randomInt = Math.floor(randomFloat);
  const randomIntIsBelowTen = randomInt < 10;
  if (randomIntIsBelowTen) return randomInt;
  const charCode = randomInt + 87;
  const randomLetter = String.fromCharCode(charCode);
  return randomLetter;
}

const generateRandomString = () => {
  let randomString = "";
  const lengthOfString = 6;
  for (let i = 0; i < lengthOfString; i++) {
    randomString += generateRandomChar();
  }
  return randomString;
};

module.exports = generateRandomString;