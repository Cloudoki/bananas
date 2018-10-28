const { Client } = require('pg')

class Database {

	constructor(options) {
    
		const client = new Client({
			user: options.user || 'kong',
			password: options.password || 'kong',
			host: options.host,
			database: options.database || 'kong',
			port: options.port || 5432,
		})

		this.client = client
	}

	async insertMigration(migration) {
		throw new Error('Must be implemented')
	}
	async removeMigration(migration) { 
		throw new Error('Must be implemented')
	}
	async getFrom(migration) { 
		throw new Error('Must be implemented')
	}
	async getLatest() { 
		throw new Error('Must be implemented')
	}

}


module.exports = Database
