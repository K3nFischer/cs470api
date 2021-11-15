const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');

class GameListLoginController {

    constructor() {
        console.log('Constructor of GameListLoginController is called.');
    }

    async createUser(ctx) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(ctx.params.credentials, salt);

        return new Promise( (resolve, reject) => {
            let query = "INSERT INTO users VALUES (?, ?, ?)";
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.username, ctx.params.email, hash]
                }, (error, tuples) => {
                    if(error) {
                        console.log("Query error.", error);
                        return reject('Query error. Error msg: error');
                    }
                }
            )
        })
    }

    async authorizeUser(ctx) {

        return new Promise((resolve, reject) => {

            let query = "SELECT * FROM users WHERE username = ?";
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.username]
                }, (error, tuples) => {
                    if (error) {
                        console.log("Query error.", error);
                        return reject(error);
                    }
                    if (tuples.length === 1) {  // Did we have a matching user record?
                        const bcrypt = require('bcryptjs');
                        const password = ctx.params.credentials;
                        const hash = tuples[0].credentials;
                        ctx.body = {
                            status: "OK",
                            user: tuples[0].username,
                        };
                    } else {
                        console.log('Not able to identify the user.');
                        return reject('No such user.');
                    }
                    return resolve();
                }
            )
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = GameListLoginController;
