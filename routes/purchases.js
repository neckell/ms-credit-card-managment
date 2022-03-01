var express = require("express");
var router = express.Router();

const { MongoClient } = require("mongodb");
const uri =
	"mongodb+srv://card-managment-test:jR5CYm48XodiRknF@cluster0.pqwkz.mongodb.net/cm_test?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function main() {
	try {
		// Connect to the MongoDB cluster
		await client.connect();

		// Make the appropriate DB calls
		await listDatabases(client);
	} catch (e) {
		console.error(e);
	} finally {
		// Close the connection to the MongoDB cluster
		await client.close();
	}
}

main().catch(console.error);

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function listDatabases(client) {
	databasesList = await client.db().admin().listDatabases();

	console.log("Databases:");
	databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

/* GET purchases listing. */
router.get("/", function (req, res, next) {});

router.post("/", function (req, res, next) {
	// console.log(req.body);
	let errors = validateInput(req.body);
	if (errors.length !== 0) {
		res.status(400);
		res.send(errors);
	}

	// const main = async () => {
	client.connect((err) => {
		console.log("asdas");
		const collection = client.db("cm_test").collection("QuotaPurchase");
		collection.insertOne(req.body).then(() => {
			client.close();
		});
	});
	// };
	// main();

	res.status(201);
	res.send("ok");
});

const validateInput = (data) => {
	let arr = [];
	arr.push(isNotNullOrEmpty(data.store_name));
	arr.push(isNotNullOrEmpty(data.purchasing_date));
	arr.push(isDate(data.purchasing_date));
	arr.push(isNotNullOrEmpty(data.item_name));
	arr.push(isNotNullOrEmpty(data.total_amount));
	arr.push(isNumber(data.total_amount));
	arr.push(isNotNullOrEmpty(data.bank));
	arr.push(isNotNullOrEmpty(data.card));
	arr = arr.filter((e) => e !== null);
	return arr;
};

const isNotNullOrEmpty = (value) =>
	value !== null && value !== undefined && value !== ""
		? null
		: `The field ${value} it's mandatory`;

const isNumber = (value) =>
	typeof value === "number" ? null : `The field ${value} should be a number`;

const isDate = (value) =>
	typeof value === "string" && value.match(/\w{3}\/\d{2}/)
		? null
		: `The field ${value} should be a date like "dic/20"`;

module.exports = router;
