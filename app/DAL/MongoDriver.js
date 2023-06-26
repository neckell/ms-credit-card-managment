const { MongoClient } = require("mongodb");

let _client = null;
const URL =
	process.env.MONGO_URL +
	process.env.MONGO_DB +
	"?retryWrites=true&w=majority";

const connectToClientDB = async function () {
	if (_client !== null) return _client;
	_client = await MongoClient.connect(URL, {
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
