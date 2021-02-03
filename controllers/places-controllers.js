const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
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

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Somthing went wrong, could not find a place.",
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			"Could not find place for the provided id",
			404
		);
		return next(error);
	}

	res.json({ place: place.toObject({ getters: true }) }); // => {place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;

	try {
		const places = Place.find({ creator: userId });
	} catch (err) {
		const error = new HttpError(
			"Fetching places failed, please try again later",
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError("Could not find places for the provided user id", 404)
		);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	}); // => {place } => { place: place }
};

const createPlaces = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("invalid inputs passed, please check your data", 422)
		);
	}

	const { title, description, address, creator } = req.body;
	// const title = req.body.title; long version above the short version
	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		creator,
	});

	try {
		await createdPlace.save(); //save would handel every mongoDB-code new code to the database...
	} catch (err) {
		const error = new HttpError("Creating place failed, please try again", 500);
		return next(error); // stop our execution
	}

	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError("Invalid inputs passed, please check your data", 422);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Somthing went wrong, could not update place.",
			500
		);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update place",
			500
		);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Somthing went wrong, could not delete place.",
			500
		);
		return next(error);
	}

	try {
		await place.remove()
	} catch (err) {
		const error = new HttpError(
			"Somthing went wrong, could not delete place.",
			500
		);
		return next(error);
	}
	res.status(200).json({ message: "Deleted place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
