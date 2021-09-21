import { useState } from 'react'
import { Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Home from '../Home/Home'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import Lobby from '../Lobby/Lobby'
import PokerRoom from '../PokerRoom/PokerRoom'

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		background: 'black',
	},
}))

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Route exact path='/' component={Home} />
			<Route path='/register' component={Register} />
			<Route path='/login'>
				<Login setIsLoggedIn={setIsLoggedIn} />
			</Route>
			<Route path='/lobby'>
				<Lobby isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
			</Route>
			<Route path='/rooms/:roomId'>
				<PokerRoom isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
			</Route>
		</div>
	)
}

export default App
