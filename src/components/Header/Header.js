import { useContext, memo } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from '../Auth/AuthContext'
import acesLogo from '../../assets/images/aces-logo.png'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		justifyContent: 'center',
		height: '7vw',
		background: '#333333',
	},
	menuButton: {
		position: 'absolute',
		left: '20px',
	},
	menuIcon: {
		color: 'white',
	},
	brandLogo: {
		width: '7vw',
	},
	title: {
		margin: '0 2vw',
		fontFamily: 'AmazinglyBeautiful',
		fontSize: '3vw',
		color: 'white',
	},
	mobileViewTitle: {
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		margin: '0 2vw',
		fontFamily: 'AmazinglyBeautiful',
		fontSize: '4vw',
		color: 'white',
	},
	navLinksContainer: {
		marginLeft: '0 1vw',
	},
	navLink: {
		minWidth: '3vw',
		margin: '0 1vw',
		padding: 0,
		color: 'white',
		fontSize: 'max(1.5vw, 8px)',
	},
	authButtons: {
		position: 'absolute',
		top: '50%',
		right: '1vw',
		transform: 'translateY(-50%)',
	},
	loginBtn: {
		minWidth: '6vw',
		marginRight: '1vw',
		color: 'white',
		fontSize: '1.3vw',
		border: '1px solid white',
	},
	logoutBtn: {
		margin: 0,
		color: 'white',
		border: '1px solid white',
	},
	registerBtn: {
		minWidth: '6vw',
		margin: 0,
		fontSize: '1.3vw',
	},
})

const Header = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

	const classes = useStyles()

	return (
		<AppBar className={classes.root} color='default' position='static'>
			<Toolbar variant='dense'>
				{/* ---------- Brand Logo and Title ---------- */}
				<img
					src={acesLogo}
					className={classes.brandLogo}
					alt='poker chips icon'
				/>

				<h1 className={classes.title}>Heads-Up Hold'em</h1>

				{/* ---------- Nav Links ---------- */}
				<Box
					className={classes.navLinksContainer}
					display='flex'
					justifyContent='center'
					alignItems='center'>
					<Link to='/' style={{ textDecoration: 'none' }}>
						<Button className={classes.navLink} color='secondary' size='small'>
							Home
						</Button>
					</Link>
					<Link to='/lobby' style={{ textDecoration: 'none' }}>
						<Button className={classes.navLink} color='secondary' size='small'>
							Lobby
						</Button>
					</Link>
				</Box>

				{/* ---------- Authorization Buttons ---------- */}
				<Box className={classes.authButtons}>
					{isLoggedIn ? (
						<Button
							className={classes.logoutBtn}
							size='small'
							onClick={() => setIsLoggedIn(false)}>
							Logout
						</Button>
					) : (
						<>
							<Link to='/login' style={{ textDecoration: 'none' }}>
								<Button className={classes.loginBtn} size='small'>
									Login
								</Button>
							</Link>
							<Link to='/register' style={{ textDecoration: 'none' }}>
								<Button
									className={classes.registerBtn}
									variant='contained'
									color='primary'
									size='small'>
									Register
								</Button>
							</Link>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default memo(Header)
