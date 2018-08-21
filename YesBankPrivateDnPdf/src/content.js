import _ from "lodash";
var CryptoJS = require("crypto-js");

CryptoJS.pad.NoPadding = { pad: function () { }, unpad: function () { } };

function decode(content, username, password) {
    //  Setting up data for decoding process
    var pepper = content.pepper;
    var iv = content.iv;
    var ivBytes = CryptoJS.enc.Base64.parse(iv);

    //  Constructing key
    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(username + pepper + password);
    var key = sha256.finalize();

    //  Setting up decryptor
    var aesDecryptor = CryptoJS.algo.AES.createDecryptor(key, { iv: ivBytes, padding: CryptoJS.pad.NoPadding });

    //  Decrypting content
    var decryptedPart1 = aesDecryptor.process(CryptoJS.enc.Base64.parse(content.encryptedData));
    var decryptedPart2 = aesDecryptor.finalize();
    var decryptedHex = decryptedPart1.toString() + decryptedPart2.toString();
    decryptedHex = decryptedHex.substring(0, content.dataLength * 2);
    var decryptedBytes = CryptoJS.enc.Hex.parse(decryptedHex);

    //  Checking signature of decrypted content
    sha256.reset();
    sha256.update(decryptedBytes);
    var signBytes = sha256.finalize();
    var sign = CryptoJS.enc.Base64.stringify(signBytes);

    if (sign === content.signature) {
        return CryptoJS.enc.Utf8.stringify(decryptedBytes);
    }
};

let data = {};

export function loadContent(username, password) {
    var content = decode(window.content, username, password);
    if (content != null) {
        _.extend(data, JSON.parse(content));
    }
    return content != null;
}

export default data;