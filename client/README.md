# Group chat

Simple app use RSA asymetric key to securely send message

### Use this command to generate private key

```
openssl genrsa -out rsa_1024_priv.pem 1024

openssl rsa -in rsa_1024_priv.pem -out rsa_1024_pub.pem -outform PEM -pubout
```

### Install dependencies

```
yarn
```

### Set enviroment varible

REACT_APP_USER: username  
REACT_APP_PUBLIC_KEY_FILE: public key file name put in public folder  
REACT_APP_PRIVATE_KEY_FILE: private key file name put in public folder

### Start client

```
yarn start
```
