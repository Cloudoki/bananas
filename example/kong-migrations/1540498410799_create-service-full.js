module.exports.up = async (kong) => {

	kong.createService({
		name: "openbank-auth-server",
		url: "http://openbank_auth_server:3000",
	},(err, service)=>{

		if (err) return err

		await kong.createRoute(service,{
			protocols: ['http', 'https'],
			methods: ['GET', 'POST', 'PUT'],
			paths: ['/auth-server/(?<action>.*)'],
			strip_path: false,
			preserve_host: false,
		})

		await kong.createRoute(service,{
			protocols: ['http', 'https'],
			methods: ['GET', 'POST', 'PUT'],
			paths: ['/auth-server-2/(?<action>.*)'],
			strip_path: false,
			preserve_host: false,
		})
	})

}

module.exports.down = async (kong) => {
	return await kong.removeService('openbank-auth-server')
}