const fs = require('fs');

const config = {
    ...require('./api/search'),
    ...require('./api/pokemons'),
    ...require('./api/pokemon')
};

fs.writeFileSync('data.json', JSON.stringify(config));