const utils = require('../utils')
const Kong = require('../kong').Kong
const database = require('../database')
const log = console.log
const chalk = require('chalk')

const action = async (kong,db,steps) => {

	const migrations = await db.getLatest()

	if (migrations.length < steps) steps = migrations.length
	// Execute Run for each file in order
 
	// if not, up it.

	if (migrations.length === 0) {
		log(chalk.green('You have reached the beggining of history. Everything was rolled back.'))
		return
	}
  
	for (let i = 0; i < steps; i++) {
		const file = migrations[i].dataValues.file

		const m = require(`${process.cwd()}/kong-migrations/${file}`)
    
		if (m.down) {
			try {
				await m.down(kong)
				await db.removeMigration({file: file})
				log(chalk.green(`Rolled back ${ migrations[i].dataValues.file } `))
			} catch (error) {
				log(chalk.red(`Failed to rollback ${ migrations[i].dataValues.file} with message: ${ error.message}`))
			}
		} 
	}

	log(chalk.green('Rolled back migrations'))
}

module.exports = action
