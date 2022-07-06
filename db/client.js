// set environment
const environment = process.env.NODE_ENV || "development";
// load exported configurations from our knexfile.js
const config = require('../knexfile');
// grab the environment that you want to connect to
const environmentConfig = config[environment]
// require knex
const knex = require('knex');
const connection = knex(environmentConfig)

module.exports = connection