const crypto = require('crypto');

// Beispiel: SHA-256 Hash
const input = "Hallo Welt";
const hash = crypto.createHash("sha256").update(input).digest("hex");

console.log("SHA-256:", hash);