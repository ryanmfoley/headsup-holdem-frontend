import { Link } from 'react-router-dom'
import {
	AppBar,
	Button,
	IconButton,
	Toolbar,
	Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'

import pokerIcon from '../../assets/images/poker-chips.png'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		background: '#333333',
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		margin: '0 15px',
		fontFamily: 'Comfortaa, cursive',
		fontWeight: 700,
	},
	loginButton: {
		color: 'white',
		border: '1px solid white',
	},
}))

const Header = () => {
	const classes = useStyles()

	return (
		<AppBar position='static' className={classes.root}>
			<Toolbar>
				<IconButton
					edge='start'
					className={classes.menuButton}
					color='inherit'
					aria-label='menu'>
					<MenuIcon />
				</IconButton>
				<img src={pokerIcon} alt='poker chips icon' style={{ width: '50px' }} />
				<Typography variant='h6' className={classes.title}>
					HU HOLD'EM
				</Typography>
				<Link to='/login' style={{ textDecoration: 'none' }}>
					<Button variant='outlined' className={classes.loginButton}>
						Login
					</Button>
				</Link>
				<Link to='/register' style={{ textDecoration: 'none' }}>
					<Button
						color='primary'
						variant='contained'
						style={{ marginLeft: 10 }}>
						Register
					</Button>
				</Link>
			</Toolbar>
		</AppBar>
	)
}

export default Header
