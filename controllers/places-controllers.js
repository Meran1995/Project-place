const uuid = require("uuid");

const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;

	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	}); // { pid: "p1"}

	if (!place) {
		throw new HttpError("Could not find place for the provided id", 404);
	}

	res.json({ place }); // => {place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;

	const places = DUMMY_PLACES.filter((p) => {
		return p.creator === userId;
	}); // { uid: "u1"}

	if (!places || places.length === 0) {
		return next(
			new HttpError("Could not find places for the provided user id", 404)
		);
	}

	res.json({ places }); // => {place } => { place: place }
};

const createPlaces = (req, res, next) => {
	const { title, description, coordinates, address, creator } = req.body;
	// const title = req.body.title; long version above the short version

	const createdPlace = {
		id: uuid(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};

	DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

	res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
	const { title, description } = req.body;
	const placeId = req.params.pid;

	const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatedPlace.title = title;
	updatedPlace.description = description;

	DUMMY_PLACES[placeIndex] = updatedPlace;

	res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
	const placeId = req.params.pid;
	DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

	res.status(200).json({message: "Deleted place!"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
