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
// 1. maybe add a hand counter
// 2. Add chat
// 3. socket.handshake
// 4. useMemo for setting playersChips?
// 5. is isLogin enough for security or should I use socket.auth?

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
	const isPlayerOnBtnRef = useRef(null)
	const isTurnRef = useRef(null)
	const isPlayerAllInRef = useRef(false)
	const hasCalledSBRef = useRef(false)
	const [startGame, setStartGame] = useState(false)
	const [isPlayerAllIn, setIsPlayerAllIn] = useState(false)
	const [hasCalledBB, setHasCalledBB] = useState(false)
	const [hasWon, setHasWon] = useState(false)
	const [showBettingOptions, setShowBettingOptions] = useState(false)
	const [showHands, setShowHands] = useState(false)

	// Cards //
	const holeCardsRef = useRef({})
	const communityCardsRef = useRef([])
	const [holeCards, setHoleCards] = useState(null)
	const [opponentsHoleCards, setOpponentsHoleCards] = useState([])
	const [communityCards, setCommunityCards] = useState([])

	// Chips //
	const playersChipsRef = useRef(10000)
	const opponentsChipsRef = useRef(10000)
	const potRef = useRef(0)
	const [playersChips, setPlayersChips] = useState(10000)
	const [opponentsChips, setOpponentsChips] = useState(10000)
	const [pot, setPot] = useState(0)
	const [callAmount, setCallAmount] = useState(0)

	////////// Get Player Info //////////
	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		currentPlayer.isPlayerOne = currentPlayer.id === roomId
		isPlayerOnBtnRef.current = currentPlayer.isPlayerOne ? true : false

		const alternateTurn = () => {
			isTurnRef.current = !isTurnRef.current
			setShowBettingOptions(isTurnRef.current)
		}

		const setTurn = () => {
			isTurnRef.current =
				!isPlayerAllInRef.current && !isPlayerOnBtnRef.current ? true : false
			setShowBettingOptions(isTurnRef.current)
		}

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
					if (currentPlayer.isPlayerOne) socket.emit('dealFlop')
					break
				case 'flop':
					if (currentPlayer.isPlayerOne) socket.emit('dealTurn')
					break
				case 'turn':
					if (currentPlayer.isPlayerOne) socket.emit('dealRiver')
					break
				default:
					if (currentPlayer.isPlayerOne) socket.emit('handIsOver')
			}
		}

		const dealCommunityCards = () => {
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

		// Join socket to the roomId //
		socket.emit('enterPokerRoom', { roomId, currentPlayer })

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.once('getPlayersInfo', ({ username }) => {
			if (!isMounted) return null

			setPlayersName(currentPlayer.username)
			setOpponentsName(username)
			setStartGame(true)

			// Player 1 emits deal to server //
			if (currentPlayer.isPlayerOne) socket.emit('deal')
		})

		socket.on('dealPreFlop', (holeCards) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'preflop'

			// Test Code //
			// playersChipsRef.current = isPlayerOnBtnRef.current ? 100 : 200
			// setPlayersChips(isPlayerOnBtnRef.current ? 100 : 200)
			// opponentsChipsRef.current = !isPlayerOnBtnRef.current ? 100 : 200
			// setOpponentsChips(!isPlayerOnBtnRef.current ? 100 : 200)

			////////// Subtract blinds from players chips and set pot //////////
			const playersBlindAmount = isPlayerOnBtnRef.current
				? Math.min(
						SMALL_BLIND,
						playersChipsRef.current,
						opponentsChipsRef.current
				  )
				: Math.min(
						BIG_BLIND,
						playersChipsRef.current,
						opponentsChipsRef.current
				  )
			const opponentsBlindAmount = isPlayerOnBtnRef.current
				? Math.min(
						BIG_BLIND,
						playersChipsRef.current,
						opponentsChipsRef.current
				  )
				: Math.min(
						SMALL_BLIND,
						playersChipsRef.current,
						opponentsChipsRef.current
				  )

			playersChipsRef.current -= playersBlindAmount
			setPlayersChips((chips) => chips - playersBlindAmount)

			opponentsChipsRef.current -= opponentsBlindAmount
			setOpponentsChips((chips) => chips - opponentsBlindAmount)

			potRef.current = playersBlindAmount + opponentsBlindAmount
			setPot(playersBlindAmount + opponentsBlindAmount)

			setCallAmount(
				isPlayerOnBtnRef.current
					? Math.max(opponentsBlindAmount - SMALL_BLIND, 0)
					: 0
			)

			// Set to true so BB has raise option instead of bet preflop //
			setHasCalledBB(true)

			if (!playersChipsRef.current || !opponentsChipsRef.current) {
				// Player All-In //
				setIsPlayerAllIn(true)
				dealCommunityCards()
			} else {
				// Set turn //
				isTurnRef.current = isPlayerOnBtnRef.current ? true : false
				setShowBettingOptions(isPlayerOnBtnRef.current ? true : false)
			}

			// Set hole cards //
			holeCardsRef.current = holeCards
			setHoleCards(holeCards)
		})

		socket.on('dealFlop', (flop) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'flop'

			// Reset hasCalledBBRef variable //
			setHasCalledBB(false)

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

		socket.on('check', () =>
			isRoundOver('check') ? dealNextCard() : alternateTurn()
		)

		socket.on('call', (callAmount) => {
			if (!isMounted) return null

			// Add chips from players chip total to pot total //
			if (isTurnRef.current) {
				// Current Player is calling //
				playersChipsRef.current -= callAmount
				setPlayersChips((chips) => chips - callAmount)
			} else {
				// Opponent is calling //
				opponentsChipsRef.current -= callAmount
				setOpponentsChips((chips) => chips - callAmount)
			}

			potRef.current += callAmount
			setPot((pot) => pot + callAmount)

			setCallAmount(0)

			// Deal all cards if player is all-in //
			if (!playersChipsRef.current || !opponentsChipsRef.current) {
				isPlayerAllInRef.current = true
				setShowBettingOptions(false)

				return dealCommunityCards()
			}

			isRoundOver('call') ? dealNextCard() : alternateTurn()

			hasCalledSBRef.current = true
		})

		socket.on('bet', (betAmount) => {
			if (!isMounted) return null

			if (
				playersChipsRef.current <= betAmount ||
				opponentsChipsRef.current <= betAmount
			)
				setIsPlayerAllIn(true)

			if (isTurnRef.current) {
				// Current Player is betting //
				playersChipsRef.current -= betAmount
				setPlayersChips((chips) => chips - betAmount)
			} else {
				// Opponent is betting //
				opponentsChipsRef.current -= betAmount
				setOpponentsChips((chips) => chips - betAmount)

				setCallAmount(betAmount)
			}

			potRef.current = potRef.current + betAmount
			setPot((pot) => pot + betAmount)

			alternateTurn()
		})

		socket.on('raise', ({ callAmount, raiseAmount }) => {
			if (!isMounted) return null

			const totalBetSize = callAmount + raiseAmount

			if (
				playersChipsRef.current <= totalBetSize ||
				opponentsChipsRef.current <= totalBetSize
			)
				setIsPlayerAllIn(true)

			// All calls but first SB call end betting round //
			hasCalledSBRef.current = true

			if (isTurnRef.current) {
				// Current Player is raising //
				playersChipsRef.current -= callAmount + raiseAmount
				setPlayersChips((chips) => chips - callAmount - raiseAmount)
			} else {
				// Opponent is raising //
				opponentsChipsRef.current -= callAmount + raiseAmount
				setOpponentsChips((chips) => chips - callAmount - raiseAmount)

				setCallAmount(raiseAmount)
			}

			potRef.current = potRef.current + callAmount + raiseAmount
			setPot((pot) => pot + callAmount + raiseAmount)

			alternateTurn()
		})

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

			if (currentPlayer.isPlayerOne)
				socket.emit('determineWinner', {
					playerOnesHand,
					playerTwosHand,
				})
		})

		socket.on('handResults', ({ winningPlayer, isDraw }) => {
			if (!isMounted) return null

			setShowBettingOptions(false)
			setShowHands(true)

			if (isDraw) {
				// Split pot between players //
				const halfPot = potRef.current / 2

				playersChipsRef.current += halfPot
				setPlayersChips((chips) => chips + halfPot)

				opponentsChipsRef.current += halfPot
				setOpponentsChips((chips) => chips + halfPot)
			} else if (
				(winningPlayer === 'playerOne' && currentPlayer.isPlayerOne) ||
				(winningPlayer !== 'playerOne' && !currentPlayer.isPlayerOne)
			) {
				// Player Won //
				playersChipsRef.current += potRef.current
				setPlayersChips((chips) => chips + potRef.current)
			} else {
				// Opponent Won //
				opponentsChipsRef.current += potRef.current
				setOpponentsChips((chips) => chips + potRef.current)
			}

			setTimeout(() => {
				// Reset game variables //
				isPlayerOnBtnRef.current = !isPlayerOnBtnRef.current
				isTurnRef.current = false
				setShowBettingOptions(false)
				holeCardsRef.current = []
				setHoleCards(null)
				setOpponentsHoleCards(null)
				communityCardsRef.current = null
				setCommunityCards([])
				potRef.current = 0
				setPot(0)
				setCallAmount(0)
				isPlayerAllInRef.current = false
				setIsPlayerAllIn(false)
				setShowHands(false)
				hasCalledSBRef.current = false
			}, 3000)

			if (currentPlayer.isPlayerOne) setTimeout(() => socket.emit('deal'), 4500)
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
							<PlayersHud
								playersName={opponentsName}
								chips={opponentsChips}
								hasWon={hasWon}
							/>
						</div>
						<div className={classes.pot}>
							<h2 className={classes.potText}>Pot: ${pot}</h2>
						</div>
						<CommunityCards communityCards={communityCards} />
						<div style={{ flex: 1 }}></div>
						<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
							<HoleCards holeCards={holeCards} />
							<PlayersHud
								playersName={playersName}
								chips={playersChips}
								hasWon={hasWon}
							/>
						</div>
						{showBettingOptions && (
							<BettingOptions
								playersChips={playersChips}
								opponentsChips={opponentsChips}
								callAmount={callAmount}
								isPlayerAllIn={isPlayerAllIn}
								hasCalledBB={hasCalledBB}
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
