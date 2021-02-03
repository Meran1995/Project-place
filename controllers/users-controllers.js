const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
	{
		Id: "u1",
		name: "Meran Nezar Hussein",
		email: "test@meran.com",
		password: "tester",
	},
];

const getUsers = (req, res, next) => {
	res.json({ users: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("invalid inputs passed, please check your data", 422)
		);
	}

	const { name, email, password, places} = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later",
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exist already, please login instead",
			422
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password,
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		places,
	});

	try {
		await createdPlace.save();
	} catch (err) {
		const error = new HttpError("Signing up failed, please try again", 500);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again later",
			500
		);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			401
		);
		return next(error);
	}

	res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
