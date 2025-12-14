const fs = require('fs');
const json = fs.readFileSync('C:\\Users\\ferla\\Downloads\\fermusic-eed71-firebase-adminsdk-fbsvc-0c6b21b078.json', 'utf8');
const base64 = Buffer.from(json).toString('base64');
console.log(base64);
