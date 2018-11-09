const { Client } = require('pg')

/**
 *@returns { Object } - 
 */
class Database {

	/**
	 * 
	 * @param {Object} options -
	 */
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

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } -
	 */
	async insertMigration(migration) {
		throw new Error('Must be implemented')
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } -
	 */
	async removeMigration(migration) { 
		throw new Error('Must be implemented')
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } -
	 */
	async getFrom(migration) { 
		throw new Error('Must be implemented')
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } -
	 */
	async getLatest() { 
		throw new Error('Must be implemented')
	}

}


module.exports = Database
