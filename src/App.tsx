import { useState } from 'react'
import { Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from './contexts/AuthContext'
import PlayerContext from './contexts/PlayerContext'
import SocketContext, { socket } from './contexts/SocketContext'
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

interface IPlayer {
	id: number | null
	username: string
}

const App = () => {
	const [player, setPlayer] = useState<IPlayer>({
		id: null,
		username: '',
	})
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
				<PlayerContext.Provider value={{ player, setPlayer }}>
					<Route exact path='/' component={Home} />
					<SocketContext.Provider value={socket}>
						<Route path='/lobby' component={Lobby} />
						<Route path='/hand-rankings' component={HandRankings} />
						<Route path='/login' component={Login} />
						<Route path='/register' component={Register} />
						<Route path='/rooms/:roomId' component={PokerRoom} />
					</SocketContext.Provider>
				</PlayerContext.Provider>
			</AuthContext.Provider>
		</div>
	)
}

export default App
