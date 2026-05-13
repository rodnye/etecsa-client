import CryptoJS from 'crypto-js';
import {
  generateEvenDigits,
  generateOddDigits,
  generateLowercaseLetters,
  generateUppercaseLetters,
  generateSpecialChars,
} from '../utils';

/**
 * All ETECSA request is encripted with this logic
 */
export const encryptEtecsaPayload = (
  data: any,
): { datos: [string, string] } => {
  let requestId = '';

  const randomPatternArray = Array.from(
    (function () {
      let str = '';
      for (let i = 5; i > 0; --i) {
        str += '12345'[Math.floor(Math.random() * '12345'.length)];
      }
      return str;
    })(),
  );

  for (let i = 0; i < randomPatternArray.length; i++) {
    const char = randomPatternArray[i];
    switch (char) {
      case '1':
        requestId += generateEvenDigits() + char;
        break;
      case '2':
        requestId += generateOddDigits() + char;
        break;
      case '3':
        requestId += generateLowercaseLetters() + char;
        break;
      case '4':
        requestId += generateUppercaseLetters() + char;
        break;
      case '5':
        requestId += generateSpecialChars() + char;
        break;
    }
  }

  const modifiedData = { ...data, id_peticion: requestId };

  const saltA = CryptoJS.lib.WordArray.random(5).toString();
  const saltB = CryptoJS.lib.WordArray.random(4).toString();
  const prefixA = CryptoJS.lib.WordArray.random(3).toString();
  const suffixA = CryptoJS.lib.WordArray.random(4).toString();

  const derivedKey = CryptoJS.PBKDF2(saltA, saltB, {
    keySize: 48,
    iterations: 100,
  });

  const iv = CryptoJS.enc.Hex.parse(derivedKey.toString().slice(0, 32));
  const key = CryptoJS.enc.Hex.parse(derivedKey.toString().slice(32, 96));

  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(modifiedData),
    key,
    {
      iv,
    },
  ).toString();

  const controlFlag =
    CryptoJS.lib.WordArray.random(2).toString() +
    'false' +
    CryptoJS.lib.WordArray.random(2).toString();
  const encodedFlag = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(controlFlag),
  );

  return {
    datos: [
      prefixA + saltA + encryptedData + suffixA + saltB,
      CryptoJS.lib.WordArray.random(3).toString() +
        encodedFlag.replace('==', '') +
        CryptoJS.lib.WordArray.random(3).toString(),
    ],
  };
};
