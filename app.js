const express = require("express");
const bodyParser = require("body-parser");

// own imports
const placesRoutes = require("./routes/places-routes");
const { response } = require("express");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route", 404);
	throw error;
});

// routing
// placesRoutes is a middleware
app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "An unkown error occurred" });
}); // if you use 4 arguments then JS would recanize it as a special function( Error Function)

app.listen(5000);
