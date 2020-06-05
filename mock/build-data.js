const fs = require('fs');

const config = {
    ...require('./api/pokemon')
};

fs.writeFileSync('data.json', JSON.stringify(config));