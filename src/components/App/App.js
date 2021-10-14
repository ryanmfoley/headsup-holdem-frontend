import { useState } from 'react'
import { Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from '../Auth/AuthContext'
import HandRankings from '../HandRankings/HandRankings'
import Home from '../Home/Home'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import Lobby from '../Lobby/Lobby'
import PokerRoom from '../PokerRoom/PokerRoom'

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
}))

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
				<Route exact path='/'>
					<Home />
				</Route>
				<Route path='/hand-rankings' component={HandRankings} />
				<Route path='/register' component={Register} />
				<Route path='/login'>
					<Login />
				</Route>
				<Route path='/lobby'>
					<Lobby />
				</Route>
				<Route path='/rooms/:roomId'>
					<PokerRoom />
				</Route>
			</AuthContext.Provider>
		</div>
	)
}

export default App
