const logger = require('tracer').colorConsole();
const config = require('config');
const bodyParser = require('body-parser');
const request = require('request');
const xss = require("xss");
const idx = require('idx');
const functions = require('../utils/functions');


module.exports = function (app) {
    const serverConfig = config.get('server');
    const servicesConfig=config.get('services');
    const context = serverConfig.context;
    const pokeapi = servicesConfig.pokeapi;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    /**
     * @swagger
     * definitions:
     *   pokemon:
     *      type: object
     *      properties:
     *          id:
     *              type: number
     *          name:
     *              type: string
     *          image:
     *              type: string
     *          types:
     *              type: array
     *              items:
     *                  type: string
     */

    /**
     * @swagger
     * /pokemon/{name}:
     *   get:
     *     tags:
     *       - Pokemon
     *     name: Obtención del pokemon por nombre.
     *     summary: Obtención del pokemon por nombre
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         in: path
     *         type: string
     *         required: false
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/pokemon'
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */

    app.get(encodeURI(context + "/pokemon/:name"), async (req, res) => {
        const name = req.params.name;
        logger.info('[i] ENDPOINT POKEMON BY NAME');

        if (name !== null && name !== undefined) {
            const url = encodeURI(`${pokeapi}/pokemon/${name}`);
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        const resp = JSON.parse(response.body);
                        logger.info('[i] POKEMON RESPONSE: ',resp);

                        let response_request = {
                            "id": resp.id,
                            "name": resp.forms[0].name,
                            "image": `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${functions.padDigits(resp.id,3)}.png`,
                            "types": resp.types.map( item => item.type.name )
                        };
                        //res.status(200).send( xss( JSON.stringify(response_request) ) );
                        res.status(200).send( response_request );
                    } else {
                        logger.error('error response: ', error);
                        res.status(409).send(error);
                    }
                } catch (error) {
                    logger.error('error: ', error);
                    res.status(409).send({error_message: `Error inesperado: ${error}`});
                }
            });
        }else{
            logger.error('error: ', error);
            res.status(409).send({error_message: `Error inesperado: ${error}`});
        }
    });
};