export const generateEvenDigits = (): string => {
  let result = '';
  for (let i = 5; i > 0; --i) {
    result += '02468'[Math.floor(Math.random() * '02468'.length)];
  }
  return result;
};

export const generateOddDigits = (): string => {
  let result = '';
  for (let i = 5; i > 0; --i) {
    result += '13579'[Math.floor(Math.random() * '13579'.length)];
  }
  return result;
};

export const generateLowercaseLetters = (): string => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 5; i > 0; --i) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
};

export const generateUppercaseLetters = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 5; i > 0; --i) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
};

export const generateSpecialChars = (): string => {
  const specials = '~!@#$%^&*()+=-]}{[?/.>,<*-+';
  let result = '';
  for (let i = 5; i > 0; --i) {
    result += specials[Math.floor(Math.random() * specials.length)];
  }
  return result;
};
