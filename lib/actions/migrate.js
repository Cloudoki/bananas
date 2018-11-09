const chalk = require('chalk')
const log = console.log
const utils = require('../utils')

/**
 * 
 * @param {Object} kong -
 * @param {Array} migrations -
 * @param {Object} db -
 * @returns {Void} - 
 */
const action = async (kong,migrations,db) => {

	let executedMigrations = await db.getAll()

	executedMigrations = executedMigrations.map((el)=> {
		return el.dataValues.file
	})
  
	migrations = migrations.filter( (m) => {
		return !executedMigrations.includes(m)
	})

	const steps = migrations.length

	if (steps === 0) log(chalk.green('Migrations are up-to-date. Nothing to do here.'))

	migrations.forEach(async (migration,index)=>{
		// check if file was already migrated.
		log(chalk.green(`Running Migration [${index+1}/${steps}] > ${migration}`))	
		// if not, up it.
		const m = utils.require(`${process.cwd()}/kong-migrations/${migration}`)

		if (m.up) {

			try {     
				await m.up(kong)
			} catch (error) {
				log(chalk.red(error.message))
				throw new Error(`An error as occured migrating file ${migration}`)
			}

			try {
				await db.insertMigration({file: migration})
			} catch (error) {
				if (error.parent.code !== '23505') {
					log(chalk.red(error.message))
					return
				}
				
				log(chalk.red('Service already exists.'))
			}
		}
	})

}


module.exports = action
