# Pokemon finder - NodeJS
[![badge](https://img.shields.io/static/v1.svg?style=flat-square&label=Node&message=v10.15.1&color=brightgreen&logo=node.js)](https://nodejs.org/es/ "Node.js website")
[![badge](https://img.shields.io/static/v1.svg?style=flat-square&label=Npm&message=v6.14.5&color=brightgreen&logo=npm)](https://www.npmjs.com/ "Npm website")
## Swagger
+ Acceso a la documentación y testeo de las APIs: http://localhost:8080/api-docs/
* Para registrar los nuevos endpoints en swagger, se debe anotar los mismo con la
anotation @swagger y completar un yamel con la información del mismo (ver ejemplo en pokemon.spec.js).

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
>Este proyecto utiliza Bower, en caso de no tenerlo instalado correr el comando `npm install -g bower`

Instalar dependencias del proyecto. 

```sh
bower install
```

```sh
npm install
```
Para ejecutar el proyecto en el ambiente local, es decir en la pc del desarrollador se debe ejecutar:
```sh
npm run local
```
Ingrese a [http://localhost:8080](http://localhost:8080)

# Testing
Los unit test, integration test y E2E Test están realizados con la plataforma Cypress.

```sh
npm run test
```

Test serverless con reporte
```sh
npm run test:serverless
```


# Prueba de stress con Artillery.io
Documentación [Artillery.io](https://artillery.io/docs/)
```sh
npm install -g artillery
```

```sh
artillery quick --count 20 -n 20 http://localhost:8080/api/pokemon/bulbasaur
```

# Referencia

json-server: https://github.com/typicode/json-server