const http = require('axios')
const log = console.log
const chalk = require('chalk')

exports = module.exports = {}

/**
 * 
 * @param {Object} options -
 * @param {Object} target -
 * @param  {...Object} plugins -
 * @returns {Void} -
 */
const createPlugin = async (options,target, ...plugins) => {

	plugins.forEach( async(plugin)=>{

		plugin = {
			plugin,
			target,
		}

		try {
			await http.post(`${options.kongAdminUrl}/plugins`, plugin)
		} catch (error) {
			log(chalk.red('Plugin creation failed with message: ' + error.message))
		}

	})
}

/**
 * 
 * @param {Object} options -
 * @param {Object} plugin -
 * @returns {Void} -
 */
const removePlugin = async (options, plugin) => {
	try {

		await http.delete(`${options.kongAdminUrl}/plugins/${plugin}`)

	} catch (error) {
		log(chalk.red('Plugin removal failed with message: ', error.message))
	}
}


exports.createPlugin = createPlugin
exports.removePlugin = removePlugin
