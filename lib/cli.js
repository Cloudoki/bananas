#!/usr/bin/env node

'use strict'

const program = require('commander')
const fs = require('fs')
const cwd = process.cwd()
const Kong = require('./kong').Kong
const database = require('./database')

exports = module.exports = { }

program
 .version('0.0.1')
 .description('Migrates objects into kong')


program
 .command('migrate')
 .alias('m')
 .action(async () => {

  // Find KongMigrationfile
  let kongMigrationFile
  
  try {
   kongMigrationFile = getKongMigrationFile()
  } catch (error) {
   // Throw error if file is not found
   throw error
  }


  const Database = database.db(kongMigrationFile.database.type)

  
  const db = new Database(kongMigrationFile.database.options)

  const kong = new Kong(kongMigrationFile.options)

  // Find kong-migrations folder
  // Get all files or range after last migration sequence
  let migrations = getMigrationFiles()
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

 })

program
 .command('rollback <steps>')
 .alias('r <steps>')
 .action(async (steps) => {

    // Find KongMigrationfile

    let kongMigrationFile

    try {
      kongMigrationFile = getKongMigrationFile()
     } catch (error) {
      // Throw error if file is not found
      throw error
     }

     const Database = database.db(kongMigrationFile.database.type)
     
     const db = new Database(kongMigrationFile.database.options)

     const kong = new Kong(kongMigrationFile.options)
   
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
 })

program
 .command('make <name>')
 .alias('mk <name>')
 .action((name)=> {

  if (!fs.existsSync(`${cwd}/kong-migrations`)) {
    fs.mkdirSync(`${cwd}/kong-migrations`)
  }

  const timestamp = new Date().getTime()
  const file =`${timestamp}_${name}.js` 

  fs.createReadStream(__dirname + '/templates/template.js').pipe(fs.createWriteStream(`${cwd}/kong-migrations/${file}`))

 })


function getKongMigrationFile() {
const files = fs.readdirSync(cwd)
const result = files.find((file)=> {
  return file === 'KongMigrationFile.js'
})

if (!result || result.length === 0) {
  throw new Error('Could not find KongMigrationFile in the current directory')
}

return require(`${process.cwd()}/${result}`)
}

function getMigrationFiles() {
  return fs.readdirSync(`${cwd}/kong-migrations/`).sort()
}

program.parse(process.argv)

module.exports = Kong