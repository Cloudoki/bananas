const utils = require('../utils')
const Kong = require('../kong').Kong
const database = require('../database')
const chalk = require('chalk')
const log = console.log

const action = async () => {

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

  // Find kong-migrations folder
  // Get all files or range after last migration sequence
  let migrations = utils.getMigrationFiles()
  // Execute Run for each file in order

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
   const m = require(`${process.cwd()}/kong-migrations/${migration}`)
    if (m.up) {

      const err = await m.up(kong)

      if (err) return

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