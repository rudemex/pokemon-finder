var appRouter = function (app, version, signale) {

    require('./health')(app,signale);
    require('./pokemon')(app,signale);

    app.get("/", function (req, res) {
        res.status(200).send(`Welcome to API - version ${encodeURI(version)}`);
    });
}

module.exports = appRouter;