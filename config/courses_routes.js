const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'What is up?';
});


/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/


const LoginController = new (require('../app/Controllers/LoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.get('/:user_id', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));

/*
|--------------------------------------------------------------------------
| course router
|--------------------------------------------------------------------------
|
| Description
|
*/

const CourseController = new (require('../app/Controllers/CourseController.js'))();
const courseRouter = require('koa-router')({
    prefix: '/courses'
});

courseRouter.use(VerifyJWT);
courseRouter.get('/:term/:subject/term-subject', Authorize('student'), CourseController.coursesForTermAndSubject, err => console.log(`allCourses ran into an error: ${err}`));  
courseRouter.get('/:term/', Authorize('student'), CourseController.coursesForTerm);

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    courseRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
