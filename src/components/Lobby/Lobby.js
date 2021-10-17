import { useState, useEffect, useContext } from 'react'
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
import { io } from 'socket.io-client'

import AuthContext from '../Auth/AuthContext'
import Header from '../Header/Header'
import backgroundImage from '../../assets/images/lobby-background.png'
import ENDPOINT from '../../config/config'

let socket

const useStyles = makeStyles({
	root: {
		height: '100%',
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
	table: {
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
			fontFamily: 'GraphiqueProNextComp',
			fontSize: '2.5vmin',
		},
	},
	tableBody: {
		color: 'black',
		'& th': {
			height: '3vmin',
			color: 'white',
			fontFamily: 'Bangers',
			fontSize: '3.5vmin',
		},
	},
	tableFooter: {
		display: 'flex',
		justifyContent: 'center',
	},
	createGameBtn: {
		width: '100%',
		height: '5.5vw',
		margin: '5px',
		fontSize: '3vw',
		position: 'relative',
		zIndex: 0,
		background: '#111',
		color: '#999',
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
			background: '#111',
			left: 0,
			top: 0,
			borderRadius: '1vmin',
		},
	},
	'@keyframes glowing': {
		'0%': { backgroundPosition: '0 0' },
		'50%': { backgroundPosition: '400% 0' },
		'100%': { backgroundPosition: '0 0' },
	},
})

const Lobby = () => {
	const [player, setPlayer] = useState({})
	const [playersWaiting, setPlayersWaiting] = useState([])

	const { isLoggedIn } = useContext(AuthContext)

	const classes = useStyles()

	const createGame = () => socket.emit('create-game', player)

	const joinGame = (e) =>
		socket.emit('update-players-waiting', e.target.dataset.id)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket = io(ENDPOINT)

		const username = JSON.parse(localStorage.getItem('username'))

		socket.emit('enter-lobby', username)

		socket.once('enter-lobby', (player) => {
			if (!isMounted) return null

			setPlayer(player)
			localStorage.setItem('player', JSON.stringify(player))
		})

		socket.on(
			'players-waiting',
			(players) => isMounted && setPlayersWaiting(players)
		)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.disconnect()
		}
	}, [])

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
								<TableCell component='th' scope='player'>
									{player.username}
								</TableCell>
								<TableCell align='right'>
									<Link
										to={`/rooms/${player.id}`}
										style={{ textDecoration: 'none' }}>
										<Button
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
