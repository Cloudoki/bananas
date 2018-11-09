const http = require('axios')
const log = console.log
const chalk = require('chalk')

exports = module.exports = {}

/**
 * 
 * @param {Object} options -
 * @param {Object} service -
 * @param  {...Object} route -
 * @returns {Void} -
 */
const createRoute = async (options,service, ...route) => {

	route.forEach( async(route)=>{

		route.service = {
			id: service.id,
		}

		try {
			await http.post(`${options.kongAdminUrl}/routes`, route)
		} catch (error) {
			log(chalk.red('Route creation failed with message: ' + error.message))
		}

	})
}

/**
 * 
 * @param {Object} options -
 * @param {Object} route -
 * @returns {Void} -
 */
const removeRoute = async (options, route) => {
	try {

		await http.delete(`${options.kongAdminUrl}/routes/${route}`)

	} catch (error) {
		log(chalk.red('Route removal failed with message: ', error.message))
	}
}


exports.createRoute = createRoute
exports.removeRoute = removeRoute
