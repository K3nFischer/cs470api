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

//Login
const LoginController = new (require('../app/Controllers/LoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.get('/:user_id', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));

//Routes
const RoutesController = new (require('../app/Controllers/RoutesController.js'))();
const routesRouter = require('koa-router')({
    prefix: '/routes'
});

routesRouter.use(VerifyJWT);
routesRouter.get('/all-routes', Authorize('admin'), RoutesController.allRoutes, err => console.log(`allRoutes ran into an error: ${err}`));
routesRouter.get('/:routeID/', Authorize('admin'), RoutesController.routeWithRouteID);

//Market
const MarketsController = new (require('../app/Controllers/MarketsController.js'))();
const marketsRouter = require('koa-router')({
    prefix: '/markets'
});

marketsRouter.use(VerifyJWT);
marketsRouter.get('/all-markets', Authorize('admin'), MarketsController.allMarkets, err => console.log(`allMarkets ran into an error: ${err}`));
marketsRouter.get('/:marketID/', Authorize('admin'), MarketsController.routeWithMarketID);

//Cycle
const CycleController = new (require('../app/Controllers/CycleController.js'))();
const cycleRouter = require('koa-router')({
    prefix: '/cycles'
});

cycleRouter.use(VerifyJWT);
cycleRouter.get('/currentCycle', Authorize('admin'), CycleController.getCurrentCycle, err => console.log(`getCurrentCycle ran into an error: ${err}`));

//Transaction
const TransactionsController = new (require('../app/Controllers/TransactionsController.js'))();
const transactionRouter = require('koa-router')({
    prefix: '/transactions'
});

transactionRouter.use(VerifyJWT);
transactionRouter.get('/:cycleID/all-routes', Authorize('admin'), TransactionsController.transactionsAllRoutes, err => console.log(`allRoutes ran into an error: ${err}`));
transactionRouter.get('/:cycleID/', Authorize('admin'), TransactionsController.currentTransactions);
transactionRouter.get('/:cycleID/:accountID/one-account', Authorize('admin'), TransactionsController.transactionsWithAccountID);
transactionRouter.get('/:cycleID/:routeID/trans-for-route', Authorize('admin'), TransactionsController.transactionsWithRouteID);
transactionRouter.get('/:cycleID/:marketID/trans-for-market', Authorize('admin'), TransactionsController.transactionsWithMarketID);


/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    routesRouter.routes(),
    marketsRouter.routes(),
    employeeRouter.routes(),
    transactionRouter.routes(),
    cycleRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
