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
    const paramsConfig=config.get('params');
    const context = serverConfig.context;
    const pokeapi = servicesConfig.pokeapi;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    /**
     * @swagger
     * definitions:
     *   pokemons:
     *      type: object
     *      properties:
     *          count:
     *              type: number
     *          next:
     *              type: string
     *          previous:
     *              type: string
     *          results:
     *              type: array
     *              items:
     *                  type: object
     *                  properties:
     *                      name:
     *                          type: string
     *                      url:
     *                          type: string
     *   pokemon:
     *      type: object
     *      properties:
     *          id:
     *              type: number
     *          name:
     *              type: string
     *          description:
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
     * /pokemons:
     *   get:
     *     tags:
     *       - Pokemon
     *     name: Obtiene todos los pokemons.
     *     summary: Obtiene todos los pokemons.
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: limit
     *         in: query
     *         type: int
     *         required: false
     *       - name: offset
     *         in: query
     *         type: int
     *         required: false
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/pokemons'
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */

    app.get(encodeURI(context + "/pokemons"), async (req, res) => {
        const limit = req.query.limit || paramsConfig.limit;
        const offset = req.query.offset || paramsConfig.offset;
        logger.info('[i] ENDPOINT POKEMONS');

        if (limit !== null && limit !== undefined && offset !== null && offset !== undefined) {
            const url = encodeURI(`${pokeapi}/pokemon?limit=${ parseInt(limit) }&offset=${ parseInt(offset) }`);
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        const resp = JSON.parse(response.body);
                        //logger.info('[i] POKEMON RESPONSE: ',resp);
                        res.status(200).send( resp );
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

    /**
     * @swagger
     * /pokemon/{name}:
     *   get:
     *     tags:
     *       - Pokemon
     *     name: Obtiene el pokemon por nombre/nro de pokemon.
     *     summary: Obtiene el pokemon por nombre/nro de pokemon
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
     *         required: true
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

                        getPokemonDescription(resp.id).then( respDescription => {
                            logger.info('[i] POKEMON RESPONSE DESCRIPTION: ',respDescription);

                            let response_request = {
                                "id": resp.id,
                                "name": resp.forms[0].name,
                                "description": respDescription,
                                "image": `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${functions.padDigits(resp.id,3)}.png`,
                                "types": resp.types.map( item => item.type.name )
                            };
                            //res.status(200).send( xss( JSON.stringify(response_request) ) );
                            res.status(200).send( response_request );
                        }).catch( error => {
                            logger.error('error: ', error);
                            res.status(409).send({error_message: `Error inesperado: ${error}`});
                        })

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

    const getPokemonDescription = async (id) => {
        const url = encodeURI(`${pokeapi}/pokemon-species/${id}/`);
        logger.info('[i] POKEMON SPECIES URL: ',url);

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                const resp = JSON.parse(response.body);
                //logger.info('[i] POKEMON SPECIES RESPONSE: ',resp);
                if (!error && response && response.statusCode == 200) {
                    resolve(resp.flavor_text_entries[0].flavor_text.replace(/\r?\n|\f|\r/g, " "));
                } else {
                    logger.error(error);
                    reject('')
                }
            });
        });

    }

    //let data = functions.filterResponse(resp.results, 'name', 'pik');
};