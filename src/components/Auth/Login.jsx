import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
	Avatar,
	Button,
	FormHelperText,
	Grid,
	Paper,
	TextField,
	Typography,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import ENDPOINT from '../../config/config'

const useStyles = makeStyles((theme) => ({
	loginContainer: {
		height: '100vh',
		margin: 'auto',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	loginHeading: {
		margin: 10,
		outline: '1px solid red',
	},
	submitButton: {
		margin: '15px 0',
	},
	paperStyle: {
		width: 280,
		marginTop: 60,
		padding: 20,
	},
	avatarStyle: { backgroundColor: 'green' },
}))

const Login = ({ setIsLoggedIn }) => {
	const [redirect, setRedirect] = useState(false)
	const [usernameError, setUsernameError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)

	const classes = useStyles()

	const handleSubmit = (e) => {
		e.preventDefault()

		const data = {
			username: e.target.username.value,
			password: e.target.password.value,
		}

		const url = ENDPOINT + '/api/users/login'

		axios
			.post(url, data)
			.then((res) => {
				// Get token //
				const { token } = res.data

				if (token) {
					// Store username to localStorage //
					localStorage.setItem('username', JSON.stringify(data.username))

					// Set token to localStorage //
					localStorage.setItem('jwtToken', token)

					// Set token to Auth header //
					axios.defaults.headers.common['Authorizatioin'] = token
					setIsLoggedIn(true)
					setRedirect(true)
				} else {
					// Delete Auth header //
					delete axios.defaults.headers.common['Authorization']
				}
			})
			.catch((err) => {
				const { userNotFound, invalidPassword } = err.response.data

				if (userNotFound) return setUsernameError(true)
				if (invalidPassword) return setPasswordError(true)
			})
	}

	if (redirect) {
		return <Redirect to='/lobby' />
	}

	return (
		<div className={classes.loginContainer}>
			<Paper elevation={10} className={classes.paperStyle}>
				<Grid align='center'>
					<Avatar color='secondary'>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant='h5'>Login</Typography>
				</Grid>
				<form onSubmit={handleSubmit}>
					{usernameError ? (
						<TextField
							id='username'
							label='Username'
							placeholder='Enter username'
							fullWidth
							required
							error
						/>
					) : (
						<TextField
							id='username'
							label='Username'
							placeholder='Enter username'
							fullWidth
							required
						/>
					)}
					{usernameError && (
						<FormHelperText error id='username-error'>
							Username not found!
						</FormHelperText>
					)}
					{passwordError ? (
						<TextField
							id='password'
							type='password'
							label='Password'
							placeholder='Enter password'
							fullWidth
							required
							error
						/>
					) : (
						<TextField
							id='password'
							type='password'
							label='Password'
							placeholder='Enter password'
							fullWidth
							required
						/>
					)}
					{passwordError && (
						<FormHelperText error id='username-error'>
							Password is incorrect!
						</FormHelperText>
					)}
					<Button
						className={classes.submitButton}
						type='submit'
						color='primary'
						variant='contained'
						fullWidth>
						Log In
					</Button>
				</form>
				<Typography style={{ textAlign: 'center' }}>
					New? <Link to='/register'>Sign up - it's FREE!</Link>
				</Typography>
			</Paper>
		</div>
	)
}

export default Login
