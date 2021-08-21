import { useState, useEffect, useRef } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import BettingOptions from './BettingOptions'
import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'
import PlayersHud from './PlayersHud'
import socket from '../../config/socketConfig'

// function Switch(i) {
// 	return arguments[++i]
// }

// let res = Switch(1, 'dealFlop', 'dealTurn', 'dealRiver')

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
	const isPlayerOne = useRef(null)
	const [startGame, setStartGame] = useState(false)
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')

	const bettingRound = useRef('preflop')
	const [numberOfHands, setNumberOfHands] = useState(0)
	const [amountToCall, setAmountToCall] = useState(0)
	const smallBlind = 10
	const bigBlind = 20
	// const [position, setPosition] = useState(null)
	const position = useRef(null)
	const [isTurn, setIsTurn] = useState(false)
	const turn = useRef(null)
	const [playersHoleCards, setPlayersHoleCards] = useState([])
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])
	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState()
	const [betOrRaise, setBetOrRaise] = useState(false)
	const [showHands, setShowHands] = useState(false)

	// function isRoundOver() {
	// 	if (bettingRound.current === 'preflop') {
	// 		if (position === 1) {
	// 			// End of preflop betting round //
	// 			socket.emit('dealFlop')
	// 		}
	// 	}

	// 	////////// Flop //////////
	// 	else if (bettingRound.current === 'flop') {
	// 		if (position === 0) {
	// 			// End of flop betting round //
	// 			socket.emit('dealTurn')
	// 		}
	// 	}

	// 	////////// Turn //////////
	// 	else if (bettingRound.current === 'turn') {
	// 		if (position === 0) {
	// 			// End of turn betting round //
	// 			socket.emit('dealRiver')
	// 		}
	// 	}

	// 	////////// River //////////
	// 	else if (bettingRound.current === 'river') {
	// 		if (position === 0) {
	// 			// End of river betting round //
	// 			socket.emit('handIsOver')
	// 		}
	// 	}
	// }

	// useEffect(() => {
	// 	console.log('render from PokerRoom')
	// })

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		isPlayerOne.current = currentPlayer.id === roomId
		setPlayersName(currentPlayer.username)

		// Join socket to given room //
		socket.emit('enterPokerRoom', roomId, currentPlayer)

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.on('getPlayersInfo', ({ username }) => {
			if (!isMounted) return null

			setOpponentsName(username)
			setStartGame(true)
			// setPosition(isPlayerOne.current ? 0 : 1)
			position.current = isPlayerOne.current ? 0 : 1
			setIsTurn(isPlayerOne.current ? true : false)
			turn.current = isPlayerOne.current ? true : false
			setAmountToCall(isPlayerOne.current ? 10 : 0)

			// Player 1 emits deal to server //
			if (isPlayerOne.current) socket.emit('deal')
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [roomId])

	////////// Deal Cards //////////
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
			setIsTurn((prevIsTurn) => !prevIsTurn)
			turn.current = !turn.current

			setCommunityCards(flop)
		})

		socket.once('dealTurn', (turn) => {
			if (!isMounted) return null

			// Change betting round to turn //
			bettingRound.current = 'turn'

			setCommunityCards((prevCommunityCards) => [
				...prevCommunityCards,
				turn[0],
			])
		})

		socket.once('dealRiver', (river) => {
			if (!isMounted) return null

			// Change betting round to river //
			bettingRound.current = 'river'

			setCommunityCards((prevCommunityCards) => [
				...prevCommunityCards,
				river[0],
			])
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [numberOfHands])

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		const isRoundOver = () =>
			(bettingRound.current === 'preflop' &&
				!position.current &&
				!turn.current) ||
			(bettingRound.current === 'preflop' &&
				position.current &&
				turn.current) ||
			(bettingRound.current !== 'preflop' &&
				position.current &&
				!turn.current) ||
			(bettingRound.current !== 'preflop' && !position.current && turn.current)

		const dealNextCard = () => {
			console.log('dealNextCard from dealNextCard', bettingRound.current)
			switch (bettingRound.current) {
				case 'preflop':
					socket.emit('dealFlop')
					break
				case 'flop':
					socket.emit('dealTurn')
					break
				case 'turn':
					socket.emit('dealRiver')
					break
				default:
					socket.emit('handIsOver')
			}
		}

		socket.on('check', () => {
			// console.log('check', bettingRound.current, turn.current)
			// if (isPlayerOne.current && isRoundOver()) dealNextCard()
			if (isPlayerOne.current && isRoundOver()) {
				console.log('dealNextCard from check')
				dealNextCard()
			}
			// turn.current = !turn.current
			// if (
			// 	bettingRound.current !== 'preflop' ||
			// 	(bettingRound.current === 'preflop' && !isRoundOver())
			// ) {
			// 	console.log('change turn from check')
			setIsTurn((prevIsTurn) => !prevIsTurn)
			turn.current = !turn.current
			// }
			// if (bettingRound.current === 'preflop' && isRoundOver())
			// turn.current = !turn.current
		})

		socket.on('call', ({ player }) => {
			// console.log('call', bettingRound.current, turn.current)

			// if (isPlayerOne.current && isRoundOver()) dealNextCard()
			if (isPlayerOne.current && isRoundOver()) {
				console.log('dealNextCard from call')
				dealNextCard()
			}

			// if (
			// 	bettingRound.current !== 'preflop' ||
			// 	(bettingRound.current === 'preflop' && !isRoundOver())
			// ) {
			// 	console.log('change turn from call')
			turn.current = !turn.current
			// 	// Change turn //
			setIsTurn((isTurn) => !isTurn)
			// }
			// add bet to pot here
			// setBet(action === 'bet' ? bet : 0)
			// setPot(bet + pot)
		})

		// socket.on('betOrRaise', () => {})

		// 	// add bet to pot here
		// 	// setBet(action === 'bet' ? bet : 0)
		// 	// setPot(bet + pot)
		// })

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [])

	// useEffect(() => {
	// 	// Clean up controller //
	// 	let isMounted = true

	// 	// deal

	// 	// Cancel subscription to useEffect //
	// 	return () => {
	// 		isMounted = false
	// 		socket.offAny()
	// 	}
	// }, [])

	// useEffect(() => {
	// 	// Clean up controller //
	// 	let isMounted = true

	// 	socket.once('handIsOver', ({ losingPlayer }) => {
	// 		const currentPlayer = JSON.parse(localStorage.getItem('player'))

	// 		// Add pot to winners chips //
	// 		if (losingPlayer.username === currentPlayer.username) {
	// 			setOpponentsChips((prevChips) => prevChips + pot)
	// 		} else {
	// 			setPlayersChips((prevChips) => prevChips + pot)
	// 		}

	// 		// setPosition((prevPosition) => !prevPosition)
	// 		position.current = !position.current
	// 		setIsTurn((prevIsTurn) => !prevIsTurn)
	// 		setAmountToCall(isTurn ? 10 : 0)
	// 		// console.log('handIsOver')
	// 	})

	// 	// Cancel subscription to useEffect //
	// 	return () => {
	// 		isMounted = false
	// 		socket.offAny()
	// 	}
	// }, [isTurn, pot])

	// useEffect(() => {
	// 	window.addEventListener('beforeunload', () => socket.emit('logout'))
	// }, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.cardRoomContainer}>
			<Link to='/lobby'>
				<Button variant='contained'>Lobby</Button>
			</Link>
			<h1>{`amount to call: ${amountToCall}`}</h1>
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
				<h2>Pot: ${pot}</h2>
				<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
					<HoleCards holeCards={playersHoleCards} />
					<PlayersHud
						playersName={playersName}
						chips={playersChips}
						position={position.current}
					/>
				</div>
				{isTurn && (
					<BettingOptions
						position={position.current}
						betOrRaise={betOrRaise}
						setBetOrRaise={setBetOrRaise}
						amountToCall={amountToCall}
						setAmountToCall={setAmountToCall}
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
