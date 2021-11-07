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

    async allGenres(ctx){
        console.log('GamesController allGenres called.');
        return new Promise((resolve, reject) => {
            const query = `
            SELECT name, id FROM genres`;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allGenres", error);
                    ctx.body = []
                    ctx.status = 200;
                    return reject(error)
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async allPerspectives(ctx){
        console.log('GamesController allPerspectives called.');
        return new Promise((resolve, reject) => {
            const query = `SELECT name, id FROM cs470_gamelist.player_perspectives`;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allPerspectives", error);
                    ctx.body = []
                    ctx.status = 200;
                    return reject(error)
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async allPlatforms(ctx){
        console.log('GamesController allPlatforms called.');
        return new Promise((resolve, reject) => {
            const query = `SELECT name, id FROM cs470_gamelist.platforms`;
            dbConnection.query({
                sql: query,
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::allPlatforms", error);
                    ctx.body = []
                    ctx.status = 200;
                    return reject(error)
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
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

    async gamesNumberWithFilter(ctx){
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT count(*) as count 
                        FROM 
                            games
                        WHERE 
                            JSON_CONTAINS(genres, ?) and JSON_CONTAINS(platforms, ?) and JSON_CONTAINS(player_perspectives, ?)
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.genres, ctx.params.platform, ctx.params.perspective]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::gamesNumberWithFilter", error);
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

    async gamesWithFilter(ctx) {

        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            games
                        WHERE 
                            JSON_CONTAINS(genres, ?) and JSON_CONTAINS(platforms, ?) and JSON_CONTAINS(player_perspectives, ?) LIMIT ?, 100
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.genres, ctx.params.platform, ctx.params.perspective, parseInt(ctx.params.start)]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GamesController::gamesWithFilter", error);
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
                           SELECT 
                                *
                            FROM 
                                games
                            WHERE 
                                first_release_date < ?
                            ORDER BY
                                first_release_date DESC
                            LIMIT
                                10
                            `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.currentDate]
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
                           SELECT 
                                *
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

    async gameWithID(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            games
                        WHERE 
                            id = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.gameID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in RoutesController::gameWithID", error);
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