import { useState, useEffect, useContext, useRef } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { Box, Button, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from '../../contexts/AuthContext'
import SocketContext from '../../contexts/SocketContext'
import BettingOptions from './BettingOptions'
import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'
import PlayersHud from './PlayersHud'
import WinDisplay from './WinDisplay'
import Timer from './Timer'
import Chat from '../Chat/Chat'
import Options from './Options'
import woodenFloor from '../../assets/images/floors/wooden-floor.png'
import greenTable from '../../assets/images/tables/green-table.png'
import betRaiseCallAlert from '../../assets/sounds/bet-raise-call-alert.wav'
import checkAlert from '../../assets/sounds/check-alert.wav'
import dealCard from '../../assets/sounds/deal-card.wav'
import dealCards from '../../assets/sounds/deal-cards.wav'
import foldAlert from '../../assets/sounds/fold-alert.wav'
import winGame from '../../assets/sounds/win-game.wav'
import winHand from '../../assets/sounds/win-hand.wav'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		userSelect: 'none',
	},
	floorBackground: { width: '100%' },
	pokerTable: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '100%',
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
	playersHud: {
		position: 'absolute',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '25%',
		height: '10%',
	},
	waitingDisplay: {
		position: 'absolute',
		top: '48.8%',
		left: '50%',
		transform: 'translate(-50%, -120%)',
		width: '30vw',
	},
	waitingText: {
		margin: 'auto',
		padding: '.8vw',
		fontSize: '1.7vw',
		textAlign: 'center',
		'&::after': {
			overflow: 'hidden',
			display: 'inline-block',
			width: 0,
			verticalAlign: 'bottom',
			animation: '$loading-ellipsis 3s steps(4, end) infinite',
			content: "'...'",
		},
	},
	opponentLeftText: {
		margin: 'auto',
		padding: '.8vw',
		fontSize: '1.7vw',
		textAlign: 'center',
	},
	winningHandText: {
		position: 'absolute',
		top: '51%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		fontSize: '1.5vw',
		fontStyle: 'italic',
		borderRadius: '1vw',
		animation: '$tracking-in-expand-fwd .8s both',
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
	dealerBtnText: { fontSize: '.6vw' },
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
	top: { top: '22%' },
	bottom: { top: '70%' },
	'@keyframes loading-ellipsis': {
		to: { width: 'clamp(18px, 2.05vw, 27px)' },
	},
	'@keyframes tracking-in-expand-fwd': {
		'0%': {
			letterSpacing: '-0.5em',
			opacity: 0,
		},
		'40%': {
			opacity: '0.6',
		},
		'100%': {
			opacity: 1,
		},
	},
	'@media screen and (min-width: 768px)': {
		screenOrientationWarning: {
			display: 'none',
		},
	},
	'@media screen and (max-width: 767px)': {
		screenOrientationWarning: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: '80%',
			'& h2': {
				fontSize: '5vw',
				textAlign: 'center',
			},
		},
	},
})

const SMALL_BLIND = 10
const BIG_BLIND = 20
const TIMER = 100

const PokerRoom = () => {
	const classes = useStyles()

	const { roomId } = useParams()

	const { isLoggedIn } = useContext(AuthContext)
	const { socket } = useContext(SocketContext)

	const _isMounted = useRef(true)

	// Display variables //
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [floorOption, setFloorOption] = useState(woodenFloor)
	const [tableOption, setTableOption] = useState(greenTable)
	const [deckOption, setDeckOption] = useState('red-design')
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
	const [showWinDisplay, setShowWinDisplay] = useState(false)
	const [isTurn, setIsTurn] = useState(false)
	const [resetTimer, setResetTimer] = useState(true)
	const [isPlayerAllIn, setIsPlayerAllIn] = useState(false)
	const [hasCalledBB, setHasCalledBB] = useState(false)
	const [showHands, setShowHands] = useState(false)
	const [winner, setWinner] = useState('')
	const [winningHand, setWinningHand] = useState('')
	const [redirectToLobby, setRedirectToLobby] = useState(false)
	const [hasOpponentLeft, setHasOpponentLeft] = useState(false)

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

	useEffect(() => {
		socket.connect()

		// Get Player Info //
		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		currentPlayer.isPlayerOne = currentPlayer.id === roomId
		isPlayerOnBtnRef.current = currentPlayer.isPlayerOne ? true : false

		// Initialize game sounds //
		const betRaiseCallAlertAudio = new Audio(betRaiseCallAlert)
		const checkAlertAudio = new Audio(checkAlert)
		const dealCardAudio = new Audio(dealCard)
		const dealCardsAudio = new Audio(dealCards)
		const foldAlertAudio = new Audio(foldAlert)
		const winGameAudio = new Audio(winGame)
		const winHandAudio = new Audio(winHand)

		dealCardAudio.volume = 0.2

		const alternateTurn = () => {
			isTurnRef.current = !isTurnRef.current
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(TIMER)
		}

		const setTurn = () => {
			setIsTurn(null) // Allows timer bar display to dissapear //

			isTurnRef.current =
				!isPlayerAllInRef.current && !isPlayerOnBtnRef.current ? true : false
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(TIMER)
		}

		const showActionDisplay = ({
			type,
			winningPlayer,
			losingPlayer,
			value = 0,
		}) => {
			if (type === 'DRAW') {
				setPlayersAction({ type, value })
				setOpponentsAction({ type, value })
			} else if (type === 'WINNER') {
				winningPlayer === currentPlayer.username ||
				(losingPlayer && losingPlayer !== currentPlayer.username)
					? setPlayersAction({ type, value })
					: setOpponentsAction({ type, value })
			} else {
				isTurnRef.current
					? setPlayersAction({ type, value })
					: setOpponentsAction({ type, value })
			}

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
			setTimeout(() => {
				switch (bettingRoundRef.current) {
					case 'preflop':
						if (currentPlayer.isPlayerOne) socket.emit('deal-flop')
						dealCardAudio.play()
						break
					case 'flop':
						if (currentPlayer.isPlayerOne) socket.emit('deal-turn')
						dealCardAudio.play()
						break
					case 'turn':
						if (currentPlayer.isPlayerOne) socket.emit('deal-river')
						dealCardAudio.play()
						break
					default:
						if (currentPlayer.isPlayerOne) socket.emit('hand-is-over')
				}
			}, 1000)
		}

		const dealCommunityCards = () => {
			switch (bettingRoundRef.current) {
				case 'preflop':
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-flop'),
						1500
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-turn'),
						3000
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-river'),
						4500
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('hand-is-over'),
						6000
					)
					break
				case 'flop':
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-turn'),
						1500
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-river'),
						3000
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('hand-is-over'),
						4500
					)
					break
				case 'turn':
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('deal-river'),
						1500
					)
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('hand-is-over'),
						3000
					)
					break
				default:
					setTimeout(
						() => currentPlayer.isPlayerOne && socket.emit('hand-is-over'),
						1500
					)
			}
		}

		// Join socket to the room //
		socket.emit('enter-poker-room', { roomId, currentPlayer })

		// Listen for opponent to enter the room //
		socket.once('start-game', () => socket.emit('get-players-info'))

		socket.once('get-players-info', ({ username }) => {
			if (!_isMounted.current) return null

			setPlayersName(currentPlayer.username)
			setOpponentsName(username)
			setStartGame(true)

			// Player 1 emits deal to server //
			if (currentPlayer.isPlayerOne) socket.emit('deal')
		})

		socket.on('deal-preflop', (holeCards) => {
			if (!_isMounted.current) return null

			dealCardsAudio.play()

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
			if (!_isMounted.current) return null

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
			if (!_isMounted.current) return null

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
			if (!_isMounted.current) return null

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
			if (!_isMounted.current) return null

			showActionDisplay({ type: 'CHECK' })

			// Play check audio //
			checkAlertAudio.play()

			isRoundOver('check') ? dealNextCard() : alternateTurn()
		})

		socket.on('call', (callAmount) => {
			if (!_isMounted.current) return null

			showActionDisplay({ type: 'CALL' })

			// Play call audio //
			betRaiseCallAlertAudio.play()

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
			if (!_isMounted.current) return null

			showActionDisplay({ type: 'BET', value: betAmount })

			// Play bet audio //
			betRaiseCallAlertAudio.play()

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
			if (!_isMounted.current) return null

			showActionDisplay({ type: 'RAISE', value: raiseAmount })

			// Play raise audio //
			betRaiseCallAlertAudio.play()

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

		socket.on('fold', () => {
			showActionDisplay({ type: 'FOLD' })

			// Play fold audio //
			foldAlertAudio.play()
		})

		socket.on('hand-is-over', () =>
			socket.emit('showdown', holeCardsRef.current)
		)

		socket.on(
			'determine-winner',
			({ username: opponentsName, holeCards: opponentsCards }) => {
				if (!_isMounted.current) return null

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
						opponentsName,
						playerOnesHand,
						playerTwosHand,
					})
			}
		)

		socket.on(
			'hand-results',
			({ winningPlayer, losingPlayer, winningHand, isDraw }) => {
				if (!_isMounted.current) return null

				setIsTurn(false)
				setShowHands(true)

				if (isDraw) {
					// Split pot between players //
					const halfPot = potRef.current / 2

					playersChipsRef.current += halfPot
					setPlayersChips((chips) => chips + halfPot)

					opponentsChipsRef.current += halfPot
					setOpponentsChips((chips) => chips + halfPot)
				} else if (
					winningPlayer === currentPlayer.username ||
					(losingPlayer && losingPlayer !== currentPlayer.username)
				) {
					// Player Won //
					playersChipsRef.current += potRef.current
					setPlayersChips((chips) => chips + potRef.current)

					// Play win-hand audio //
					winHandAudio.play()
				} else {
					// Opponent Won //
					opponentsChipsRef.current += potRef.current
					setOpponentsChips((chips) => chips + potRef.current)
				}

				showActionDisplay({
					type: isDraw ? 'DRAW' : 'WINNER',
					winningPlayer,
					losingPlayer,
				})
				setWinningHand(winningHand)

				// Send players to lobby if game is over //
				if (!playersChipsRef.current || !opponentsChipsRef.current) {
					// Display winner banner //
					setWinner(winningPlayer)
					setTimeout(() => setShowWinDisplay(true), 2000)
					setTimeout(() => setRedirectToLobby(true), 8000)

					winGameAudio.play()

					return
				}

				// Deal next hand //
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

				if (currentPlayer.isPlayerOne)
					setTimeout(() => socket.emit('deal'), 4500)
			}
		)

		socket.on('opponent-left-game', () => {
			if (!_isMounted.current) return null

			setHasOpponentLeft(true)
			setTimeout(() => setRedirectToLobby(true), 2000)
		})

		// Cancel subscription to useEffect //
		return () => {
			_isMounted.current = false

			socket.emit('logout', currentPlayer.id)
			socket.offAny()
		}
	}, [socket, roomId])

	if (!isLoggedIn || redirectToLobby) return <Redirect to='/lobby' />

	return (
		<div className={classes.root}>
			{/* ---------- Nav Links ---------- */}
			<Box
				display='flex'
				justifyContent='flex-end'
				className={classes.navBtnGroup}>
				<Button variant='contained' onClick={() => setRedirectToLobby(true)}>
					Lobby
				</Button>
				<Options
					setFloorOption={setFloorOption}
					setTableOption={setTableOption}
					setDeckOption={setDeckOption}
				/>
			</Box>
			<img
				src={floorOption}
				className={classes.floorBackground}
				draggable='false'
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
					{/* ---------- Dealer Button ---------- */}
					<div
						className={classes.dealerBtn}
						style={{ top: !isPlayerOnBtnRef.current ? '29%' : '55%' }}>
						<p className={classes.dealerBtnText}>DEALER</p>
					</div>

					{/* ---------- Opponents HUD ---------- */}
					<div className={`${classes.playersHud} ${classes.top}`}>
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

					{/* ---------- Pot Total ---------- */}
					<div className={classes.pot}>
						<h2 className={classes.potText}>Pot: {`$${pot}`}</h2>
					</div>

					{/* ---------- Community Cards ---------- */}
					<CommunityCards
						communityCards={communityCards}
						deckOption={deckOption}
					/>

					{/* ---------- Players HUD ---------- */}
					<div className={`${classes.playersHud} ${classes.bottom}`}>
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

			{/* ---------- Winning Hand Display ---------- */}
			{winningHand && (
				<h2 className={classes.winningHandText}>{winningHand}</h2>
			)}

			{/* ---------- Winning Player Display ---------- */}
			{showWinDisplay && <WinDisplay winner={winner} />}

			{/* ---------- Chat and Betting Options ---------- */}
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

			{/* ---------- Screen Orientation Warning ---------- */}
			<Paper className={classes.screenOrientationWarning} elevation={6}>
				<h2>Rotate device to landscape mode</h2>
			</Paper>

			{/* ---------- Opponent Left Notification ---------- */}
			{hasOpponentLeft && (
				<Paper className={classes.waitingDisplay} elevation={6}>
					<h2 className={classes.opponentLeftText}>Opponent left game</h2>
				</Paper>
			)}
		</div>
	)
}

export default PokerRoom
