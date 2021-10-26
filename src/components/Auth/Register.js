import { useState } from 'react'
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
	registerContainer: {
		width: 'max(25%, 280px)',
		margin: 'min(10vh, 150px) auto max(5%, 65px)',
		padding: 20,
	},
	registerHeading: {
		margin: 10,
		fontSize: 'max(2vw, 26px)',
	},
	submitButton: {
		margin: '15px 0',
	},
	lockIcon: {
		background: '#3f51b5',
	},
	loginLink: {
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

const Register = () => {
	const [redirect, setRedirect] = useState(false)
	const [usernameError, setUsernameError] = useState(false)

	const classes = useStyles()

	const handleSubmit = (e) => {
		e.preventDefault()

		const data = {
			username: e.target.username.value,
			password: e.target.password.value,
		}

		const url = ENDPOINT + '/api/users/register'

		axios
			.post(url, data)
			.then((res) => setRedirect(true))
			.catch(() => setUsernameError(true))
	}

	if (redirect) return <Redirect to='/login' />

	return (
		<div className={classes.root}>
			{/* ---------- Header ---------- */}
			<Header />

			{/* ---------- Register Form ---------- */}
			<Paper elevation={10} className={classes.registerContainer}>
				<Grid align='center'>
					<Avatar className={classes.lockIcon}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography className={classes.registerHeading} variant='h5'>
						Sign Up!
					</Typography>
				</Grid>
				<form onSubmit={handleSubmit}>
					{usernameError ? (
						<TextField
							id='username'
							label='Username'
							placeholder='Enter username'
							type='text'
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
							Username already exists!
						</FormHelperText>
					)}
					<TextField
						id='password'
						label='Password'
						placeholder='Enter password'
						type='password'
						fullWidth
						required
					/>
					<Button
						className={classes.submitButton}
						type='submit'
						color='primary'
						variant='contained'
						fullWidth>
						Sign Up
					</Button>
				</form>
				<Link to='/login' style={{ textDecoration: 'none' }}>
					<Typography className={classes.loginLink}>
						<span style={{ color: 'black' }}>Already a member?</span> Login
					</Typography>
				</Link>
			</Paper>

			{/* ---------- Footer ---------- */}
			<Footer />
		</div>
	)
}

export default Register
