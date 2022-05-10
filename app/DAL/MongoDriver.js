const { MongoClient } = require("mongodb");

let _client = null;
let uri =
	process.env.db_uri ||
	"mongodb+srv://card-managment-test:jR5CYm48XodiRknF@cluster0.pqwkz.mongodb.net/";
let db = process.env.db_collection || "cm_test";

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
