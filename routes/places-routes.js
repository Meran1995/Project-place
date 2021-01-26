const express = require("express");

const placeControllers = require("../controllers/places-controllers")
const router = express.Router();

router.get("/:pid", placeControllers.getPlaceById);

router.get("/user/:uid", placeControllers.getUserById);

router.post('/', placeControllers.createPlaces);

module.exports = router;
