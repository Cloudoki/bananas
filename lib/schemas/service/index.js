const joi = require('joi')

const Service = joi.object().keys({
	name: joi.string().required(),
	protocol: joi.array().items(joi.string().valid('http', 'https').required()).required(),
	host: joi.string().allow('').required(),
	port: joi.number().optional().default(80),
	path: joi.string().optional().default('/'),
	retries: joi.number().optional().default(5),
	connection_timeout: joi.number().optional().default(60000),
	write_timeout: joi.number().optional().default(60000),
	read_timeout: joi.number().optional().default(60000),
	url: joi.string().optional().allow(''),
})


module.exports = Service
