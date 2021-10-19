const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class TransactionsController {
    constructor() {
        console.log('Constructor of TransactionsController is called.');
    }

    async currentTransactions(ctx) {
        console.log('transactions currentTransactions called.');
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT COUNT(*) AS count
                        FROM 
                            transactions
                        WHERE
                            cycleID = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.cycleID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::currentTransactions", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                console.log("returning from count ", tuples[0])
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async transactionsWithAccountID(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transactions
                        JOIN
                            accounts
                        ON
                            transactions.accountID = accounts.accountID
                        WHERE 
                            transactions.cycleID = ?
                        AND
                            transactions.accountID = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.cycleID, ctx.params.accountID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsWithAccountID", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                console.log('returning from transactions account', tuples[0]);
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async transactionsWithRouteID(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transactions
                        JOIN
                            routes
                        ON
                            transactions.routeID = routes.routeID
                        WHERE 
                            transactions.cycleID = ?
                        AND
                            transactions.routeID = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.cycleID, ctx.params.routeID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsWithRouteID", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async transactionsAllRoutes(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transactions
                        JOIN
                            routes
                        ON
                            transactions.routeID = routes.routeID
                        WHERE 
                            transactions.cycleID = ?
                        ORDER BY 
                            routes.routeID
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.cycleID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsWithAllRoutes", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async transactionsWithMarketID(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transactions
                        JOIN
                            markets
                        ON
                            transactions.marketID = markets.marketID
                        WHERE 
                            transactions.cycleID = ?
                        AND 
                            transactions.marketID = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.cycleID, ctx.params.marketID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsWithMarketID", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                console.log(tuples[0]);
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }
}

module.exports = TransactionsController;