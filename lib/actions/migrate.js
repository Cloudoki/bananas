const utils = require('../utils')
const Kong = require('../kong').Kong
const database = require('../database')


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

  migrations.forEach(async (migration)=>{
   // check if file was already migrated.

   // if not, up it.
   const m = require(`${process.cwd()}/kong-migrations/${migration}`)
    if (m.up) {
      await m.up(kong)
      try {
        await db.insertMigration({file: migration}) 
        console.log(`Migrated ${ migration } `)
      } catch (error) {
        if (error.parent.code !== '23505') console.error(error.message)
      }
    }
  })

 }


 module.exports = action