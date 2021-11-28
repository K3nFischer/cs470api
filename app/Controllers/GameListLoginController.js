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
                        ctx.body = {status: "BAD"};
                        return reject('Could not create user');
                    } else {
                        ctx.body = {status: "OK"};
                        return resolve();
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
                }, async (error, tuples) => {
                    if (error) {
                        console.log("Query error.", error);
                        return reject(error);
                    }
                    if (tuples.length === 1) {  // Did we have a matching user record?
                        const bcrypt = require('bcryptjs');
                        const password = ctx.params.credentials;
                        const hash = tuples[0].credentials;
                        const match = await bcrypt.compare(password, hash);
                        console.log(match);
                        if(match) {
                            ctx.body = {
                                status: "OK",
                                user: tuples[0].username,
                            };
                        } else {
                            ctx.body = {
                                status: "BAD",
                            };
                            return reject('Incorrect Password');
                        }
                    } else {
                        console.log('Not able to identify the user.');
                        ctx.body = {status:"BAD"};
                        return reject('No such user.');
                    }
                    return resolve();
                }
            )
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = GameListLoginController;
