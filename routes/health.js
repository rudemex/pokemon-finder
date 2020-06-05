const logger = require('tracer').colorConsole();
const config = require('config');

module.exports = function (app) {
    const serverConfig = config.get('server');
    const context = serverConfig.context;

    app.get(encodeURI(context + '/health'), function (req, res) {
        logger.info("Checkeo el estado de la API");
        res.json({ status: 'UP' });
    });
}