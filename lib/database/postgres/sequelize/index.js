const Sequelize = require('sequelize')

module.exports = (options) => {

	Sequelize.addHook('afterInit', (sequelize) => {
		sequelize.options.handleDisconnects = false

		sequelize.connectionManager.pool.clear()
		sequelize.connectionManager.pool = null
		sequelize.connectionManager.getConnection = function getConnection() {
			return this._connect(sequelize.config)
		}
		sequelize.connectionManager.releaseConnection = function releaseConnection(connection) {
			return this._disconnect(connection)
		}

	})


	return {
		Types: Sequelize,
		Instance: new Sequelize({
			dialect: 'postgres',
			operatorsAliases: false,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
			...options,
			logging: false,
		}),
	} 
    
}
