// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// promisified fs module
const fs = require("fs-extra");
const path = require("path");

function getConfigurationByFile(configEnvFile) {

  // Resolve path of cypress.json env
  const pathToConfigFile = (configEnvFile === "local") ? path.resolve("./", `cypress.json`) : path.resolve("./", "config", `cypress.${configEnvFile}.json`);
    console.log(`[i] ENV: ${configEnvFile} - PATH JSON: ${pathToConfigFile}`);
  // Resolve path of env file
  const pathToConfigEnvFile = (configEnvFile === "local") ? path.resolve("./", "variables", `cypress.env`) : path.resolve("./", "variables", `cypress.${configEnvFile}.env`);
    console.log(`[i] ENV: ${configEnvFile} - PATH ENV: ${pathToConfigEnvFile}`);

  return fs.readJson(pathToConfigFile).then(data => {
    console.log(`[i] READ | ENV: ${configEnvFile} CONFIG:`, data);

    // Read env file
    const envFile = fs.readFileSync(pathToConfigEnvFile, "utf-8");
    // Set current ENV in json
    data.env["CYPRESS_ENV"] = configEnvFile;

    envFile.split("\n").map(line => {
      if (line.trim() !== "") {
        const [key, value] = line.split("=");
        data.env[key] = value.replace(/(\r\n|\n|\r)/gm, "");
        // remove prefix in envs
        //key.indexOf("CYPRESS_") === -1 ? (data.env[key] = value) : (data.env[key.slice(8)] = value);
      }
    });
    // Return final config
    console.log(`[i] FINAL CONFIG:`, data);
    return data;
  }).catch(err => {
    console.log(`[i] File ${configEnvFile} config read failed:`, err);
  });
}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  //console.log(on);
  // `config` is the resolved Cypress config
  //console.log(config);

  const CYPRESS_ENV = process.env.CYPRESS_ENV || "prd";
  // add values in env.
  config.env.ENV = CYPRESS_ENV;
  // Return config cypress.io
  return getConfigurationByFile(CYPRESS_ENV);
};


//touch carbon.png && carbon-now ./cypress/plugins/index.js -p mex-dev -t App-jsx -h
//touch carbon.png && carbon-now -p mex-dev --from-clipboard -h