const service = require('./service')
const route = require('./route')
const plugin = require('./plugin')

exports = module.exports = { }

/**
 * @returns {Class} - 
 */
class Kong {

	/**
	 * 
	 * @param {Object} options -
	 */
	constructor(options) {
		this.createService = service.createService.bind(this, options)
		this.removeService = service.removeService.bind(this, options)
		this.createRoute = route.createRoute.bind(this, options)
		this.removeRoute = route.removeRoute.bind(this, options)
		this.createPlugin = plugin.createPlugin.bind(this, options)
		this.removePlugin = plugin.removePlugin.bind(this, options)
	}

}


exports.Kong = Kong
