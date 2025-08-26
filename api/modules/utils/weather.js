const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const owm_token = process.env.OWM_TOKEN;
const owm_url = process.env.OWM_URL;

async function getWeather(country, city) {
    
};

module.exports = { getWeather };