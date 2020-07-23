/**
 * Generate a token of numbers, which cna be used for things like OTP
 * @param tokenLength - Length of token to be generated
 * @returns {string} - Actual token generated
 */
const generateToken = (tokenLength = 6) => {
  const digits = [...Array(10).keys()];
  let randomToken = '';
  for (let i = 0; i < tokenLength; i += 1) {
    const randNumber = Math.floor(Math.random() * Math.floor(10));
    randomToken += digits[randNumber].toString();
  }

  return randomToken;
};

module.exports.generateToken = generateToken;
