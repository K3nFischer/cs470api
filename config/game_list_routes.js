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

//Games
const GamesController = new (require('../app/Controllers/GamesController.js'))();
const gamesRouter = require('koa-router')({
   prefix: '/games'
});

gamesRouter.get('/all-games', GamesController.allGames, err => console.log(`allGames ran into an error: ${err}`));
gamesRouter.get('/game-name', GamesController.gameWithGameName, err => console.log(`gameWithGameName ran into an error: ${err}`));

router.use(
    '',
    loginRouter.routes(),
    gamesRouter.routes()

);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
}