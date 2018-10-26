
const fs = require('fs')
const cwd = process.cwd()

exports = module.exports = {}


function getDokikongfile() {
  const files = fs.readdirSync(cwd)
  const result = files.find((file)=> {
    return file === 'Dokikongfile.js'
  })
  
  if (!result || result.length === 0) {
    throw new Error('Could not find Dokikongfile in the current directory')
  }

  return require(`${process.cwd()}/${result}`)
}

function getMigrationFiles() {
  return fs.readdirSync(`${cwd}/kong-migrations/`).sort()
}



exports.getDokikongfile = getDokikongfile
exports.getMigrationsFiles = getMigrationFiles