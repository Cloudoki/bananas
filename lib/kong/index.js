const service = require('./service')
const route = require('./route')

exports = module.exports = { }


class Kong {

	constructor(options) {
		this.createService = service.createService.bind(this, options)
		this.removeService = service.removeService.bind(this, options)
		this.createRoute = route.createRoute.bind(this, options)
		this.removeRoute = route.removeRoute.bind(this, options)
	}

}


exports.Kong = Kong
