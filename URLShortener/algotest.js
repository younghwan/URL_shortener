var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function base62_encode(n, alpha) {
  var num = n || 0;
  var alphabet = alpha || ALPHABET;

  if (num == 0) return alphabet[0];
  var arr = [];
  var base = alphabet.length;

  while(num) {
    rem = num % base;
    num = (num - rem)/base;
    char = alphabet.substring(rem,rem+1)
    if(char != '/' && char != ':'){
      arr.push(char); 
    }
  }

  return arr.reverse().join('');
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
console.log(base62_encode(66635, "https://www.naver.com/"));