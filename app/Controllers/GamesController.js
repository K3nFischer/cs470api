const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class GamesController {
    constructor() {
        console.log('Constructor of GamesController is called.');
    }

    async allGames(ctx) {
        console.log('GamesController allGames called.');
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            games
                        ORDER BY
                            aggregated_rating
                        `;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allGames", error);
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

    async gameWithGameName(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            games
                        WHERE 
                            name = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.gameName]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::gameWithGameName", error);
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

    async recentGames(ctx) {
        console.log('GamesController allGames called.');
        return new Promise((resolve, reject) => {
            const query = `
                           SELECT *
                            FROM 
                                games
                            WHERE 
                                first_release_date < 1634985471
                            ORDER BY
                                first_release_date DESC
                            LIMIT
                                10
                            `;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allGames", error);
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


    async topGames(ctx) {
        console.log('GamesController allGames called.');
        return new Promise((resolve, reject) => {
            const query = `
                           SELECT *
                            FROM 
                                games
                            ORDER BY
                                aggregated_rating DESC
                            LIMIT
                                10
                            `;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allGames", error);
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

}

module.exports = GamesController;