const config = require('config');
const bodyParser = require('body-parser');
const request = require('request');
const xss = require("xss");
const functions = require('../utils/functions');


module.exports = function (app, signale) {
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
     *      type: array
     *      items:
     *          type: object
     *          properties:
     *              id:
     *                  type: number
     *              name:
     *                  type: string
     *              description:
     *                  type: string
     *              image:
     *                  type: string
     *              types:
     *                  type: array
     *                  items:
     *                      type: string
     *              url:
     *                  type: string
     */

    /**
     * @swagger
     * /search:
     *   get:
     *     tags:
     *       - Pokemon
     *     name: Busca el pokemon por nombre/nro de pokemon.
     *     summary: Busca el pokemon por nombre/nro de pokemon
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: search
     *         in: query
     *         type: string
     *         required: true
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/pokemon'
     *       '204':
     *          description: No content.
     *       '400':
     *          description: Bad request.
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */
    app.get(encodeURI(context + "/search"), (req, res) => {
        signale.info('ENDPOINT SEARCH POKEMON');

        const search = req.query.search.toLowerCase();

        if (search !== null && search !== undefined) {

            searchPokemon(search).then( resp => {
                signale.debug("RESPONSE SEARCH POKEMON: ",resp);

                if ( resp !== null ){
                    res.status(200).send( JSON.stringify(resp) );
                }else{
                    searchAdvancePokemon(search).then( resp => {
                        res.status(200).send( JSON.stringify(resp) );
                    }).catch( error => {
                        signale.error(`Error: ${error}`);
                        res.status(409).send({error_message: `Error inesperado: ${error}`});
                    });
                }

            }).catch( error => {
                signale.error(`error: ${error}`);
                res.status(409).send('error');
            });
        }else{
            signale.error('Bad Request');
            res.status(400).send({error_message: `Bad Request`});
        }
    });

    /**
     * @swagger
     * /pokemons:
     *   get:
     *     tags:
     *       - Pokemon
     *     name: Obtiene todos los pokemones.
     *     summary: Obtiene todos los pokemones.
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
     *       '204':
     *          description: No content.
     *       '400':
     *          description: Bad request.
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */
    app.get(encodeURI(context + "/pokemons"), (req, res) => {
        signale.info('ENDPOINT GET ALL POKEMONS');

        const limit = req.query.limit || paramsConfig.limit;
        const offset = req.query.offset || paramsConfig.offset;

        if (limit !== null && limit !== undefined && offset !== null && offset !== undefined) {
            const url = encodeURI(`${pokeapi}/pokemon?limit=${ parseInt(limit) }&offset=${ parseInt(offset) }`);
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        signale.info('RESPONSE GET ALL POKEMONES');
                        const resp = JSON.parse(response.body);
                        res.status(200).send( JSON.stringify(resp) );
                    } else {
                        signale.error('error response: ', error);
                        res.status(409).send(error);
                    }
                } catch (error) {
                    signale.error('error: ', error);
                    res.status(409).send({error_message: `Error inesperado: ${error}`});
                }
            });
        }else{
            signale.error('Bad Request');
            res.status(400).send({error_message: `Bad Request`});
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
     *       '400':
     *          description: Bad request.
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */
    app.get(encodeURI(context + "/pokemon/:name"), (req, res) => {
        signale.info('ENDPOINT GET POKEMON BY NAME');
        const name = req.params.name;

        if (name !== null && name !== undefined) {
            const url = encodeURI(`${pokeapi}/pokemon/${name}`);
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        const resp = JSON.parse(response.body);
                        signale.info('GET POKEMON BY NAME/NRO POKEMON');

                        getPokemonDescription(resp.species.url).then( respDescription => {
                            signale.debug(`GET DESCRIPTION POKEMON OF: ${resp.forms[0].name}/${resp.id}`);
                            let response_data = [];

                            response_data.push({
                                "id": resp.id,
                                "name": resp.forms[0].name,
                                "description": respDescription,
                                "image": `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${functions.padDigits(resp.id,3)}.png`,
                                "types": resp.types.map( item => item.type.name )
                            });
                            //res.status(200).send( xss( JSON.stringify(response_data) ) );
                            res.status(200).send( JSON.stringify(response_data) );
                        }).catch( error => {
                            signale.error('error 1: ', error);
                            res.status(409).send({error_message: `Error inesperado: ${error}`});
                        })

                    } else {
                        signale.error('No content: ', error);
                        res.status(204).send({});
                    }
                } catch (error) {
                    signale.error('error 3: ', error);
                    res.status(409).send({error_message: `Error inesperado: ${error}`});
                }
            });
        }else{
            signale.error('Bad Request');
            res.status(400).send({error_message: `Bad Request`});
        }
    });

    const searchPokemon = (name) => {
        const url = encodeURI(`${pokeapi}pokemon/${name}`);
        signale.info('SEARCH POKEMON URL: ',url);

        return new Promise((resolve, reject) => {
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        const resp = JSON.parse(response.body);
                        signale.info('RESPONSE GET POKEMON BY NAME/NRO POKEMON');

                        getPokemonDescription(resp.species.url).then( respDescription => {
                            signale.debug(`GET DESCRIPTION POKEMON OF: ${resp.forms[0].name}/${resp.id}`);
                            let response_data = [];
                            response_data.push({
                                "id": resp.id,
                                "name": resp.name,
                                "description": respDescription,
                                "image": `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${functions.padDigits(resp.id,3)}.png`,
                                "types": resp.types.map( item => item.type.name ),
                                "url": resp.forms[0].url
                            });
                            resolve(response_data)
                        }).catch( error => {
                            signale.error('Error: ', error);
                            reject(null);
                        })

                    } else {
                        signale.error('No content: ', error);
                        resolve(null);
                    }
                } catch (error) {
                    signale.error('Error: ', error);
                    reject({error_message: `Error inesperado: ${error}`});
                }
            });
        });
    }

    const searchAdvancePokemon = (name, limit= paramsConfig.limit, offset = paramsConfig.offset ) => {
        const url = encodeURI(`${pokeapi}/pokemon?limit=${ parseInt(limit) }&offset=${ parseInt(offset) }`);
        signale.info('SEARCH POKEMONS URL: ',url);

        return new Promise( (resolve, reject) => {
            request(url,(error, response, body) => {
                try {
                    if (!error && response.statusCode == 200 && body !== '') {
                        const resp = JSON.parse(response.body);
                        signale.info('GET ALL POKEMONES');

                        let dataFilter = functions.filterResponse(resp.results, 'name', name);
                        getDataPokemon(dataFilter).then( res => {
                            signale.debug("RESULT SEARCH ADVANCE: ",res);
                            resolve(res);
                        });

                    } else {
                        signale.error('error response: ', error);
                        reject(error);
                    }
                } catch (error) {
                    signale.error('error: ', error);
                    reject(error);
                }
            });
        });
    }

    const getPokemonDescription = (urlSpecie) => {
        const url = encodeURI(`${urlSpecie}`);
        signale.info('POKEMON SPECIES URL: ',url);

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                const resp = JSON.parse(response.body);
                signale.info('GET DESCRIPTION OF POKEMON');
                if (!error && response && response.statusCode == 200) {
                    resolve(resp.flavor_text_entries[0].flavor_text.replace(/\r?\n|\f|\r/g, " "));
                } else {
                    signale.error(error);
                    reject(null)
                }
            });
        });
    }

    const getDataPokemon =  (data) => {
        signale.info('GET DATA POKEMON');
        return new Promise( (resolve, reject) => {
            try{
                let response_data = [];
                data.map( (item,i) => {
                    signale.debug("POKEMON NAME: ",item.name);
                    searchPokemon(item.name).then( r => {
                        signale.debug("RESPONSE SEARCH POKEMON: ",r);
                        response_data.push(r[0]);
                        return r[0];
                    }).catch( e => e);
                });

                setTimeout(() => {
                    signale.debug("RESPONSE DATA: ",response_data)
                    resolve(response_data)
                },1500)
            }catch{
                reject();
            }
        });
    }
};
