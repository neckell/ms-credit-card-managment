var express = require("express");
const neo4j = require("neo4j-driver");
var router = express.Router();

const driver = neo4j.driver(
	"bolt://3.92.251.249:7687",
	neo4j.auth.basic("neo4j", "gun-fantail-hydraulics"),
	{
		/* encrypted: 'ENCRYPTION_OFF' */
	}
);

/* GET purchases listing. */
router.get("/", function (req, res, next) {
	const query = `
	MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
	RETURN distinct rec.title as title LIMIT 3
	`;

	const params = { favorite: "The Matrix" };

	const session = driver.session({ database: "neo4j" });

	session
		.run(query, params)
		.then((result) => {
			result.records.forEach((record) => {
				console.log(record.get("title"));
			});
			session.close();
			driver.close();
			res.send(result.records);
		})
		.catch((error) => {
			console.error(error);
			res.send([]);
		});

	// res.send([
	// 	{
	// 		id: "1",
	// 		state: "Activo",
	// 		store_name: "ArmyTech",
	// 		purchasing_date: "nov/20",
	// 		item_name: "Placa",
	// 		total_amount: 47250,
	// 		bank: "Santander",
	// 		card: "Visa",
	// 	},
	// 	{
	// 		id: "2",
	// 		state: "Activo",
	// 		store_name: "ArmyTech2",
	// 		purchasing_date: "dic/20",
	// 		item_name: "Placa2",
	// 		total_amount: 60000,
	// 		bank: "Santander",
	// 		card: "Visa",
	// 	},
	// ]);
});

router.post("/", function (req, res, next) {
	console.log(req.body);
	let errors = validateInput(req.body);
	if (errors.length !== 0) {
		res.status(400);
		res.send(errors);
	}
	res.status(201);
	res.send("ok");
	// const query = `
	// MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
	// RETURN distinct rec.title as title LIMIT 3
	// `;

	// const params = { favorite: "The Matrix" };

	// const session = driver.session({ database: "neo4j" });

	// session
	// 	.run(query, params)
	// 	.then((result) => {
	// 		result.records.forEach((record) => {
	// 			console.log(record.get("title"));
	// 		});
	// 		session.close();
	// 		driver.close();
	// 		res.send(result.records);
	// 	})
	// 	.catch((error) => {
	// 		console.error(error);
	// 		res.send([]);
	// 	});
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
