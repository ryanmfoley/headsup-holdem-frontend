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
		height: '60%',
		maxWidth: 700,
		maxHeight: 350,
		margin: '100px auto',
		border: '2px solid gray',
		borderRadius: '30% / 60%',
		// borderRadius: '50%',
		boxShadow: '0 0 10px #9ecaed',
	},
	waitingDisplay: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '60%',
		transform: 'translate(-50%, -50%)',
		borderRadius: '10px',
	},
	waitingText: {
		margin: 'auto',
		padding: '10px',
		fontSize: '24px',
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
	},
	pot: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 160,
		left: 0,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '150px',
		height: '40px',
		margin: 'auto',
		color: 'white',
		background: 'rgba(0, 0, 0, 0.4)',
		borderRadius: '15px',
	},
	playersHudContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		width: '30%',
		margin: 'auto',
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
	const isTurn = useRef(null)
	const hasCalledSB = useRef(null)
	const [numberOfHands, setNumberOfHands] = useState(0)

	const [showBettingOptions, setShowBettingOptions] = useState(false)
	// const [playersHoleCards, setPlayersHoleCards] = useState([])
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])
	const [holeCards, setHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])

	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState()
	// const [betAmount, setBetAmount] = useState(false)
	const [callAmount, setCallAmount] = useState(0)

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
			isTurn.current = isPlayerOne.current ? true : false

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

		socket.once('dealPreFlop', (holeCards) => {
			if (!isMounted) return null

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
			setPot(SMALL_BLIND + BIG_BLIND)
			setCallAmount(isPlayerOnBtn.current ? SMALL_BLIND : 0)
			setHoleCards(holeCards)
			hasCalledSB.current = false
		})

		socket.once('dealFlop', (flop) => {
			if (!isMounted) return null

			// Change betting round to flop //
			bettingRound.current = 'flop'

			// Player in position 1 goes first postflop //
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
			isTurn.current = !isTurn.current

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

		const currentPlayer = JSON.parse(localStorage.getItem('player'))

		const isRoundOver = () =>
			(bettingRound.current === 'preflop' && hasCalledSB.current) ||
			(bettingRound.current !== 'preflop' &&
				!isPlayerOnBtn.current &&
				!isTurn.current) ||
			(bettingRound.current !== 'preflop' &&
				isPlayerOnBtn.current &&
				isTurn.current)

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

		const dealBoard = () => {
			switch (bettingRound.current) {
				case 'preflop':
					setTimeout(() => socket.emit('dealFlop'), 1500)
					setTimeout(() => socket.emit('dealTurn'), 3000)
					setTimeout(() => socket.emit('dealRiver'), 4500)
					break
				case 'flop':
					setTimeout(() => socket.emit('dealTurn'), 1500)
					setTimeout(() => socket.emit('dealRiver'), 3000)
					break
				case 'turn':
					setTimeout(() => socket.emit('dealRiver'), 1500)
					break
				default:
					socket.emit('handIsOver')
			}
		}

		socket.on('check', () => {
			if (!isMounted) return null

			if (isPlayerOne.current && isRoundOver()) dealNextCard()

			// Change turn //
			isTurn.current = !isTurn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
		})

		socket.on('call', ({ playerCalling, callAmount }) => {
			if (!isMounted) return null

			// Only Player One emits deal to server //
			if (isPlayerOne.current && isRoundOver()) {
				if (playersChips <= callAmount || opponentsChips <= callAmount) {
					// Player is All-In //
					dealBoard()
					console.log('allIn')
				} else {
					console.log('dealNextCard')
					dealNextCard()
				}
			}

			// All calls but first SB call end betting round //
			hasCalledSB.current = true

			if (currentPlayer.username === playerCalling) {
				// Current Player is calling //
				setPlayersChips((chips) => chips - callAmount)
			} else {
				// Opponent is calling //
				setOpponentsChips((chips) => chips - callAmount)
			}

			setPot((pot) => pot + callAmount)
			setCallAmount(0)

			// Change turn //
			isTurn.current = !isTurn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
		})

		socket.on('bet', ({ playerBetting, betAmount }) => {
			if (!isMounted) return null

			if (currentPlayer.username === playerBetting) {
				// Current Player is betting //
				setPlayersChips((chips) => chips - betAmount)
			} else {
				// Opponent is betting //
				setOpponentsChips((chips) => chips - betAmount)
				setCallAmount(betAmount)
			}

			setPot((pot) => pot + betAmount)

			// Change turn //
			isTurn.current = !isTurn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
		})

		socket.on('raise', ({ playerRaising, callAmount, raiseAmount }) => {
			if (!isMounted) return null

			// All calls but first SB call end betting round //
			hasCalledSB.current = true

			if (currentPlayer.username === playerRaising) {
				// Current Player is raising //
				setPlayersChips((chips) => chips - callAmount - raiseAmount)
			} else {
				// Opponent is raising //
				setOpponentsChips((chips) => chips - callAmount - raiseAmount)
				setCallAmount(raiseAmount)
			}

			setPot((pot) => pot + callAmount + raiseAmount)

			// Change turn //
			isTurn.current = !isTurn.current
			setShowBettingOptions((showBettingOptions) => !showBettingOptions)
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [playersChips, opponentsChips])

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
	// 	window.addEventListener('beforeunload', () => socket.emit('logout'))
	// }, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.root}>
			<Link to='/lobby' style={{ textDecoration: 'none' }}>
				<Button variant='contained'>Lobby</Button>
			</Link>
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
				{showBettingOptions && (
					<BettingOptions
						isPlayerOnBtn={isPlayerOnBtn.current}
						callAmount={callAmount}
						setCallAmount={setCallAmount}
						playersChips={playersChips}
						opponentsChips={opponentsChips}
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
