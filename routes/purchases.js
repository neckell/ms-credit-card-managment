var express = require("express");
var router = express.Router();

/* GET purchases listing. */
router.get("/", function (req, res, next) {
	res.send([
		{
			id: "1",
			state: "Activo",
			store_name: "ArmyTech",
			purchasing_date: "nov/20",
			item_name: "Placa",
			total_amount: 47250,
			bank: "Santander",
			card: "Visa",
		},
		{
			id: "2",
			state: "Activo",
			store_name: "ArmyTech2",
			purchasing_date: "dic/20",
			item_name: "Placa2",
			total_amount: 60000,
			bank: "Santander",
			card: "Visa",
		},
	]);
});

module.exports = router;
