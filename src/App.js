import { useState } from 'react'
import { Route } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Register from './components/Auth/Register'

const useStyles = makeStyles((theme) => ({
	root: {
		border: '2px solid pink',
		background: 'pink',
	},
	container: {
		border: '2px solid black',
	},
	header: {
		width: '100%',
		border: '2px solid red',
	},
	content: {
		border: '2px solid blue',
	},
}))

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Grid container direction='column'>
				<Grid item>
					<Header />
				</Grid>
				<Grid item container>
					<Route path='/home' component={Home} />
					<Route path='/register' component={Register} />
				</Grid>
			</Grid>
		</div>
	)
}

export default App
