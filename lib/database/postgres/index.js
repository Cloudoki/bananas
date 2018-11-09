
/**
 * @returns { Object } -
 */
class PostgresDb {

	/**
	 * 
	 * @param {Object} options -
	 */
	constructor(options) {

		const Migration = require('./models/migration')(options)

		this.Migration = Migration
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } - 
	 */
	async insertMigration(migration) {

		await this.Migration.sync()      
		return await this.Migration.create({file:migration.file})
	}
	
	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } - 
	 */
	async removeMigration(migration) {

		await this.Migration.sync()      
		return await this.Migration.destroy({
			where: {
				file: migration.file,
			},
		})
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } - 
	 */
	async getAll() {
		return await this.Migration.findAll()
	}

	/**
	 * 
	 * @param {Object} migration -
	 * @returns { Void } - 
	 */
	async getLatest() {
		return await this.Migration.findAll({limit: 1, order: [['file','DESC']]})
	}

}

module.exports = PostgresDb
