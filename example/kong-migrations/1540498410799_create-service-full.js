module.exports.up = async (kong) => {
	await kong
		.createService({
			name: "openbank-auth-server",
			url: "http://openbank_auth_server:3000",
		}).then((service) => service.createRoute(service.service.id,{
			protocols: ['http', 'https'],
			methods: ['GET', 'POST', 'PUT'],
			paths: ['/auth-server/(?<action>.*)'],
			strip_path: false,
			preserve_host: false,
		}))
}

module.exports.down = async (kong) => {
	return await kong.removeService('openbank-auth-server')
}