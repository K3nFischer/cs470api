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
const LoginController = new (require('../app/Controllers/GameListLoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});

loginRouter.get('/:username/:credentials', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));
loginRouter.get('/create/:username/:email/:credentials', LoginController.createUser, (err) => console.log("router.js: login create user error:", err));

//Games
const GamesController = new (require('../app/Controllers/GamesController.js'))();
const gamesRouter = require('koa-router')({
   prefix: '/games'
});

gamesRouter.get('/gamesNumberWithFilter/:genres/:platform/:perspective/:text', GamesController.gamesNumberWithFilter, err => console.log(`gamesNumberWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesNumberWithFilterNoText/:genres/:platform/:perspective', GamesController.gamesNumberWithFilterNoText, err => console.log(`gamesNumberWithFilter ran into an error: ${err}`));

gamesRouter.get('/gamesWithFilterRecent/:genres/:platform/:perspective/:text/:start', GamesController.gamesWithFilterRecent, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilterRecentNoText/:genres/:platform/:perspective/:start', GamesController.gamesWithFilterRecentNoText, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilterAlpha/:genres/:platform/:perspective/:text/:start', GamesController.gamesWithFilterAlpha, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilterAlphaNoText/:genres/:platform/:perspective/:start', GamesController.gamesWithFilterAlphaNoText, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilterRating/:genres/:platform/:perspective/:text/:start', GamesController.gamesWithFilterRating, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilterRatingNoText/:genres/:platform/:perspective/:start', GamesController.gamesWithFilterRatingNoText, err => console.log(`gamesWithFilter ran into an error: ${err}`));
gamesRouter.get('/gamesWithFilter/:genres/:platform/:perspective/:start', GamesController.gamesWithFilter, err => console.log(`gamesWithFilter ran into an error: ${err}`));

gamesRouter.get('/genresForGame/:genres', GamesController.genresForGame, err => console.log(`genresForGame ran into an error: ${err}`));
gamesRouter.get('/gameLookup/:game', GamesController.gameLookup, err=> console.log(`gameLookup ran into an error: ${err}`));

gamesRouter.get('/all-games', GamesController.allGames, err => console.log(`allGames ran into an error: ${err}`));
gamesRouter.get('/game-name', GamesController.gameWithGameName, err => console.log(`gameWithGameName ran into an error: ${err}`));
gamesRouter.get('/recent-games/:currentDate', GamesController.recentGames, err => console.log(`recent-games ran into an error: ${err}`));
gamesRouter.get('/top-games', GamesController.topGames, err => console.log(`top-games ran into an error: ${err}`));
gamesRouter.get('/all-genres', GamesController.allGenres, err => console.log(`allGenres ran into an error: ${err}`));
gamesRouter.get('/all-perspectives', GamesController.allPerspectives, err => console.log(`allPerspectives ran into an error: ${err}`));
gamesRouter.get('/all-platforms', GamesController.allPlatforms, err => console.log(`allPlatforms ran into an error: ${err}`));
gamesRouter.get('/:gameID', GamesController.gameWithID, err => console.log(`gameWithID ran into an error: ${err}`));

//Lists
const ListController = new (require('../app/Controllers/ListController.js'))();
const listRouter = require('koa-router')({
    prefix: '/lists'
});

listRouter.get('/create/:userID/:listName', ListController.createList, err => console.log(`createList ran into an error: ${err}`));
listRouter.get('/delete/:listID', ListController.deleteList, err => console.log(`deleteList ran into an error: ${err}`));
listRouter.get('/all/:userID', ListController.getAllLists, err => console.log(`getLists ran into an error: ${err}`));
listRouter.get('/add/:listID/:gameID', ListController.addToList, err => console.log(`addToList ran into an error: ${err}`));
listRouter.get('/get/:listID', ListController.getList, err => console.log(`getList ran into an error: ${err}`));
listRouter.get('/remove/:listID/:gameID', ListController.removeGame, err => console.log(`removeGame ran into an error: ${err}`));

router.use(
    '',
    loginRouter.routes(),
    gamesRouter.routes(),
    listRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
}