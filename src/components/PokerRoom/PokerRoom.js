import { useState, useEffect } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import BettingOptions from './BettingOptions'
import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'
import PlayersHud from './PlayersHud'
import socket from '../../config/socketConfig'

const useStyles = makeStyles({
	cardRoomContainer: {
		width: '100vw',
		height: '100vh',
		background: '#4327ac',
	},
	table: {
		position: 'relative',
		display: 'flex',
		background: '#193024',
		width: 700,
		height: 350,
		margin: '100px auto',
		border: '2px solid gray',
		// borderRadius: '50%',
		// borderRadius: '60%',
		borderRadius: '30% / 60%',
		boxShadow: '0 0 10px #9ecaed',
	},
	waitingDisplay: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '550px',
		transform: 'translate(-50%, -50%)',
		borderRadius: '10px',
	},
	waitingText: {
		margin: 'auto',
		padding: '10px',
		fontSize: '38px',
		textAlign: 'center',
		'&:after': {
			overflow: 'hidden',
			display: 'inline-block',
			width: '0px',
			verticalAlign: 'bottom',
			animation: '$loading-ellipsis steps(4, end) 3s infinite',
			content: "'...'",
		},
	},
	playersHudContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		width: '30%',
		margin: 'auto',
	},
	top: {
		top: '-30%',
	},
	bottom: {
		bottom: '-45%',
	},
	'@keyframes loading-ellipsis': {
		to: {
			width: '1em',
		},
	},
})

const PokerRoom = ({ isLoggedIn, setIsLoggedIn }) => {
	////////////// TURN REDIRECT BACK ON //////////////
	const classes = useStyles()
	const { roomId } = useParams()
	const [startGame, setStartGame] = useState(false)
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [isTurn, setIsTurn] = useState(false)
	const [holeCards, setHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])
	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState(0)
	const [bet, setBet] = useState(false)

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		const isPlayerOne = currentPlayer.id === roomId

		// Join socket to given room //
		socket.emit('enterPokerRoom', roomId, currentPlayer)

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.on('getPlayersInfo', ({ username }) => {
			if (!isSubscribed) return null

			currentPlayer.username === username
				? setPlayersName(username)
				: setOpponentsName(username)

			setStartGame(true)
			setIsTurn(isPlayerOne)

			if (isPlayerOne && currentPlayer.username !== username)
				socket.emit('deal') // playerOne emits deal to server //
		})

		socket.on(
			'deal',
			(playerOneHoleCards, playerTwoHoleCards, communityCards) => {
				if (!isSubscribed) return null

				setHoleCards(
					currentPlayer.id === roomId ? playerOneHoleCards : playerTwoHoleCards
				)
				setCommunityCards(communityCards)
			}
		)

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [roomId])

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		socket.on('action', (action, bet) => {
			// add bet to pot here
			setBet(action === 'bet' ? bet : 0)
			setPot(bet + pot)
			setIsTurn(!isTurn)
		})

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [isTurn, pot])

	// useEffect(() => {
	// 	window.addEventListener('beforeunload', () => socket.emit('logout'))
	// }, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.cardRoomContainer}>
			<Link to='/lobby'>
				<Button variant='contained'>Lobby</Button>
			</Link>
			<div className={classes.table}>
				<div className={`${classes.playersHudContainer} ${classes.top}`}>
					<HoleCards />
					<PlayersHud playersName={opponentsName} chips={opponentsChips} />
				</div>
				<CommunityCards communityCards={communityCards} />
				<h2>{pot}</h2>
				<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
					<HoleCards holeCards={holeCards} />
					<PlayersHud playersName={playersName} chips={playersChips} />
				</div>
				{isTurn && (
					<BettingOptions bet={bet} setBet={setBet} chips={playersChips} />
				)}
				{!startGame && (
					<Paper className={classes.waitingDisplay}>
						<h5 className={classes.waitingText}>WAITING FOR OPPONENT</h5>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default PokerRoom
