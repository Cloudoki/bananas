module.exports = {
	'database': {
		'type': 'pg',
		options: {
			'host': process.env.KONG_PG_HOST || 'localhost',
			'port': 5435,
			'database': 'kong',
			'username': process.env.KONG_PG_USER || 'kong',
			'password': process.env.KONG_PG_PWD || 'kong',
		},
	},
	'options' : {
		kongAdminUrl: 'http://localhost:7001',
	},
}
