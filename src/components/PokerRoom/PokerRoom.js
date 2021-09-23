import { useState, useEffect, useRef } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { Box, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import BettingOptions from './BettingOptions'
import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'
import PlayersHud from './PlayersHud'
import Timer from './Timer'
import Chat from '../Chat/Chat'
import Options from './Options'
// import OptionsDialog from './OptionsDialog'
import woodenFloor from '../../assets/images/floors/wooden-floor.png'
import greenTable from '../../assets/images/tables/green-table.png'
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
// 2. Add sound
// 3. socket.handshake
// 4. useMemo for setting playersChips?
// 5. is isLogin enough for security or should I use socket.auth?
// 6. remove select text on all pages
// 7. make pips larger for chrome
// maybe cut off sides with minWidth or maxWidth
// display draws
// setTimeout for drawing cards
// didn't recognize straight

const useStyles = makeStyles({
	root: {
		position: 'relative',
		userSelect: 'none',
	},
	floorBackground: {
		width: '100%',
	},
	pokerTable: {
		width: '100%',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
	tableContainer: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		height: '75%',
	},
	hudContainer: {
		position: 'absolute',
		bottom: '4%',
		left: '.5%',
		width: '100%',
		padding: 0,
	},
	waitingDisplay: {
		position: 'absolute',
		top: '48.8%',
		left: '50%',
		width: '35%',
		transform: 'translate(-50%, -120%)',
		borderRadius: '.45vw',
	},
	waitingText: {
		margin: 'auto',
		padding: '2%',
		fontSize: '1.7vw',
		textAlign: 'center',
		'&::after': {
			overflow: 'hidden',
			display: 'inline-block',
			width: 0,
			verticalAlign: 'bottom',
			animation: '$loading-ellipsis steps(4, end) 3s infinite',
			content: "'...'",
		},
	},
	// handResultDisplay: {
	// 	position: 'absolute',
	// 	top: '50%',
	// 	left: '50%',
	// 	width: '40%',
	// 	background: 'rgba(255, 255, 255, 0.5)',
	// 	transform: 'translate(-50%, -50%)',
	// 	borderRadius: '10px',
	// },
	handResultText: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		color: 'white',
		fontFamily: 'Arial',
		fontSize: '2.3vw',
		fontWeight: '100',
		textAlign: 'center',
	},
	pot: {
		position: 'absolute',
		top: '35%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
	potText: {
		background: 'rgba(0, 0, 0, 0.4)',
		padding: '.4vw',
		color: 'white',
		fontSize: '1.5vw',
		borderRadius: '10px',
	},
	playersHudContainer: {
		position: 'absolute',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '25%',
		height: '10%',
	},
	dealerBtn: {
		position: 'absolute',
		left: '40%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '2vw',
		height: '2vw',
		padding: 5,
		background: 'white',
		border: '.08vw solid black',
		borderRadius: '50%',
	},
	dealerBtnText: {
		fontSize: '.6vw',
	},
	navBtnGroup: {
		position: 'absolute',
		right: 0,
		zIndex: 1,
		display: 'flex',
		justifyContent: 'flex-end',
		margin: '.5vw',
		'& button': {
			fontSize: '1.2vw',
			cursor: 'pointer',
		},
	},
	top: {
		top: '22%',
	},
	bottom: {
		top: '70%',
	},
	'@keyframes loading-ellipsis': {
		to: {
			width: '1em',
		},
	},
})

const SMALL_BLIND = 10
const BIG_BLIND = 20
const TIMER = 100

const PokerRoom = ({ isLoggedIn, setIsLoggedIn }) => {
	////////////// TURN REDIRECT BACK ON //////////////
	const classes = useStyles()
	const { roomId } = useParams()

	// Display variables //
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [floorOption, setFloorOption] = useState(woodenFloor)
	const [tableOption, setTableOption] = useState(greenTable)
	const [deckOption, setDeckOption] = useState('black')
	const [timeLeft, setTimeLeft] = useState(100)
	const [playersAction, setPlayersAction] = useState('')
	const [opponentsAction, setOpponentsAction] = useState('')

	// Gameplay variables //
	const bettingRoundRef = useRef(null)
	const isPlayerOnBtnRef = useRef(null)
	const isTurnRef = useRef(null)
	const isPlayerAllInRef = useRef(false)
	const hasCalledSBRef = useRef(false)
	const [startGame, setStartGame] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [isTurn, setIsTurn] = useState(false)
	const [resetTimer, setResetTimer] = useState(true)
	const [isPlayerAllIn, setIsPlayerAllIn] = useState(false)
	const [hasCalledBB, setHasCalledBB] = useState(false)
	const [showHands, setShowHands] = useState(false)
	const [winningHand, setWinningHand] = useState('')
	const [redirectToLobby, setRedirectToLobby] = useState(false)

	// Cards //
	const holeCardsRef = useRef({})
	const communityCardsRef = useRef([])
	const [holeCards, setHoleCards] = useState([])
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
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(TIMER)
		}

		const setTurn = () => {
			setIsTurn(null) // allows timer bar display to dissapear //

			isTurnRef.current =
				!isPlayerAllInRef.current && !isPlayerOnBtnRef.current ? true : false
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(TIMER)
		}

		const showActionDisplay = (type, value = 0) => {
			isTurnRef.current
				? setPlayersAction({ type, value })
				: setOpponentsAction({ type, value })

			setTimeout(() => {
				setPlayersAction({ type: '', value: 0 })
				setOpponentsAction({ type: '', value: 0 })
			}, 2000)
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
					if (currentPlayer.isPlayerOne) socket.emit('deal-flop')
					break
				case 'flop':
					if (currentPlayer.isPlayerOne) socket.emit('deal-turn')
					break
				case 'turn':
					if (currentPlayer.isPlayerOne) socket.emit('deal-river')
					break
				default:
					if (currentPlayer.isPlayerOne) socket.emit('hand-is-over')
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
		socket.emit('enter-poker-room', { roomId, currentPlayer })

		// Listen for opponent to enter the room //
		socket.once('start-game', () =>
			socket.emit('get-players-info', currentPlayer)
		)

		socket.once('get-players-info', ({ username }) => {
			if (!isMounted) return null

			setPlayersName(currentPlayer.username)
			setOpponentsName(username)
			setStartGame(true)

			// Player 1 emits deal to server //
			if (currentPlayer.isPlayerOne) socket.emit('deal')
		})

		socket.on('deal-preflop', (holeCards) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'preflop'

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
				setIsTurn(isPlayerOnBtnRef.current ? true : false)
			}

			// Set hole cards //
			holeCardsRef.current = holeCards
			setHoleCards(holeCards)
		})

		socket.on('deal-flop', (flop) => {
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

		socket.on('deal-turn', (turn) => {
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

		socket.on('deal-river', (river) => {
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

		socket.on('check', () => {
			showActionDisplay('CHECK')
			isRoundOver('check') ? dealNextCard() : alternateTurn()
		})

		socket.on('call', (callAmount) => {
			if (!isMounted) return null

			showActionDisplay('CALL')

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
				setIsTurn(false)

				return dealCommunityCards()
			}

			isRoundOver('call') ? dealNextCard() : alternateTurn()

			hasCalledSBRef.current = true
		})

		socket.on('bet', (betAmount) => {
			if (!isMounted) return null

			showActionDisplay('BET', betAmount)

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

			showActionDisplay('RAISE', raiseAmount)

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

		socket.on('hand-is-over', () =>
			socket.emit('showdown', holeCardsRef.current)
		)

		socket.on('determine-winner', (opponentsCards) => {
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
				socket.emit('determine-winner', {
					playerOnesHand,
					playerTwosHand,
				})
		})

		socket.on('hand-results', ({ winningPlayer, winningHand, isDraw }) => {
			if (!isMounted) return null

			setIsTurn(false)
			setShowHands(true)

			if (isDraw) {
				// Split pot between players //
				const halfPot = potRef.current / 2

				playersChipsRef.current += halfPot
				setPlayersChips((chips) => chips + halfPot)

				opponentsChipsRef.current += halfPot
				setOpponentsChips((chips) => chips + halfPot)

				showActionDisplay('DRAW')
				setWinningHand('DRAW')
			} else if (
				(winningPlayer === 'playerOne' && currentPlayer.isPlayerOne) ||
				(winningPlayer !== 'playerOne' && !currentPlayer.isPlayerOne)
			) {
				// Player Won //
				playersChipsRef.current += potRef.current
				setPlayersChips((chips) => chips + potRef.current)
				setPlayersAction({ type: 'WINNER', value: 0 })
			} else {
				// Opponent Won //
				opponentsChipsRef.current += potRef.current
				setOpponentsChips((chips) => chips + potRef.current)
				setOpponentsAction({ type: 'WINNER', value: 0 })
			}
			setWinningHand(winningHand)

			if (!playersChipsRef.current || !opponentsChipsRef.current)
				setIsGameOver(true)

			setTimeout(() => {
				// Reset game variables //
				isPlayerOnBtnRef.current = !isPlayerOnBtnRef.current
				isTurnRef.current = false
				setIsTurn(false)
				setTimeLeft(100)
				holeCardsRef.current = []
				setHoleCards([])
				setOpponentsHoleCards([])
				communityCardsRef.current = null
				setCommunityCards([])
				potRef.current = 0
				setPot(0)
				setCallAmount(0)
				isPlayerAllInRef.current = false
				setIsPlayerAllIn(false)
				setShowHands(false)
				setWinningHand('')
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

	// if (!isLoggedIn || redirectToLobby || isGameOver)
	// 	return <Redirect to='/lobby' />
	if (redirectToLobby) return <Redirect to='/lobby' />

	return (
		<div className={classes.root}>
			<Box
				display='flex'
				justifyContent='flex-end'
				className={classes.navBtnGroup}>
				<button onClick={() => setRedirectToLobby(true)}>Lobby</button>
				<Options
					setFloorOption={setFloorOption}
					setTableOption={setTableOption}
					setDeckOption={setDeckOption}
				/>
			</Box>

			<img
				src={floorOption}
				className={classes.floorBackground}
				alt='floor background'
			/>
			<img
				src={tableOption}
				className={classes.pokerTable}
				draggable='false'
				alt='poker table'
			/>

			{startGame ? (
				<>
					<div
						className={classes.dealerBtn}
						style={{ top: !isPlayerOnBtnRef.current ? '29%' : '55%' }}>
						<p className={classes.dealerBtnText}>DEALER</p>
					</div>

					<div className={`${classes.playersHudContainer} ${classes.top}`}>
						{showHands ? (
							holeCards && <HoleCards holeCards={opponentsHoleCards} />
						) : (
							<HoleCards deckOption={deckOption} />
						)}
						<PlayersHud
							playersName={opponentsName}
							chips={opponentsChips}
							active={!isTurn}
							action={opponentsAction}
						/>
						{!isTurn && (
							<Timer
								timeLeft={timeLeft}
								setTimeLeft={setTimeLeft}
								resetTimer={resetTimer}
							/>
						)}
					</div>

					<div className={classes.pot}>
						<h2 className={classes.potText}>Pot: ${pot}</h2>
					</div>

					<CommunityCards
						communityCards={communityCards}
						deckOption={deckOption}
					/>

					<div className={`${classes.playersHudContainer} ${classes.bottom}`}>
						{holeCards && <HoleCards holeCards={holeCards} />}
						<PlayersHud
							playersName={playersName}
							chips={playersChips}
							active={isTurn}
							action={playersAction}
						/>
						{isTurn && (
							<Timer
								timeLeft={timeLeft}
								setTimeLeft={setTimeLeft}
								resetTimer={resetTimer}
							/>
						)}
					</div>
				</>
			) : (
				<Paper className={classes.waitingDisplay} elevation={6}>
					<h5 className={classes.waitingText}>WAITING FOR OPPONENT</h5>
				</Paper>
			)}

			{winningHand && <h2 className={classes.handResultText}>{winningHand}</h2>}

			<Box display='flex' alignItems='center' className={classes.hudContainer}>
				<Grid item xs={6}>
					<Chat />
				</Grid>
				<Grid item xs={6}>
					<div>
						{isTurn && (
							<BettingOptions
								playersChips={playersChips}
								opponentsChips={opponentsChips}
								callAmount={callAmount}
								isPlayerAllIn={isPlayerAllIn}
								hasCalledBB={hasCalledBB}
								timeLeft={timeLeft}
							/>
						)}
					</div>
				</Grid>
			</Box>
		</div>
	)
}

export default PokerRoom
