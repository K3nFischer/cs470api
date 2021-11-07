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

gamesRouter.get('/gamesNumberWithFilter/:genres/:platform/:perspective', GamesController.gamesNumberWithFilter, err => console.log(`gamesNumberWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilter/:genres/:platform/:perspective/:start', GamesController.gamesWithFilter, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/all-games', GamesController.allGames, err => console.log(`allGames ran into an error: ${err}`));
gamesRouter.get('/game-name', GamesController.gameWithGameName, err => console.log(`gameWithGameName ran into an error: ${err}`));
gamesRouter.get('/recent-games/:currentDate', GamesController.recentGames, err => console.log(`recent-games ran into an error: ${err}`));
gamesRouter.get('/top-games', GamesController.topGames, err => console.log(`top-games ran into an error: ${err}`));
gamesRouter.get('/all-genres', GamesController.allGenres, err => console.log(`allGenres ran into an error: ${err}`));
gamesRouter.get('/all-perspectives', GamesController.allPerspectives, err => console.log(`allPerspectives ran into an error: ${err}`));
gamesRouter.get('/all-platforms', GamesController.allPlatforms, err => console.log(`allPlatforms ran into an error: ${err}`));
//gamesRouter.get('/gen-table/:table', GamesController.genTable, err => console.log(`genTable ran into an error: ${err}`));
gamesRouter.get('/:gameID', GamesController.gameWithID, err => console.log(`gameWithID ran into an error: ${err}`));

router.use(
    '',
    loginRouter.routes(),
    gamesRouter.routes()

);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
}