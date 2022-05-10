const { MongoClient } = require("mongodb");

let _client = null;
let uri = process.env.db_uri;
let db = process.env.db_collection;

const url = uri + db + "?retryWrites=true&w=majority";

const connectToClientDB = async function () {
	if (_client !== null) return _client;
	_client = await MongoClient.connect(url, {
		useNewUrlParser: true,
	}).catch((err) => {
		throw err;
	});
	return _client;
};

const client = function () {
	try {
		return connectToClientDB();
	} catch (err) {
		throw err;
	}
};

module.exports.client = client;
