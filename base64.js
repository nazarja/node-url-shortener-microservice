
function encode(num) {
    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
    var base = alphabet.length;
    var encoded = "";
    var  remainder;
    while (num) {
        remainder = num % base
        num -= remainder;
        num /= base;
        encoded = alphabet.charAt(remainder) + encoded;
    }
    return encoded;
}

function decode(str) {
    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
    var base = alphabet.length;
    var decoded = 0;
    var index;
    while (str.length) {
        index = alphabet.indexOf(str.charAt(0));
        str = str.substr(1);
        decoded *= base;
        decoded += index;
    }
    return decoded;
}

module.exports.encode = encode;
module.exports.decode = decode;