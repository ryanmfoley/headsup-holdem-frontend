import { useState } from 'react'
import { Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from './contexts/AuthContext/AuthContext'
import Home from './components/Home'
import HandRankings from './components/HandRankings'
import Lobby from './components/Lobby'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PokerRoom from './components/PokerRoom/PokerRoom'

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		height: '100vh',
	},
}))

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
				<Route exact path='/' component={Home} />
				<Route path='/lobby' component={Lobby} />
				<Route path='/hand-rankings' component={HandRankings} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='/rooms/:roomId' component={PokerRoom} />
			</AuthContext.Provider>
		</div>
	)
}

export default App
