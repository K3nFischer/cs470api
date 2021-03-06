const dbConnection = require('../../database/mySQLconnect');

class ListController {

    constructor() {
        console.log('Constructor of ListController is called.');
    }

    async createList(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO
                    lists
                VALUES
                    (?, ?, uuid())
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.userID, ctx.params.listName]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::createList", error);
                    ctx.status = 200;
                    return reject(error);
                }
                console.log("Insert Successful");
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async deleteList(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM
                    lists
                WHERE
                    listid = ?
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.listID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::deleteList", error);
                    ctx.status = 200;
                    return reject(error);
                }
                console.log("Delete Successful");
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async getAllLists(ctx) {
        return new Promise( (resolve, reject) => {
            const query = `
                SELECT
                    listname, listid
                FROM
                    lists
                WHERE
                    username = ?
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.userID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::getAllLists", error);
                    ctx.status = 200;
                    return reject(error);
                }
                console.log("returning from getAllLists: ", tuples);
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async addToList(ctx) {
        return new Promise( (resolve, reject) => {
            const query = `
                INSERT INTO
                    list_game
                VALUES
                    (?, ?)
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.listID, parseInt(ctx.params.gameID)]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::addToList", error);
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async getList(ctx) {
        return new Promise( (resolve, reject) => {
            const query = `
                SELECT *
                FROM
                    list_game
                JOIN
                    games
                ON
                    games.id = list_game.gameid
                WHERE
                    listid = ?
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.listID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::addToList", error);
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async removeGame(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM
                    list_game
                WHERE
                    listid = ?
                AND
                    gameid = ?
            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.listID, ctx.params.gameID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ListController::deleteGame", error);
                    ctx.status = 200;
                    return reject(error);
                }
                console.log("Delete Successful");
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = ListController;