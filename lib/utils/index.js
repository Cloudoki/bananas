const fs = require('fs')
const cwd = process.cwd()

exports = module.exports = {}

/**
 * @returns {Object} -
 */
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

/**
 * @returns {Array} -
 */
function getMigrationFiles() {
	return fs.readdirSync(`${cwd}/kong-migrations/`).sort()
}

/**
 * 
 * @param { String } path -
 * @returns { Object } -
 */
function r(path) {
	return require(path)
}

exports.getDokikongfile = getDokikongfile
exports.getMigrationFiles = getMigrationFiles
exports.require = r
