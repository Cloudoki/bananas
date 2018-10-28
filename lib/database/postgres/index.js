
class PostgresDb {
	constructor(options) {

		const Migration = require('./models/migration')(options)

		this.Migration = Migration
	}

	async insertMigration(migration) {

		await this.Migration.sync()      
		return await this.Migration.create({file:migration.file})
	}
	async removeMigration(migration) {

		await this.Migration.sync()      
		return await this.Migration.destroy({
			where: {
				file: migration.file,
			},
		})
	}
  
	async getAll() {
		return await this.Migration.findAll()
	}

	async getLatest() {
		return await this.Migration.findAll({limit: 1, order: [['file','DESC']]})
	}

}

module.exports = PostgresDb
