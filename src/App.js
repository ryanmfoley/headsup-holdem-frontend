import { useState } from 'react'
import { Route } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Lobby from './components/Lobby/Lobby'
import PokerRoom from './components/PokerRoom/PokerRoom'

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		background: 'pink',
	},
}))

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Grid container direction='column'>
				<Grid item>
					<Header />
				</Grid>
				<Grid item container>
					<Route exact path='/' component={Home} />
					<Route path='/register' component={Register} />
					<Route path='/login'>
						<Login setIsLoggedIn={setIsLoggedIn} />
					</Route>
					<Route path='/lobby'>
						<Lobby isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
					</Route>
					<Route
						path='/poker-room/:id'
						render={(routerProps) => (
							<PokerRoom
								match={routerProps.match}
								isLoggedIn={isLoggedIn}
								setIsLoggedIn={setIsLoggedIn}
							/>
						)}
					/>
				</Grid>
			</Grid>
		</div>
	)
}

export default App
