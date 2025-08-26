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

async function comparePasswords(userPassword, hashedPassword) {
    try {
        const result = await bcrypt.compare(userPassword, hashedPassword);
        console.log(result);
        return result;
    } catch (err) {
        console.error("Error when comparing passwords:", err);
        throw err;
    }
};

module.exports = { hashPassword, comparePasswords };