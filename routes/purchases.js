const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const uri =
	"mongodb+srv://card-managment-test:jR5CYm48XodiRknF@cluster0.pqwkz.mongodb.net/cm_test?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const modelColumns = [
	"state",
	"store_name",
	"purchasing_date",
	"item_name",
	"total_amount",
	"bank",
	"card",
];
const modelName = "Purchases";

router.get("/", function (req, res, next) {
	let response = { records: [] };
	client.connect((err) => {
		const collection = client.db("cm_test").collection(modelName);
		const cursor = collection.find();
		cursor.forEach((item) => {
			response["records"].push(item);
		});
	});

	res.status(200);
	res.send(response);
});

router.post("/", function (req, res, next) {
	let errors = validateInput(req.body);
	if (errors.length !== 0) {
		res.status(400);
		res.send(errors);
	}
	let input = filterInput(req.body, modelColumns);

	client.connect((err) => {
		const collection = client.db("cm_test").collection(modelName);
		collection.insertOne(input).then((a) => {});
	});

	res.status(201);
	res.send("ok created");
});

router.delete("/:id", function (req, res, next) {
	if (req.params.id === undefined || req.params.id === null) {
		res.status(400);
		res.send("Id was undefinded on path param for this URL");
	}
	client.connect((err) => {
		const collection = client.db("cm_test").collection(modelName);

		collection.deleteOne({ _id: ObjectId(req.params.id) }).then((e) => {
			console.log(e);
		});
	});

	res.status(204);
	res.send("ok deleted");
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

const filterInput = (data, modelColumns) => {
	let arr = {};
	try {
		modelColumns.map((column) => {
			arr[column] = data[column];
		});
	} catch (exception) {
		console.log(exception);
	}
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
