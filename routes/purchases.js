const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoDriver = require("../app/DAL/MongoDriver");

const modelColumns = [
	"item_name",
	"store_name",
	"purchasing_date",
	"total_amount",
	"bank",
	"card",
];
const modelName = "Purchases";

const MakeResponse = (res, httpCode, data) => {
	res.status(httpCode);
	res.send(data);
};

const CatchExit = (res, err) => {
	console.log(err);
	return MakeResponse(res, 404, err);
};

router.get("/", async function (req, res, next) {
	try {
		let client = await mongoDriver.client();
		let data = await client
			.db("cm_test")
			.collection(modelName)
			.find()
			.toArray();

		return MakeResponse(res, 200, data);
	} catch (err) {
		return CatchExit(res, err);
	}
});

router.post("/", async function (req, res, next) {
	try {
		let errors = validateInput(req.body, modelColumns);
		if (errors.length !== 0) throw errors;

		let input = filterInput(req.body, modelColumns);

		let client = await mongoDriver.client();
		let data = await client
			.db("cm_test")
			.collection(modelName)
			.insertOne(input);

		return MakeResponse(res, 201, "Created itemId: " + data.insertedId);
	} catch (err) {
		return CatchExit(res, err);
	}
});

router.delete("/:id", async function (req, res, next) {
	try {
		if (req.params.id === undefined || req.params.id === null)
			throw "Id was undefinded on path param for this URL";

		let client = await mongoDriver.client();
		let data = await client
			.db("cm_test")
			.collection(modelName)
			.deleteOne({ _id: ObjectId(req.params.id) });

		return MakeResponse(res, 204, "Deleted items: " + data.deletedCount);
	} catch (err) {
		return CatchExit(res, err);
	}
});

const validateInput = (data, modelColumns) => {
	let arr = [];
	arr.push(isNotNullOrEmpty(data.item_name, "item_name"));
	arr.push(isNotNullOrEmpty(data.store_name, "store_name"));
	arr.push(isNotNullOrEmpty(data.purchasing_date, "purchasing_date"));
	arr.push(isDate(data.purchasing_date));
	arr.push(isNotNullOrEmpty(data.total_amount, "total_amount"));
	arr.push(isNumber(data.total_amount));
	arr.push(isNotNullOrEmpty(data.bank, "bank"));
	arr.push(isNotNullOrEmpty(data.card, "card"));
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

const isNotNullOrEmpty = (value, field_name) =>
	value !== null && value !== undefined && value !== ""
		? null
		: `The field ${field_name} it's mandatory`;

const isNumber = (value) =>
	typeof value === "number" ? null : `The field ${value} should be a number`;

const isDate = (value) =>
	typeof value === "string" && value.match(/\w{3}\/\d{2}/)
		? null
		: `The field ${value} should be a date like "dic/20"`;

module.exports = router;
