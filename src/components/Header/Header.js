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
		backgroundColor: '#333333',
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
		background: '#990100',
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
				<Button color='inherit' variant='outlined'>
					Login
				</Button>
				<Button color='primary' variant='contained'>
					Register
				</Button>
			</Toolbar>
		</AppBar>
	)
}

export default Header
