#!/usr/bin/env node

'use strict'

const program = require('commander')
const actions = require('./actions')

const Kong = require('./kong').Kong

exports = module.exports = { }

program
 .version('0.0.1')
 .description('Migrates objects into kong')


program
 .command('migrate')
 .alias('m')
 .action(actions.migrate)

program
 .command('rollback <steps>')
 .alias('r <steps>')
 .action(actions.rollback)

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