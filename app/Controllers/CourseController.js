const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

let count = 0;

class CourseController {
    constructor() {
        console.log('Constructor of CourseController is called.');
    }

    async coursesForTermAndSubject(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cb.term             term,
                               cb.subject          subject,
                               cb.catalog          catalog,
                               cc.section          section,
                               cc.component        component,
                               cb.course_title     course_title,
                               cb.department       department,
                               cc.class_number     class_number,
                               cb.combined_class_number combined_class_number,
                               cc.parent_class_number parent_class_number,
                               cb.units            units,
                               ci.instructor_id    instructor_id,
                               ci.instructor_fName instructor_fName,
                               ci.instructor_lName instructor_lName,
                               mp.meeting_pattern  meeting_pattern,
                               mp.start_time       start_time,
                               mp.end_time         end_time,
                               mp.facility_name    facility_name
                        FROM 
                            course_base cb, 
                            course_attributes ca, 
                            course_components cc LEFT JOIN course_instructors ci
                            ON (cc.term = ci.term AND cc.class_number = ci.class_number) LEFT JOIN meeting_pattern mp
                            ON (cc.term = mp.term AND cc.class_number = mp.class_number)
                        WHERE 
                            cb.term = ca.term AND 
                            cb.class_number = ca.class_number AND 
                            cb.term = cc.term AND 
                            cb.class_number = cc.parent_class_number AND 
                            cb.term = ? AND cb.subject = ? AND
                            cb.catalog != '101'
                        ORDER BY cb.term, cb.subject, cb.catalog, cc.section 
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.term, ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::allCourses", error);
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

    async coursesForTerm(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cb.term             term,
                               cb.subject          subject,
                               cb.catalog          catalog,
                               cc.section          section,
                               cc.component        component,
                               cb.course_title     course_title,
                               cb.department       department,
                               cc.class_number     class_number,
                               cb.combined_class_number combined_class_number,
                               cc.parent_class_number parent_class_number,
                               cb.units            units,
                               ci.instructor_id    instructor_id,
                               ci.instructor_fName instructor_fName,
                               ci.instructor_lName instructor_lName,
                               mp.meeting_pattern  meeting_pattern,
                               mp.start_time       start_time,
                               mp.end_time         end_time,
                               mp.facility_name    facility_name
                        FROM 
                            course_base cb, 
                            course_attributes ca, 
                            course_components cc LEFT JOIN course_instructors ci
                            ON (cc.term = ci.term AND cc.class_number = ci.class_number) LEFT JOIN meeting_pattern mp
                            ON (cc.term = mp.term AND cc.class_number = mp.class_number)
                        WHERE 
                            cb.term = ca.term AND 
                            cb.class_number = ca.class_number AND 
                            cb.term = cc.term AND 
                            cb.class_number = cc.parent_class_number AND 
                            cb.term = ? 
                        ORDER BY cb.term, cb.subject, cb.catalog, cc.section 
                            limit 10
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.term, ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::allCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = buildStudentViewFromCourses(tuples);
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = CourseController;
