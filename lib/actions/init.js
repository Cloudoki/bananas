const fs = require('fs')
const cwd = process.cwd()
const settings = require('../settings')

/**
 * @returns { Void } - 
 */
const action = async () => {
	fs.createReadStream( settings.ROOT_DIR + '/templates/dokikongfile.js').pipe(fs.createWriteStream(`${cwd}/Dokikongfile.js`))
}

module.exports = action
