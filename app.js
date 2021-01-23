const express = require("express");
const bodyParser = require("body-parser");

// own imports
const placesRoutes = require("./routes/places-routes");

const app = express();

// routing
// placesRoutes is a middleware
app.use("/api/places", placesRoutes);

app.listen(5000);
