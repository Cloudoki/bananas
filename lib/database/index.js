const cassandra = require('./cassandra')
const pg = require('./postgres')

const database = {
	pg,
	cassandra,
}

exports = module.exports = { }

exports.db = (type) => {
	return database[type]
}
