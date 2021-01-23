const express = require("express");
const bodyParser = require("body-parser");

// own imports
const placesRoutes = require("./routes/places-routes");

const app = express();

// routing
// placesRoutes is a middleware now and is actually router in the places-routes.js
app.use(placesRoutes);

app.listen(5000);
