const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());

function readDatabase() {
	const data = fs.readFileSync("./db.json", "utf8");
	return data ? JSON.parse(data) : [];
}
function writeDatabase(data) {
	let currentList = readDatabase();
	currentList.push(data);
	fs.writeFileSync("./db.json", JSON.stringify(currentList, null, 2), {
		encoding: "utf8",
		flag: "w",
	});
}

// Utility Functions
const fibonacci = (number, data = {}) => {
	if (number in data) return data[number];
	if (number === 0) return 0;
	if (number <= 2) return 1;
	return (data[number] = fibonacci(number - 1, data) + fibonacci(number - 2, data));
};

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

// Middleware for validation
const validateNumber = (req, res, next) => {
	const number = Number(req.params.number);
	if (isNaN(number)) return res.status(400).send("Invalid number");
	if (number === 123) return res.status(418).send("I am a teapot");
	if (number > 20) return res.status(400).send("Number can't be bigger than 20");
	if (number < 1) return res.status(400).send("Number can't be smaller than 1");
	req.number = number;
	next();
};

// Routes
app.get("/calculate/:number", validateNumber, async (req, res) => {
	await wait(600);
	const result = fibonacci(req.number);
	const obj = { number: req.number, result, createdDate: Date.now() };

	try {
		writeDatabase(obj);
		res.json(obj);
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.get("/results", async (req, res) => {
	await wait(600);
	try {
		const data = readDatabase();
		res.json({ results: data });
	} catch (err) {
		return res.status(500).send(err);
	}
});


// Start server
app.listen(3000, () => {
	console.log(`App listening on port 3000`);
	console.log("Press Ctrl+C to quit.");
});
