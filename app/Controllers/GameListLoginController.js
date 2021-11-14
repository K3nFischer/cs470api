const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');
const bcrypt = require("bcryptjs");


require('dotenv').config();

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

            // Right up here, you could inspect the provided user_id to
            // make sure that it is, at the surface, a legitimate ID.
            // For example, if user ids are suppose to be email addresses,
            // you can at least make sure that user's input is consistent
            // with the format of email addresses.

            let query = "SELECT * FROM users WHERE username = ?";
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.username]
                }, (error, tuples) => {
                    if (error) {
                        console.log("Query error.", error);
                        return reject(`Query error. Error msg: error`);
                    }
                    if (tuples.length === 1) {  // Did we have a matching user record?
                        const bcrypt = require('bcryptjs');
                        const password = ctx.params.credentials;
                        const hash = tuples[0].credentials;
                        bcrypt.compare(password, hash, function(err, res) {
                            if(err) {
                                throw err;
                            } else if (!res) {
                                console.log("no match");
                            } else {
                                console.log("match");
                                setAccessToken(ctx, tuples[0]);
                            }
                        });
                        console.log('from studentRecord. About to return ', tuples[0]);
                        ctx.body = {
                            status: "OK",
                            user: tuples[0],
                        };
                    } else {
                        console.log('Not able to identify the user.');
                        return reject('No such user.');
                    }
                    return resolve();
                }
            )
        }).catch(err => {
            console.log('authorize in LoginController threw an exception. Reason...', err);
            ctx.status = 200;
            ctx.body = {
                status: "Failed",
                error: err,
                user: null
            };
        });

    }

}

module.exports = GameListLoginController;
