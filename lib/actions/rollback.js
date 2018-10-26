const utils = require('../utils')
const Kong = require('../kong').Kong
const database = require('../database')


const action = async (steps) => {

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

   // this should actually come from the database.
   const migrations = await db.getLatest()

   if (migrations.length < steps) steps = migrations.length
   // Execute Run for each file in order
 
    // if not, up it.

  for (let i = 0; i < steps; i++) {
    const file = migrations[i].dataValues.file

    const m = require(`${process.cwd()}/kong-migrations/${file}`)
    
    if (m.down) {
      try {
        await m.down(kong)
        await db.removeMigration({file: file})
        console.log(`Rolled back ${ migrations[i].dataValues.file } `)
      } catch (error) {
        console.log(`Failed to rollback ${ migrations[i].dataValues.file} with message: ${ error.message}`)
      }
    } 
  }

  console.log('Rolled back migrations')
}

module.exports = action