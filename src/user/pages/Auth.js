import React, { useState } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";

const Auth = () => {
	const [isLogin, setIsLogin] = useState();
	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const switchModeHandler = () => {
		if (!isLogin) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData({
				...formState.inputs,
				name: {
					value: "",
					isValid: false,
				},
			});
		}
		setIsLogin((prevMode) => !prevMode);
	};

	const authSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
	};

	return (
		<Card className='authentication'>
			<form>Login Required</form>
			<hr />
			<form onSubmit={authSubmitHandler}>
				{!isLogin && (
					<Input
						element='input'
						id='name'
						type='text'
						label='YourName'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a name.'
						onInput={inputHandler}
					/>
				)}
				<Input
					element='input'
					id='email'
					type='email'
					label='E-Mail'
					validators={[VALIDATOR_EMAIL()]}
					errorText='Please enter a valid email address.'
					onInput={inputHandler}
				/>
				<Input
					element='input'
					id='password'
					type='password'
					label='Password'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid password (the password needs to be more then 5 charactors).'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					{isLogin ? "LOGIN" : "SIGNUP"}
				</Button>
			</form>
			<Button inverse onClick={switchModeHandler}>
				SignUp! {isLogin ? "SIGNUP" : "LOGIN"}
			</Button>
		</Card>
	);
};

export default Auth;
