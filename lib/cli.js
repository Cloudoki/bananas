#!/usr/bin/env node

'use strict'

const program = require('commander')
const actions = require('./actions')

const Kong = require('./kong').Kong

const utils = require('./utils')
const database = require('./database')

exports = module.exports = { }


// Find Dokikongfile
let Dokikongfile
  
try {
	Dokikongfile = utils.getDokikongfile()
} catch (error) {
	// Throw error if file is not found
	throw error
}

const Database = database.db(Dokikongfile.database.type)
const db = new Database(Dokikongfile.database.options)
const kong = new Kong(Dokikongfile.options)

let migrations = utils.getMigrationFiles()


program
	.version('0.0.1')
	.description('Migrates objects into kong')


program
	.command('migrate')
	.alias('m')
	.action(actions.migrate.bind(this,kong,migrations,db))

program
	.command('rollback <steps>')
	.alias('r <steps>')
	.action(actions.rollback.bind(this,kong,db))

program
	.command('make <name>')
	.alias('mk <name>')
	.action(actions.make)

program
	.command('init')
	.alias('i')
	.action(actions.init)

program.parse(process.argv)

module.exports = Kong
