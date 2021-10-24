import { useState, useContext, memo } from 'react'
import { Link } from 'react-router-dom'
import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AddToQueueIcon from '@material-ui/icons/AddToQueue'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import HomeIcon from '@material-ui/icons/Home'
import loginIcon from '../assets/icons/login-icon.svg'
import logoutIcon from '../assets/icons/logout-icon.svg'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from '../contexts/AuthContext/AuthContext'
import acesLogo from '../assets/images/aces-logo.png'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		height: '7vw',
		background: '#333333',
	},
	menuButton: {
		marginLeft: 'auto',
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
	mobileNavLinksContainer: {
		background: '#333333',
	},
	mobileNavLink: {
		color: 'white',
	},
	navLinksContainer: { marginLeft: '0 1vw' },
	navLink: {
		minWidth: '3vw',
		margin: '0 1vw',
		padding: 0,
		color: 'white',
		fontSize: '1.4vw',
		'&:hover, &:focus': {
			transform: 'rotate(-5deg)',
			transformOrigin: 'bottom left',
		},
	},
	paper: { background: 'red' },
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
		'&:hover, &:focus': {
			background: 'rgba(255, 255, 255, 0.1)',
		},
	},
	logoutBtn: {
		margin: 0,
		color: 'white',
		'--hover': '#66c887',
		background: 'inherit',
		transition: '0.25s linear',
		border: '1px solid white',
		'&:hover, &:focus': {
			color: 'black',
			boxShadow: 'inset 6.5em 0 0 0 white',
		},
	},
	registerBtn: {
		minWidth: '6vw',
		margin: 0,
		fontSize: '1.3vw',
	},
	divider: { background: 'white' },
	'@media screen and (min-width: 768px)': {
		mobileHeader: {
			display: 'none',
		},
	},
	'@media screen and (max-width: 767px)': {
		desktopHeader: {
			display: 'none',
		},
		title: { fontSize: '5vw' },
	},
})

const Header = ({ window }) => {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

	const [drawerOpen, setDrawerOpen] = useState(false)

	const classes = useStyles()

	const handleDrawerToggle = () => setDrawerOpen(!drawerOpen)

	const logout = () => setIsLoggedIn(false)

	const drawer = (
		<List className={classes.mobileNavLinksContainer}>
			<Link to='/' style={{ textDecoration: 'none' }}>
				<ListItem button>
					<ListItemIcon>
						<HomeIcon style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary={'Home'} className={classes.mobileNavLink} />
				</ListItem>
			</Link>
			<Link to='/lobby' style={{ textDecoration: 'none' }}>
				<ListItem button>
					<ListItemIcon>
						<AddToQueueIcon style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary={'Lobby'} className={classes.mobileNavLink} />
				</ListItem>
			</Link>
			<Link to='/hand-rankings' style={{ textDecoration: 'none' }}>
				<ListItem button>
					<ListItemIcon>
						<FormatListNumberedIcon style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText
						primary={'Hand Rankings'}
						className={classes.mobileNavLink}
					/>
				</ListItem>
			</Link>
			<Divider className={classes.divider} />
			{isLoggedIn ? (
				<ListItem button onClick={logout}>
					<ListItemIcon>
						<img src={logoutIcon} alt='logout icon' />
					</ListItemIcon>
					<ListItemText primary={'Logout'} className={classes.mobileNavLink} />
				</ListItem>
			) : (
				<>
					<Link to='/login' style={{ textDecoration: 'none' }}>
						<ListItem button>
							<ListItemIcon>
								<img src={loginIcon} alt='login icon' />
							</ListItemIcon>
							<ListItemText
								primary={'Login'}
								className={classes.mobileNavLink}
							/>
						</ListItem>
					</Link>
					<Link to='/' style={{ textDecoration: 'none' }}>
						<ListItem button>
							<ListItemIcon>
								<AccountCircleIcon style={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText
								primary={'Register'}
								className={classes.mobileNavLink}
							/>
						</ListItem>
					</Link>
				</>
			)}
		</List>
	)

	const container =
		window !== undefined ? () => window().document.body : undefined

	return (
		<>
			<AppBar className={classes.root} color='default' position='static'>
				{/* ---------- Large Screens  ---------- */}
				<Toolbar className={classes.desktopHeader} variant='dense'>
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
							<Button
								className={classes.navLink}
								color='secondary'
								size='small'>
								Home
							</Button>
						</Link>
						<Link to='/lobby' style={{ textDecoration: 'none' }}>
							<Button
								className={classes.navLink}
								color='secondary'
								size='small'>
								Lobby
							</Button>
						</Link>
						<Link to='/hand-rankings' style={{ textDecoration: 'none' }}>
							<Button
								className={classes.navLink}
								color='secondary'
								size='small'>
								Hand Rankings
							</Button>
						</Link>
					</Box>

					{/* ---------- Authorization Buttons ---------- */}
					<div className={classes.authButtons}>
						{isLoggedIn ? (
							<Button
								className={classes.logoutBtn}
								size='small'
								onClick={logout}>
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
					</div>
				</Toolbar>

				{/* ---------- Small Screens ---------- */}
				<Toolbar className={classes.mobileHeader} variant='dense'>
					{/* ---------- Brand Logo and Title ---------- */}
					<img
						src={acesLogo}
						className={classes.brandLogo}
						alt='poker chips icon'
					/>

					<h1 className={classes.title}>Heads-Up Hold'em</h1>

					<IconButton
						className={classes.menuButton}
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* ---------- Drawer ---------- */}
			<Box
				component='nav'
				sx={{ flexShrink: { sm: 0 } }}
				aria-label='mailbox folders'>
				<Drawer
					container={container}
					variant='temporary'
					anchor='top'
					open={drawerOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
						},
					}}>
					{drawer}
				</Drawer>
			</Box>
		</>
	)
}

export default memo(Header)
