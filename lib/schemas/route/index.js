const joi = require('joi')

const Route = joi.object().keys({
	protocols: joi.array().items(joi.string().valid('http', 'https').required()).required(),
	methods: joi.array().items(joi.string().valid('GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'HEAD').required()).required(),
	hosts: joi.array().items(joi.string().required()).optional(),
	paths: joi.array().items(joi.string().required()).optional(),
	regex_priority: joi.number().default(0).optional(),
	strip_path: joi.bool().optional().default(true),
	preserve_host: joi.bool().optional().default(false),
	service: joi.object().keys({
		id: joi.string().required(),
	}),
})

module.exports = Route
