import { useState, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
	Avatar,
	Button,
	FormHelperText,
	Grid,
	Paper,
	Slide,
	Snackbar,
	TextField,
	Typography,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import AuthContext from '../../contexts/AuthContext'
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
	accountCreatedAlert: {
		background: 'white',
		color: 'black',
	},
	'@media screen and (max-height: 620px)': {
		root: {
			height: 'auto', // allows background to cover screen //
		},
	},
})

const TransitionDown = (props) => <Slide {...props} direction='down' />

const Register = () => {
	const classes = useStyles()

	const { setIsLoggedIn } = useContext(AuthContext)

	const [openAlert, setOpenAlert] = useState(false)
	const [redirect, setRedirect] = useState(false)
	const [usernameError, setUsernameError] = useState(false)

	const handleClose = () => setOpenAlert(false)

	const handleSubmit = (e) => {
		e.preventDefault()

		const data = {
			username: e.target.username.value,
			password: e.target.password.value,
		}

		const url = ENDPOINT + '/api/users/register'

		axios
			.post(url, data)
			.then((res) => {
				setOpenAlert(true)

				// Store username to localStorage //
				const username = data.username.trim().slice(0, 8)
				localStorage.setItem('username', JSON.stringify(username))

				setIsLoggedIn(true)
				setTimeout(() => setRedirect(true), 1000)
			})
			.catch(() => setUsernameError(true))
	}

	if (redirect) return <Redirect to='/lobby' />

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

			{/* ---------- Account Created Alert ---------- */}
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={openAlert}
				TransitionComponent={TransitionDown}>
				<Alert onClose={handleClose} severity='success'>
					Account created!
				</Alert>
			</Snackbar>
		</div>
	)
}

export default Register
