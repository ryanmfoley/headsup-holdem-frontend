import { useState, useEffect, useRef, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core'

import AuthContext from '../contexts/AuthContext'
import PlayerContext from '../contexts/PlayerContext'
import SocketContext from '../contexts/SocketContext'
import Header from './Header'
import backgroundImage from '../assets/images/lobby-background.png'

const useStyles = makeStyles({
	root: {
		height: '100%',
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
	table: {
		minWidth: '300px',
		width: 'min(40%, 500px)',
		margin: '15vh auto',
		background: 'rgba(0, 0, 0, 0.5)',
		borderRadius: '10px',
	},
	tableHead: {
		background: 'black',
		color: 'white',
		'& th': {
			color: 'white',
			fontFamily: 'GraphiqueProNextComp, Arial',
			fontSize: 'max(2vw, 26px)',
			border: 'none',
		},
	},
	tableBody: {
		color: 'black',
		'& th': {
			height: '5vh',
			color: 'white',
			fontFamily: 'Bangers',
			fontSize: 'clamp(30px, 3.5vw, 38px)',
			border: 'none',
		},
	},
	tableFooter: {
		display: 'flex',
		justifyContent: 'center',
	},
	createGameBtn: {
		width: '100%',
		height: '60px',
		margin: '5px',
		fontSize: 'max(3vw, 24px)',
		position: 'relative',
		zIndex: 0,
		background: '#111',
		color: 'rgb(35, 35, 35)',
		cursor: 'pointer',
		border: 'none',
		transition: '0.25s',
		'&:hover': {
			letterSpacing: '.2vmin',
			textShadow:
				'0 0 .125vmin white, 0 0 .25vmin white, 0 0 .325vmin white, 0 0 .5vmin white, 0 0 .75vmin white, 0 0 .1vmin white, 0 0 .125vmin white, 0 0 .185vmin white',
		},
		'&::before': {
			content: "''",
			background:
				'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
			position: 'absolute',
			top: '-.2vmin',
			left: '-.2vmin',
			backgroundSize: '400%',
			zIndex: '-1',
			filter: 'blur(.5vmin)',
			width: 'calc(100% + 4px)',
			height: 'calc(100% + 4px)',
			animation: '$glowing 20s linear infinite',
			opacity: 0,
			transition: 'opacity .3s ease-in-out',
		},
		'&:active': {
			color: '#000',
		},
		'&:hover::before': {
			opacity: 1,
		},
		'&::after': {
			zIndex: '-1',
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			background:
				'radial-gradient(circle, rgba(196,196,196,1) 0%, rgba(42,42,42,1) 100%)',
			left: 0,
			top: 0,
			borderRadius: '1vmin',
		},
	},
	joinGameBtn: {
		width: '5%',
		padding: 0,
	},
	'@keyframes glowing': {
		'0%': {
			backgroundPosition: '0 0',
		},
		'50%': {
			backgroundPosition: '400% 0',
		},
		'100%': {
			backgroundPosition: '0 0',
		},
	},
})

const Lobby = () => {
	const classes = useStyles()

	const { isLoggedIn } = useContext(AuthContext)
	const { player, setPlayer } = useContext(PlayerContext)
	const { socket } = useContext(SocketContext)

	const playerRef = useRef()

	const [playersWaiting, setPlayersWaiting] = useState([])

	const createGame = () => socket.emit('create-game', playerRef.current)

	const joinGame = (e) =>
		socket.emit('update-players-waiting', e.target.dataset.id)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket.connect()

		const handleEnterLobby = (playerObj) => {
			if (!isMounted) return null

			playerRef.current = playerObj
			setPlayer((player) => ({ ...player, id: playerObj.id }))
		}

		const fetchPlayersWaiting = (players) =>
			isMounted && setPlayersWaiting(players)

		socket.emit('enter-lobby', player.username)

		socket.once('enter-lobby', handleEnterLobby)

		socket.on('players-waiting', fetchPlayersWaiting)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false

			socket.close()
			socket.off()
		}
	}, [socket, player.username, setPlayer])

	if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.root}>
			<Header />
			<TableContainer component={Paper} className={classes.table}>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell>Player</TableCell>
							<TableCell align='right'>Invite</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={classes.tableBody}>
						{playersWaiting.map((player) => (
							<TableRow key={player.id}>
								<TableCell component='th' scope='col'>
									{player.username}
								</TableCell>
								<TableCell component='th' scope='col' align='right'>
									<Link
										to={`/rooms/${player.id}`}
										style={{ textDecoration: 'none' }}>
										<Button
											className={classes.joinGameBtn}
											variant='contained'
											color='primary'
											onClick={joinGame}>
											<span data-id={player.id}>Play</span>
										</Button>
									</Link>
								</TableCell>
							</TableRow>
						))}
						<TableRow>
							<TableCell component='th' />
							<TableCell component='th' />
						</TableRow>
						<TableRow>
							<TableCell component='th' />
							<TableCell component='th' />
						</TableRow>
						<TableRow>
							<TableCell component='th' />
							<TableCell component='th' />
						</TableRow>
					</TableBody>
				</Table>
				<Link to={`/rooms/${player.id}`} style={{ textDecoration: 'none' }}>
					<div className={classes.tableFooter}>
						<button className={classes.createGameBtn} onClick={createGame}>
							CREATE GAME
						</button>
					</div>
				</Link>
			</TableContainer>
		</div>
	)
}

export default Lobby
