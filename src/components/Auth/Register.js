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

import Header from '../Header/Header'
import ENDPOINT from '../../config/config'

const useStyles = makeStyles({
	root: {
		height: '100vh',
		margin: 'auto',
	},
	registerHeading: {
		margin: 10,
		outline: '1px solid red',
	},
	submitButton: {
		margin: '15px 0',
	},
	paperStyle: {
		width: 280,
		margin: '100px auto',
		padding: 20,
	},
	lockIcon: {
		background: '#3f51b5',
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

	if (redirect) {
		return <Redirect to='/home' />
	}

	return (
		<div className={classes.root}>
			<Header />
			<Paper elevation={10} className={classes.paperStyle}>
				<Grid align='center'>
					<Avatar className={classes.lockIcon}>
						<LockOutlinedIcon color='default' />
					</Avatar>
					<Typography variant='h5'>Sign Up!</Typography>
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
				<Typography style={{ textAlign: 'center' }}>
					Already a member? <Link to='/login'>Login</Link>
				</Typography>
			</Paper>
		</div>
	)
}

export default Register
