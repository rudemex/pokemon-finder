# Pokemon finder - NodeJS
[![badge](https://img.shields.io/static/v1.svg?style=flat-square&label=Node&message=v10.15.1&color=brightgreen&logo=node.js)](https://nodejs.org/es/ "Node.js website")
[![badge](https://img.shields.io/static/v1.svg?style=flat-square&label=Npm&message=v6.14.5&color=brightgreen&logo=npm)](https://www.npmjs.com/ "Npm website")
## Swagger
+ Acceso a la documentación y testeo de las APIs: [url]/api-docs/
* Para registrar los nuevos endpoints en swagger, se debe anotar los mismo con la
anotation @swagger y completar un yamel con la información del mismo (ver ejemplo en pokemon.js).

## Variables de entorno

### Swagger
Puerto donde se muestra el swagger
```
SWAGGER_PORT
```
Indica se si habilita el endpoint para swagger.
```
SWAGGER_ENABLED
```
### Servidor Web
Puerto en donde escuchara el servidor web.
```
NODE_PORT
```
Contexname del api.
```
CONTEXT_NAME
```

## Ejecución
Instalar dependencias del proyecto
```sh
npm install
```
Para ejecutar el proyecto en el ambiente local, es decir en la pc del desarrollador se debe ejecutar:
```sh
npm run local
```

# Prueba de stress con Artillery.io
Documentación [Artillery.io](https://artillery.io/docs/)
```
npm install -g artillery
```

```
artillery quick --count 20 -n 20 http://localhost:8080/api/<endpoint>
```

# Referencia

json-server: https://github.com/typicode/json-server