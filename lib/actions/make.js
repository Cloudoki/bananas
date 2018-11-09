const fs = require('fs')
const cwd = process.cwd()

const settings = require('../settings')

/**
 * 
 * @param {String} name  - 
 * @returns { Void } - 
 */
const action = (name) => {

	if (!fs.existsSync(`${cwd}/kong-migrations`)) {
		fs.mkdirSync(`${cwd}/kong-migrations`)
	}

	const timestamp = new Date().getTime()
	const file =`${timestamp}_${name}.js` 

	fs.createReadStream(settings.ROOT_DIR + '/templates/template.js').pipe(fs.createWriteStream(`${cwd}/kong-migrations/${file}`))

}

module.exports = action
