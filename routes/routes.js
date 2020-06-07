const path = require('path');

var appRouter = function (app, version, signale) {

    require('./health')(app,signale);
    require('./pokemon')(app,signale);

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname+'/../index.html'));
    });

    app.get("/api", function (req, res) {
        res.status(200).send(`Welcome to API - version ${encodeURI(version)}`);
    });
}

module.exports = appRouter;