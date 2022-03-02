const { MongoClient, ObjectId } = require("mongodb");

let _client = null;
const uri =
	"mongodb+srv://card-managment-test:jR5CYm48XodiRknF@cluster0.pqwkz.mongodb.net/cm_test?retryWrites=true&w=majority";

connectToClientDB = async function () {
	if (_client !== null) return _client;
	_client = await MongoClient.connect(uri, {
		useNewUrlParser: true,
	}).catch((err) => {
		throw err;
	});
	return _client;
};

const client = async () => {
	try {
		return await connectToClientDB();
	} catch (err) {
		throw err;
	}
};

module.exports.client = client;
