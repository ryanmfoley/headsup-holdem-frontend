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
// function cleanBeforeRound() {
//   inRound = false
// }
// isRoundWinner, isRoundOver, isGameOver

const useStyles = makeStyles({
	root: {
		position: 'relative',
		width: '100vw',
		height: '90vh',
		background: '#4327ac',
	},
	table: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		background: '#193024',
		width: '75%',
		height: '50%',
		maxWidth: 750,
		maxHeight: 350,
		margin: '60px auto',
		border: '2px solid gray',
		borderRadius: '30% / 60%',
		// borderRadius: '50%',
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
	board: {
		position: 'relative',
		// outline: '3px solid orange',
	},
	pot: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		// outline: '3px solid white',
	},
	playersHudContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		width: '30%',
		margin: 'auto',
		// outline: '2px dashed white',
	},
	dealerBtn: {
		position: 'absolute',
		left: '30%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '4vmin',
		height: '4vmin',
		padding: 5,
		background: 'white',
		border: '1px solid black',
		borderRadius: '50%',
	},
	dealerBtnText: {
		fontSize: '1vmin',
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

const SMALL_BLIND = 10
const BIG_BLIND = 20

const PokerRoom = ({ isLoggedIn, setIsLoggedIn }) => {
	////////////// TURN REDIRECT BACK ON //////////////
	const classes = useStyles()
	const { roomId } = useParams()
	const [startGame, setStartGame] = useState(false)
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')

	const bettingRound = useRef('preflop')
	const isPlayerOne = useRef(null)
	const isPlayerOnBtn = useRef(null)
	const isturn = useRef(null)
	const [numberOfHands, setNumberOfHands] = useState(0)

	const [showBettingOptions, setShowBettingOptions] = useState(false)
	// const [playersHoleCards, setPlayersHoleCards] = useState([])
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])
	const [holeCards, setHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])

	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState()
	const [betOrRaiseAmount, setBetOrRaiseAmount] = useState(false)
	const [amountToCall, setAmountToCall] = useState(0)

	const [showHands, setShowHands] = useState(false)

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
			setShowBettingOptions(isPlayerOne.current ? true : false)
			isPlayerOnBtn.current = isPlayerOne.current ? true : false
			isturn.current = isPlayerOne.current ? true : false

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

		// socket.once('dealPreFlop', (playerOneHoleCards, playerTwoHoleCards) => {
		// 	setAmountToCall(isPlayerOnBtn.current ? SMALL_BLIND : 0)

		// 	setPlayersHoleCards(
		// 		isPlayerOne.current ? playerOneHoleCards : playerTwoHoleCards
		// 	)
		// 	setOpponentsHoleCards(
		// 		!isPlayerOne.current ? playerTwoHoleCards : playerOneHoleCards
		// 	)
		// })
		socket.once('dealPreFlop', (holeCards) => {
			setPlayersChips((playersChips) =>
				isPlayerOnBtn.current
					? playersChips - SMALL_BLIND
					: playersChips - BIG_BLIND
			)
			setOpponentsChips((opponentsChips) =>
				isPlayerOnBtn.current
					? opponentsChips - BIG_BLIND
					: opponentsChips - SMALL_BLIND
			)
			setPot((pot) => pot + SMALL_BLIND + BIG_BLIND)
			setAmountToCall(isPlayerOnBtn.current ? SMALL_BLIND : 0)
			setHoleCards(holeCards)
		})

		socket.once('dealFlop', (flop) => {
			if (!isMounted) return null

			// Change betting round to flop //
			bettingRound.current = 'flop'

			// Player in position 1 goes first postflop //
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
			isturn.current = !isturn.current

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
				isPlayerOnBtn.current &&
				!isturn.current) ||
			(bettingRound.current === 'preflop' &&
				!isPlayerOnBtn.current &&
				isturn.current) ||
			(bettingRound.current !== 'preflop' &&
				!isPlayerOnBtn.current &&
				!isturn.current) ||
			(bettingRound.current !== 'preflop' &&
				isPlayerOnBtn.current &&
				isturn.current)

		const dealNextCard = () => {
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
			if (isPlayerOne.current && isRoundOver()) dealNextCard()

			// Change turn //
			isturn.current = !isturn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
		})

		socket.on('call', ({ player }) => {
			if (isPlayerOne.current && isRoundOver()) dealNextCard()

			// Change turn //
			isturn.current = !isturn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
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
	// 		isPlayerOnBtn.current = isPlayerOnBtn.current
	// 		setShowBettingOptions((showBettingOptions) => !showBettingOptions)
	// 		setAmountToCall(showBettingOptions ? 10 : 0)
	// 		// console.log('handIsOver')
	// 	})

	// 	// Cancel subscription to useEffect //
	// 	return () => {
	// 		isMounted = false
	// 		socket.offAny()
	// 	}
	// }, [showBettingOptions, pot])

	// useEffect(() => {
	// 	window.addEventListener('beforeunload', () => socket.emit('logout'))
	// }, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.root}>
			<Link to='/lobby' style={{ textDecoration: 'none' }}>
				<Button variant='contained'>Lobby</Button>
			</Link>
			<h1>{`amount to call: ${amountToCall}`}</h1>
			<div className={classes.table}>
				<div
					className={classes.dealerBtn}
					style={{ top: !isPlayerOnBtn.current ? '10%' : '80%' }}>
					<p className={classes.dealerBtnText}>DEALER</p>
				</div>
				<div className={`${classes.playersHudContainer} ${classes.top}`}>
					{showHands ? (
						<HoleCards holeCards={opponentsHoleCards} />
					) : (
						<HoleCards />
					)}
					<PlayersHud playersName={opponentsName} chips={opponentsChips} />
				</div>
				<div className={classes.board}>
					<div className={classes.pot}>
						<h2>Pot: ${pot}</h2>
					</div>
					<CommunityCards communityCards={communityCards} />
				</div>
				<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
					<HoleCards holeCards={holeCards} />
					<PlayersHud
						playersName={playersName}
						chips={playersChips}
						isPlayerOnBtn={isPlayerOnBtn.current}
					/>
				</div>
			</div>
			{showBettingOptions && (
				<BettingOptions
					isPlayerOnBtn={isPlayerOnBtn.current}
					betOrRaiseAmount={betOrRaiseAmount}
					setBetOrRaiseAmount={setBetOrRaiseAmount}
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
			{/* </div> */}
		</div>
	)
}

export default PokerRoom
