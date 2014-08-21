var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	port = 8080;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// GET: characters
// list of adventure time characters
app.get("/api/characters",	function (request, response) {
	var data = [
		{
			firstName: "Finn",
			lastName: "The Human",
			age: 14	
		},
		{
			firstName: "Jake",
			lastName: "The Dog",
			age: 28
		},
		{
			firstName: "Princess",
			lastName: "Bubblegum",
			age: 827
		},
		{
			firstName: "Marceline",
			lastName: "Abadeer",
			age: 1004
		}
	];

	response.send(data);
});

app.listen(port);

console.log("app listening on port: " + port);
