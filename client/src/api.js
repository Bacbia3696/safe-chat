import openSocket from "socket.io-client";
import crypto from "crypto";
export const socket = openSocket("http://localhost:8000");

export function subscribeToChat() {
  fetch(process.env.REACT_APP_PUBLIC_KEY_FILE)
    .then(response => response.text())
    .then(publicKey => {
      socket.emit("subscribeToChat", {
        name: process.env.REACT_APP_USER || "Dat",
        publicKey
      });
    });
}

export function sendPackage(message, receiver) {
  let publicKey, privateKey;

  fetch(process.env.REACT_APP_PRIVATE_KEY_FILE)
    .then(response => response.text())
    .then(text => (privateKey = text))
    .then(() => {
      fetch(process.env.REACT_APP_PUBLIC_KEY_FILE)
        .then(response => response.text())
        .then(text => (publicKey = text))
        .then(() => {
          let encrypted;
          if (receiver) {
            receiver = receiver.replace(/ /g, "\n");
            receiver = receiver.replace(
              "-----BEGIN\nPUBLIC\nKEY-----",
              "-----BEGIN PUBLIC KEY-----"
            );
            receiver = receiver.replace(
              "-----END\nPUBLIC\nKEY-----",
              "-----END PUBLIC KEY-----\n"
            );
            encrypted = crypto
              .publicEncrypt(receiver, Buffer.from(message, "utf8"))
              .toString("hex");
          } else {
            encrypted = message;
          }
          let signature = signMessage(encrypted, privateKey);
          socket.emit("package", {
            encrypted,
            name: process.env.REACT_APP_USER,
            publicKey,
            receiver,
            signature
          });
        });
    });
}

// hash message with sha-256
// FIXME:
// eslint-disable-next-line
function hashMessage(message) {
  return crypto
    .createHash("sha256")
    .update(message, "utf8")
    .digest("utf8");
}

// sign message
function signMessage(message, privateKey) {
  const sign = crypto.createSign("rsa-sha256");
  sign.update(message);
  return sign.sign(privateKey, "base64");
}

// verify message
export function verifyMessage(message, signature, publicKey) {
  const verify = crypto.createVerify("rsa-sha256");
  verify.update(message);
  return verify.verify(publicKey, signature, "base64");
}
