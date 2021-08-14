import { useState, useEffect, useRef } from 'react'
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
	const bettingRound = useRef('preflop')
	const smallBlind = useRef(10)
	const isPlayerOne = useRef(null)
	const [amountToCall, setAmountToCall] = useState(0)
	const [startGame, setStartGame] = useState(false)
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [position, setPosition] = useState(null)
	const [isTurn, setIsTurn] = useState(false)
	const [playersHoleCards, setPlayersHoleCards] = useState([])
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])
	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState(0)
	const [bet, setBet] = useState(false)
	const [showHands, setShowHands] = useState(false)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		isPlayerOne.current = currentPlayer.id === roomId

		// Join socket to given room //
		socket.emit('enterPokerRoom', roomId, currentPlayer)

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.on('getPlayersInfo', ({ username }) => {
			if (!isMounted) return null

			currentPlayer.username === username
				? setPlayersName(username)
				: setOpponentsName(username)

			setStartGame(true)

			setPosition(isPlayerOne.current ? 0 : 1)
			setIsTurn(isPlayerOne.current ? true : false)
			setAmountToCall(isPlayerOne.current ? smallBlind : 0)

			if (isPlayerOne.current && currentPlayer.username !== username)
				socket.emit('deal') // Player 1 emits deal to server //
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [roomId])

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket.once('dealPreFlop', (playerOneHoleCards, playerTwoHoleCards) => {
			setPlayersHoleCards(
				isPlayerOne.current ? playerOneHoleCards : playerTwoHoleCards
			)
			setOpponentsHoleCards(
				!isPlayerOne.current ? playerTwoHoleCards : playerOneHoleCards
			)
		})

		socket.once('dealFlop', (flop) => {
			if (!isMounted) return null

			// Change betting round to flop //
			bettingRound.current = 'flop'

			// Player in position 1 goes first postflop //
			setIsTurn((isTurn) => !isTurn)

			setCommunityCards(flop)
		})

		socket.once('dealTurn', (turn) => {
			if (!isMounted) return null

			// Change betting round to turn //
			bettingRound.current = 'turn'

			setCommunityCards((communityCards) => [...communityCards, turn[0]])
		})

		socket.once('dealRiver', (river) => {
			if (!isMounted) return null

			// Change betting round to river //
			bettingRound.current = 'river'

			setCommunityCards((communityCards) => [...communityCards, river[0]])
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [])

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket.on('action', (position, action, bet) => {
			// Change turn //
			setIsTurn((isTurn) => !isTurn)

			////////// Preflop //////////
			if (bettingRound.current === 'preflop') {
				if (action === 'call' && position === 1) {
					// End of preflop betting round //
					socket.emit('dealFlop')
				}
			}

			////////// Flop //////////
			else if (bettingRound.current === 'flop') {
				if (action === 'call' && position === 0) {
					// End of flop betting round //
					socket.emit('dealTurn')
				}
			}

			////////// Turn //////////
			else if (bettingRound.current === 'turn') {
				if (action === 'call' && position === 0) {
					// End of flop betting round //
					socket.emit('dealRiver')
				}
			}

			////////// River //////////
			else if (bettingRound.current === 'river') {
				if (action === 'call' && position === 0) {
					// End of flop betting round //
					socket.emit('handIsOver')
				}
			}

			// add bet to pot here
			// setBet(action === 'bet' ? bet : 0)
			// setPot(bet + pot)
		})

		socket.once('handIsOver', () => {
			console.log('handIsOver')
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
		// }, [isTurn, pot])
	}, [])

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
					{showHands ? (
						<HoleCards holeCards={opponentsHoleCards} />
					) : (
						<HoleCards />
					)}
					<PlayersHud playersName={opponentsName} chips={opponentsChips} />
				</div>
				<CommunityCards communityCards={communityCards} />
				<h2>{pot}</h2>
				<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
					<HoleCards holeCards={playersHoleCards} />
					<PlayersHud
						playersName={playersName}
						chips={playersChips}
						position={position}
					/>
				</div>
				{isTurn && (
					<BettingOptions
						position={position}
						bet={bet}
						setBet={setBet}
						chips={playersChips}
					/>
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
