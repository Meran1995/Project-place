const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most famous sky scrapers in the world!",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		address: "20 W 34th St, New York, NY 10001",
		location: {
			lat: 40.7484405,
			lng: -73.9878584,
		},
		creator: "u1",
	},
	{
		id: "p2",
		title: "France - Eiffel Tower",
		description: "One of the most famous building in Paris",
		imageUrl:
			"https://demodernenomaden.nl/wp-content/uploads/2018/11/wonen-en-werken-in-parijs-e1541539684522.jpg",
		address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
		location: {
			lat: 48.858093,
			lng: 2.294694,
		},
		creator: "u2",
	},
];

router.get("/:pid", (req, res, next) => {
	const placeId = req.params.pid;

	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	}); // { pid: "p1"}

	if (!place) {
		throw new HttpError("Could not find place for the provided id", 404);
	}

	res.json({ place }); // => {place } => { place: place }
});

router.get("/user/:uid", (req, res, next) => {
	const userId = req.params.uid;

	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	}); // { uid: "u1"}

	if (!place) {
		return next(
			new HttpError("Could not find place for the provided user id", 404)
		);
	}

	res.json({ place }); // => {place } => { place: place }
});

module.exports = router;
