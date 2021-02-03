const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// own imports
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// routing
// placesRoutes is a middleware
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route", 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "An unkown error occurred" });
}); // if you use 4 arguments then JS would recanize it as a special function( Error Function)

//connect the Database with the Back-End
mongoose
	.connect(
		"mongodb+srv://Meran:1971Mn-mN@cluster0.0edo8.mongodb.net/places?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		app.listen(5000);
		console.log("Connected!!");
	})
	.catch((err) => {
		console.log(err);
		console.log("There is an Error!!");
	});
