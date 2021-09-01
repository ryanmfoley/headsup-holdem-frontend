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

//////////// TODOS ////////////
// 1. Set min bet
// 2. change bet from BB to raise
// 3. maybe add a hand counter
// 4. Add chat
// 5. socket.handshake

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
		border: '5px solid gray',
		borderRadius: '30% / 60%',
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
	pot: {
		display: 'flex',
		flex: 1,
		alignItems: 'flex-end',
	},
	potText: {
		background: 'rgba(0, 0, 0, 0.4)',
		padding: '10px',
		color: 'white',
		borderRadius: '15px',
	},
	playersHudContainer: {
		position: 'absolute',
		width: '25%',
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
		top: '-35%',
	},
	bottom: {
		bottom: '-35%',
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

	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')

	// Gameplay variables //
	const bettingRoundRef = useRef(null)
	const isPlayerOneRef = useRef(null)
	const isPlayerOnBtnRef = useRef(null)
	const isTurnRef = useRef(null)
	const hasCalledSBRef = useRef(false)
	const [startGame, setStartGame] = useState(false)
	const [isPlayerAllIn, setIsPlayerAllIn] = useState(false)
	const [showBettingOptions, setShowBettingOptions] = useState(false)
	const [showHands, setShowHands] = useState(false)

	// Cards //
	const communityCardsRef = useRef([])
	const holeCardsRef = useRef({})
	const [communityCards, setCommunityCards] = useState([])
	const [holeCards, setHoleCards] = useState(null)
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])

	// Chips //
	const potRef = useRef(0)
	const [pot, setPot] = useState()
	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [callAmount, setCallAmount] = useState(0)

	const alternateTurn = () => {
		isTurnRef.current = !isTurnRef.current
		setShowBettingOptions((showBettingOptions) => !showBettingOptions)
	}

	const setTurn = () => {
		isTurnRef.current = !isPlayerOnBtnRef.current ? true : false
		setShowBettingOptions(!isPlayerOnBtnRef.current ? true : false)
	}

	////////// Get Player Info //////////
	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		isPlayerOneRef.current = currentPlayer.id === roomId
		setPlayersName(currentPlayer.username)

		// Join socket to the roomId //
		socket.emit('enterPokerRoom', { roomId, currentPlayer })

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.once('getPlayersInfo', ({ username }) => {
			if (!isMounted) return null

			setOpponentsName(username)
			setStartGame(true)
			isPlayerOnBtnRef.current = isPlayerOneRef.current ? true : false

			// Player 1 emits deal to server //
			if (isPlayerOneRef.current) socket.emit('deal')
		})

		socket.on('dealPreFlop', (holeCards) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'preflop'

			// Subtract blinds from players chips //
			setPlayersChips((playersChips) =>
				isPlayerOnBtnRef.current
					? playersChips - SMALL_BLIND
					: playersChips - BIG_BLIND
			)
			setOpponentsChips((opponentsChips) =>
				isPlayerOnBtnRef.current
					? opponentsChips - BIG_BLIND
					: opponentsChips - SMALL_BLIND
			)

			// Add small blind and big blind to pot //
			potRef.current = SMALL_BLIND + BIG_BLIND
			setPot(SMALL_BLIND + BIG_BLIND)

			setCallAmount(isPlayerOnBtnRef.current ? SMALL_BLIND : 0)

			// Set hole cards //
			holeCardsRef.current = holeCards
			setHoleCards(holeCards)

			// Set turn //
			isTurnRef.current = isPlayerOnBtnRef.current ? true : false
			setShowBettingOptions(isPlayerOnBtnRef.current ? true : false)
		})

		socket.on('dealFlop', (flop) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'flop'

			// Add Flop cards to communityCards //
			communityCardsRef.current = flop
			setCommunityCards(flop)

			// Set turn //
			setTurn()
		})

		socket.on('dealTurn', (turn) => {
			if (!isMounted) return null

			// Change betting round to turn //
			bettingRoundRef.current = 'turn'

			communityCardsRef.current = [...communityCardsRef.current, turn[0]]
			setCommunityCards((prevCommunityCards) => [
				...prevCommunityCards,
				turn[0],
			])

			// Set turn //
			setTurn()
		})

		socket.on('dealRiver', (river) => {
			if (!isMounted) return null

			// Change betting round to river //
			bettingRoundRef.current = 'river'

			communityCardsRef.current = [...communityCardsRef.current, river[0]]

			setCommunityCards((prevCommunityCards) => [
				...prevCommunityCards,
				river[0],
			])

			// Set turn //
			setTurn()
		})

		const isRoundOver = (action) =>
			(bettingRoundRef.current === 'preflop' && hasCalledSBRef.current) ||
			(bettingRoundRef.current !== 'preflop' && action === 'call') ||
			(bettingRoundRef.current !== 'preflop' &&
				action === 'check' &&
				isPlayerOnBtnRef.current &&
				isTurnRef.current) ||
			(bettingRoundRef.current !== 'preflop' &&
				action === 'check' &&
				!isPlayerOnBtnRef.current &&
				!isTurnRef.current)

		const dealNextCard = () => {
			switch (bettingRoundRef.current) {
				case 'preflop':
					if (isPlayerOneRef.current) socket.emit('dealFlop')
					break
				case 'flop':
					if (isPlayerOneRef.current) socket.emit('dealTurn')
					break
				case 'turn':
					if (isPlayerOneRef.current) socket.emit('dealRiver')
					break
				default:
					if (isPlayerOneRef.current) socket.emit('handIsOver')
			}
		}

		const dealBoard = () => {
			switch (bettingRoundRef.current) {
				case 'preflop':
					setTimeout(() => socket.emit('dealFlop'), 1500)
					setTimeout(() => socket.emit('dealTurn'), 3000)
					setTimeout(() => socket.emit('dealRiver'), 4500)
					setTimeout(() => socket.emit('handIsOver'), 6000)
					break
				case 'flop':
					setTimeout(() => socket.emit('dealTurn'), 1500)
					setTimeout(() => socket.emit('dealRiver'), 3000)
					setTimeout(() => socket.emit('handIsOver'), 4500)
					break
				case 'turn':
					setTimeout(() => socket.emit('dealRiver'), 1500)
					setTimeout(() => socket.emit('handIsOver'), 3000)
					break
				default:
					setTimeout(() => socket.emit('handIsOver'), 1500)
			}
		}

		socket.on('check', () =>
			isRoundOver('check') ? dealNextCard() : alternateTurn()
		)

		socket.on(
			'call',
			({ playerCalling, playersChips, opponentsChips, callAmount }) => {
				if (!isMounted) return null

				// Add chips from players chip total to pot total //
				if (currentPlayer.username === playerCalling) {
					// Current Player is calling //
					setPlayersChips((chips) => chips - callAmount)
				} else {
					// Opponent is calling //
					setOpponentsChips((chips) => chips - callAmount)
				}

				potRef.current = potRef.current + callAmount
				setPot((pot) => pot + callAmount)
				setCallAmount(0)

				const hasCalledAllIn =
					(isTurnRef.current && playersChips <= callAmount) ||
					(!isTurnRef.current && opponentsChips <= callAmount)

				// Deal all cards if player is all-in //
				if (hasCalledAllIn) return dealBoard()

				isRoundOver('call') ? dealNextCard() : alternateTurn()

				hasCalledSBRef.current = true
			}
		)

		socket.on(
			'bet',
			({ playerBetting, playersChips, opponentsChips, betAmount }) => {
				if (!isMounted) return null

				if (playersChips <= betAmount || opponentsChips <= betAmount)
					setIsPlayerAllIn(true)

				if (currentPlayer.username === playerBetting) {
					// Current Player is betting //
					setPlayersChips((chips) => chips - betAmount)
				} else {
					// Opponent is betting //
					setOpponentsChips((chips) => chips - betAmount)
					setCallAmount(betAmount)
				}

				potRef.current = potRef.current + betAmount
				setPot((pot) => pot + betAmount)
				alternateTurn()
			}
		)

		socket.on(
			'raise',
			({
				playerRaising,
				playersChips,
				opponentsChips,
				callAmount,
				raiseAmount,
			}) => {
				if (!isMounted) return null

				if (playersChips <= raiseAmount || opponentsChips <= raiseAmount)
					setIsPlayerAllIn(true)

				// All calls but first SB call end betting round //
				hasCalledSBRef.current = true

				if (currentPlayer.username === playerRaising) {
					// Current Player is raising //
					setPlayersChips((chips) => chips - callAmount - raiseAmount)
				} else {
					// Opponent is raising //
					setOpponentsChips((chips) => chips - callAmount - raiseAmount)
					setCallAmount(raiseAmount)
				}

				potRef.current = potRef.current + callAmount + raiseAmount
				setPot((pot) => pot + callAmount + raiseAmount)
				alternateTurn()
			}
		)

		socket.on('handIsOver', () => {
			socket.emit('showdown', holeCardsRef.current)
		})

		socket.on('determineWinner', (opponentsCards) => {
			setOpponentsHoleCards(opponentsCards)

			// Host emits determineWinner event //
			const playerOnesHand = [
				...communityCardsRef.current,
				holeCardsRef.current[0],
				holeCardsRef.current[1],
			]
			const playerTwosHand = [
				...communityCardsRef.current,
				opponentsCards[0],
				opponentsCards[1],
			]

			if (isPlayerOneRef.current)
				socket.emit('determineWinner', {
					playerOnesHand,
					playerTwosHand,
				})
		})

		socket.on('handResults', ({ winner, isDraw }) => {
			if (!isMounted) return null

			setShowBettingOptions(false)
			setShowHands(true)

			if (isDraw) {
				// Split pot between players //
				const halfPot = potRef.current / 2

				setPlayersChips((chips) => chips + halfPot)
				setOpponentsChips((chips) => chips + halfPot)
			} else if (
				(winner === 'playerOne' && isPlayerOneRef.current) ||
				(winner !== 'playerOne' && !isPlayerOneRef.current)
			) {
				// Player Won //
				setPlayersChips((chips) => chips + potRef.current)
			} else {
				// Opponent Won //
				setOpponentsChips((chips) => chips + potRef.current)
			}

			setTimeout(() => {
				// Reset game variables //
				isPlayerOnBtnRef.current = !isPlayerOnBtnRef.current
				isTurnRef.current = false
				hasCalledSBRef.current = false
				setShowBettingOptions(false)
				setIsPlayerAllIn(false)
				setShowHands(false)
				setCallAmount(0)
				holeCardsRef.current = []
				communityCardsRef.current = null
				setHoleCards(null)
				setOpponentsHoleCards(null)
				setCommunityCards([])
				potRef.current = 0
				setPot(0)
			}, 3000)

			if (isPlayerOneRef.current) setTimeout(() => socket.emit('deal'), 4500)
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [roomId])

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
				{startGame ? (
					<>
						<div
							className={classes.dealerBtn}
							style={{ top: !isPlayerOnBtnRef.current ? '10%' : '80%' }}>
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
						<div className={classes.pot}>
							<h2 className={classes.potText}>Pot: ${pot}</h2>
						</div>
						<CommunityCards communityCards={communityCards} />
						<div style={{ flex: 1 }}></div>
						<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
							<HoleCards holeCards={holeCards} />
							<PlayersHud playersName={playersName} chips={playersChips} />
						</div>
						{showBettingOptions && (
							<BettingOptions
								playersChips={playersChips}
								opponentsChips={opponentsChips}
								callAmount={callAmount}
								isPlayerAllIn={isPlayerAllIn}
							/>
						)}
					</>
				) : (
					<Paper className={classes.waitingDisplay}>
						<h5 className={classes.waitingText}>WAITING FOR OPPONENT</h5>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default PokerRoom
