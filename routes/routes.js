var appRouter = function (app, version) {

    require('./health')(app);
    require('./pokemon')(app);

    app.get("/", function (req, res) {
        res.status(200).send(`Welcome to API - version ${encodeURI(version)}`);
    });
}

module.exports = appRouter;