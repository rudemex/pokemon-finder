const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const routes = require("./routes/routes");
const config = require('config');
const swagger = require("./swagger");
const logger = require('tracer').colorConsole();
const pjson = require('./package.json');

const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

app.use(function (req, res, next) {
    const output_reqHeaders = {
        output: req.headers
    };
    const output_reqBody = {
        output: req.body
    };
    logger.info(`Interceptor: REQUEST to `, encodeURI(req.url));
    logger.info(`Interceptor: REQUEST HEADERS `, output_reqHeaders);
    logger.info(`Interceptor: REQUEST BODY `, output_reqBody);

    let whitelist = serverConfig.origins;
    let origin = req.headers.origin;

    //res.cookie('XSRF-TOKEN', req.csrfToken());
    //res.locals.csrftoken = req.csrfToken();
    //logger.info(`CSRF TOKEN: ${req.csrfToken()} `);

    if (serverConfig.corsEnabled && whitelist.indexOf(origin) > -1) {
        //res.setHeader('Access-Control-Allow-Origin', origin);
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS");//
        res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel");
        res.header("Access-Control-Allow-Credentials", "true");
    }
    // res.header("Access-Control-Allow-Origin", req.headers.origin);

    next();
});

const serverConfig = config.get('server');
const swaggerConfig = config.get('swagger');
const cors_options_enabled = {
    origin: serverConfig.origins,
    methods: "GET,HEAD,PUT,POST,DELETE,PATCH",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel"
};
const cors_options_disabled = {
    origin: "*",
    methods: "GET,HEAD,PUT,POST,DELETE,PATCH",
    credentials: false,
    allowedHeaders: "Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel"
};

//logger.info("Using config: ", config);

if (serverConfig.corsEnabled) {
    logger.info("Using cors config: ", cors_options_enabled);
    //app.use(cors(cors_options_enabled));
} else {
    logger.info("Using cors config: ", cors_options_disabled);
    app.use(cors(cors_options_disabled));
}

if (swaggerConfig.enabled) {
    swagger(app, serverConfig);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*app.all('*', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    logger.info(`CSRF TOKEN: ${req.csrfToken()} `);
})*/
const port = parseInt(serverConfig.port, 10) || 8080;
routes(app, pjson.version);

app.listen(port, () => {
    logger.info(`App running on port:`, port);
    logger.info(`Version: ${pjson.version}`);
});