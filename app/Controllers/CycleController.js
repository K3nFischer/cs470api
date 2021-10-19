const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class CycleController {
    constructor() {
        console.log('Constructor of CycleController is called.');
    }

    async getCurrentCycle(ctx) {
        console.log('transactions getCurrentCycle called.');
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cycleID
                        FROM 
                            cycles
                        ORDER BY 
                            cycleID DESC
                        LIMIT
                            1,1
                        `;
            dbConnection.query({
                sql: query
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CycleController::getCurrentCycle", error);
                    return reject(error);
                }
                if (tuples.length === 1) { //find cycle?
                    console.log('from cycles. About to return ', tuples[0]);
                    ctx.body = {
                        status: "OK",
                        currentCycle: tuples[0],
                    };
                } else {
                    console.log('Cannot find cycle');
                    return reject('No cycles matching description');
                }
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }
}

module.exports = CycleController;