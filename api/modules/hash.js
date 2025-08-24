const bcrypt = require('bcrypt');

const saltRounds = 10;

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                reject(err);
                return;
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(hash); 
            });
        });
    });
}

module.exports = { hashPassword };