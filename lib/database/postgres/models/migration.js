const Sequelize = require('../sequelize')

module.exports = (options) => {
  
	const sequelize = Sequelize(options)

	const Migration = sequelize.Instance.define('kong_entity_migrations',{
		file: {
			type: sequelize.Types.STRING,
			unique: true,
		},
	})

	return Migration
}
