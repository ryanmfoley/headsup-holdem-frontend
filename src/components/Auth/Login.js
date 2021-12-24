import { useState, useContext } from 'react'
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

import AuthContext from '../../contexts/AuthContext'
import PlayerContext from '../../contexts/PlayerContext'
import Footer from '../Footer'
import Header from '../Header'
import ENDPOINT from '../../config/config'
import backgroundImage from '../../assets/images/lobby-background.png'

const useStyles = makeStyles({
	root: {
		height: '100%',
		margin: 'auto',
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
	},
	loginContainer: {
		width: 'max(25%, 280px)',
		margin: 'min(10vh, 150px) auto max(5%, 65px)',
		padding: 20,
	},
	loginHeading: {
		margin: 10,
		fontSize: 'max(2vw, 26px)',
	},
	submitButton: {
		margin: '15px 0',
	},
	lockIcon: {
		background: '#3f51b5',
	},
	registerLink: {
		textAlign: 'center',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	'@media screen and (max-height: 620px)': {
		root: {
			height: 'auto', // allows background to cover screen //
		},
	},
})

const Login = () => {
	const classes = useStyles()

	const { setIsLoggedIn } = useContext(AuthContext)
	const { setPlayer } = useContext(PlayerContext)

	const [redirect, setRedirect] = useState(false)
	const [usernameError, setUsernameError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)

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
					// Set token to localStorage //
					localStorage.setItem('jwtToken', token)

					const username = data.username.trim().slice(0, 8)

					setPlayer({ username })
					setIsLoggedIn(true)
					setRedirect(true)
				}
			})
			.catch((err) => {
				const { userNotFound, invalidPassword } = err.response.data

				if (userNotFound) return setUsernameError(true)
				if (invalidPassword) return setPasswordError(true)
			})
	}

	if (redirect) return <Redirect to='/lobby' />

	return (
		<div className={classes.root}>
			{/* ---------- Header ---------- */}
			<Header />

			{/* ---------- Login Form ---------- */}
			<Paper elevation={10} className={classes.loginContainer}>
				<Grid align='center'>
					<Avatar className={classes.lockIcon}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography className={classes.loginHeading} variant='h5'>
						Login
					</Typography>
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
				<Link to='/register' style={{ textDecoration: 'none' }}>
					<Typography className={classes.registerLink}>
						<span style={{ color: 'black' }}>New?</span> Sign up - it's FREE!
					</Typography>
				</Link>
			</Paper>

			{/* ---------- Footer ---------- */}
			<Footer />
		</div>
	)
}

export default Login
