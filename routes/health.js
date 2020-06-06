const config = require('config');

module.exports = function (app, signale) {
    const serverConfig = config.get('server');
    const context = serverConfig.context;

    app.get(encodeURI(context + '/health'), function (req, res) {
        signale.debug("Checkeo el estado de la API");
        res.json({ status: 'UP' });
    });
}