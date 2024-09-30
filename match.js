const brasileirao = require('./enums/brasileirao');
const ligaArgentina = require('./enums/ligaArgentina');
const liga1Peru = require('./enums/liga1peru');
const ligaChile = require('./enums/ligachile');
const seriebBrasil = require('./enums/seriebBrasil');

const daysToAnalize = 30;
const LigaConfig = brasileirao;
let arrayTeamsToAnalize = [
    {
        team: LigaConfig.teams.vitoria,
        isLocal: true
    },
    {
        team: LigaConfig.teams.criciuma,
        isLocal: false
    }
]

module.exports = {arrayTeamsToAnalize, LigaConfig, daysToAnalize}