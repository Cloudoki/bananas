const http = require('axios')
const log = console.log
const chalk = require('chalk')

exports = module.exports = { }

/**
 * 
 * @param {Object} options -
 * @param {Object} service -
 * @param {Function} cb -
 * @returns {Void} -
 */
const createService = (options, service, cb) => {
	http.post(`${options.kongAdminUrl}/services`, service)
		.then((response)=> {
			return cb(null, response.data)
		})
		.catch((e)=> cb(e, null))
}

/**
 * 
 * @param {Object} options -
 * @param {Object} service -
 * @returns {Void} -
 */
const removeService = async(options, service) => {
	try {
		let response = await http.get(`${options.kongAdminUrl}/services/${service}/routes`)
		if (response.data) {
			response.data.data.forEach(async (route)=> {
				await http.delete(`${options.kongAdminUrl}/routes/${route.id}`)
			})
		}
    

		response = await http.get(`${options.kongAdminUrl}/services/${service}/plugins`)
		if (response.data) {
			response.data.data.forEach(async (plugin)=> {
				await http.delete(`${options.kongAdminUrl}/plugins/${plugin.id}`)
			})
		}
     
		await http.delete(`${options.kongAdminUrl}/services/${service}`)

	} catch (error) {
		log(chalk.red('Service removal failed with message: ', error))
	}

	return this
}


exports.createService = createService
exports.removeService = removeService
