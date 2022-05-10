const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoDriver = require("../app/DAL/MongoDriver");

let db =
	process.env.db_collection || process.env.NODE_ENV === "Production"
		? "cm_stagging"
		: "cm_test";

const modelColumns = {
	item_name: "Nombre de la compra",
	store_name: "Nombre del comercio",
	purchasing_date: "Fecha de compra",
	total_amount: "Precio final",
	bank: "Banco emisor",
	card: "Tarjeta adquirente",
};
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
		let purchases = await client
			.db(db)
			.collection(modelName)
			.find()
			.toArray();

		let total = 0;
		for (var value of Object.values(purchases)) {
			total += value["total_amount"];
		}

		const data = {
			data: purchases,
			total: total,
		};

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
		let data = await client.db(db).collection(modelName).insertOne(input);

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
			.db(db)
			.collection(modelName)
			.deleteOne({ _id: ObjectId(req.params.id) });

		return MakeResponse(res, 204, "Deleted items: " + data.deletedCount);
	} catch (err) {
		return CatchExit(res, err);
	}
});

const validateInput = (data, modelColumns) => {
	let arr = [];
	arr.push(isNotNullOrEmpty(data.item_name, modelColumns["item_name"]));
	arr.push(isNotNullOrEmpty(data.store_name, modelColumns["store_name"]));
	arr.push(
		isNotNullOrEmpty(data.purchasing_date, modelColumns["purchasing_date"])
	);
	arr.push(isDate(data.purchasing_date, modelColumns["purchasing_date"]));
	arr.push(isNotNullOrEmpty(data.total_amount, modelColumns["total_amount"]));
	arr.push(isNumber(data.total_amount, modelColumns["total_amount"]));
	arr.push(isNotNullOrEmpty(data.bank, modelColumns["bank"]));
	arr.push(isNotNullOrEmpty(data.card, modelColumns["card"]));
	arr = arr.filter((e) => e !== null);
	return arr;
};

const filterInput = (data, modelColumns) => {
	let arr = {};
	try {
		Object.keys(modelColumns).forEach((key) => {
			arr[key] = data[key];
		});
	} catch (exception) {
		console.log(exception);
	}
	return arr;
};

const isNotNullOrEmpty = (value, field_name) =>
	value !== null && value !== undefined && value !== ""
		? null
		: `The field '${field_name}' it's mandatory`;

const isNumber = (value, field_name) =>
	typeof value === "number"
		? null
		: `The field '${field_name}' should be a number`;

const isDate = (value, field_name) =>
	typeof value === "string" && value.match(/\w{3}\/\d{2}/)
		? null
		: `The field '${field_name}' should be a date like "dic/20"`;

module.exports = router;
