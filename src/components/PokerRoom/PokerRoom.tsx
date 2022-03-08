import { useRef, useState, useContext, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { Box, Button, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AuthContext from '../../contexts/AuthContext'
import PlayerContext from '../../contexts/PlayerContext'
import SocketContext from '../../contexts/SocketContext'
import useActionReducer, { ActionType } from '../../hooks/useActionReducer'
import useAudio from './useAudio'
import PlayerActions from './PlayerActions'
import CommunityCards from './CommunityCards'
import HoleCards, { IHoleCards } from './HoleCards'
import { ICard } from './Card'
import PlayersHud from './PlayersHud'
import WinDisplay from './WinDisplay'
import Timer from './Timer'
import Chat from '../Chat/Chat'
import Options from './DisplayOptions'
import woodenFloor from '../../assets/images/floors/wooden-floor.png'
import greenTable from '../../assets/images/tables/green-table.png'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		userSelect: 'none',
	},
	floorBackground: {
		width: '100%',
	},
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
		right: 0,
		zIndex: 1,
		margin: '.5vw',
		'& button': {
			fontSize: '1.2vw',
			padding: '.5vw',
		},
	},
	leaveGameBtn: {
		border: '.12vw solid transparent',
		'&:hover': {
			color: 'red',
			border: '.12vw solid red',
		},
	},
	top: {
		top: '22%',
	},
	bottom: {
		top: '70%',
	},
	screenOrientationWarning: {
		display: 'none',
	},
	'@keyframes loading-ellipsis': {
		to: {
			width: 'clamp(18px, 2.05vw, 27px)',
		},
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

export const STARTING_CHIP_STACK = 10000
const SMALL_BLIND = 10
const BIG_BLIND = 20

const PokerRoom = () => {
	const classes = useStyles()

	const { roomId } = useParams<{ roomId: string }>()

	const { isLoggedIn } = useContext(AuthContext)
	const { player } = useContext(PlayerContext)
	const { socket } = useContext(SocketContext)

	const [state, dispatch] = useActionReducer()

	// Display variables //
	const [opponentsName, setOpponentsName] = useState('')
	const [floorOption, setFloorOption] = useState(woodenFloor)
	const [tableOption, setTableOption] = useState(greenTable)
	const [deckOption, setDeckOption] = useState('red-design')
	const [timeLeft, setTimeLeft] = useState(100)
	const [playersAction, setPlayersAction] = useState({ type: '', value: 0 })
	const [opponentsAction, setOpponentsAction] = useState({ type: '', value: 0 })

	// Gameplay variables //
	const bettingRoundRef = useRef('')
	const isPlayerOnBtnRef = useRef(false)
	const isTurnRef = useRef(false)
	const isPlayerAllInRef = useRef(false)
	const hasCalledSBRef = useRef(false)
	const [startGame, setStartGame] = useState(false)
	const [showWinDisplay, setShowWinDisplay] = useState(false)
	const [isTurn, setIsTurn] = useState<boolean | null>(false)
	const [resetTimer, setResetTimer] = useState(true)
	const [isPlayerAllIn, setIsPlayerAllIn] = useState(false)
	const [hasCalledBB, setHasCalledBB] = useState(false)
	const [showHands, setShowHands] = useState(false)
	const [winner, setWinner] = useState('')
	const [winningHand, setWinningHand] = useState('')
	const [redirectToLobby, setRedirectToLobby] = useState(false)
	const [hasOpponentLeft, setHasOpponentLeft] = useState(false)

	// Cards //
	const holeCardsRef = useRef<IHoleCards | []>([])
	const communityCardsRef = useRef<ICard[] | []>([])
	const [holeCards, setHoleCards] = useState<IHoleCards | []>([])
	const [opponentsHoleCards, setOpponentsHoleCards] = useState<IHoleCards | []>(
		[]
	)
	const [communityCards, setCommunityCards] = useState<ICard[] | []>([])

	// Chips //
	const playersChipsRef = useRef(STARTING_CHIP_STACK)
	const opponentsChipsRef = useRef(STARTING_CHIP_STACK)
	const potRef = useRef(0)

	// Sounds //
	const {
		betRaiseCallAlertAudio,
		checkAlertAudio,
		dealCardAudio,
		dealCardsAudio,
		foldAlertAudio,
		winHandAudio,
		winGameAudio,
	} = useAudio()

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket.connect()

		const isPlayerOne = player.id === +roomId
		isPlayerOnBtnRef.current = isPlayerOne ? true : false

		const alternateTurn = () => {
			isTurnRef.current = !isTurnRef.current
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(100)
		}

		const setTurn = () => {
			setIsTurn(null) // Allows timer bar display to dissapear //

			isTurnRef.current =
				!isPlayerAllInRef.current && !isPlayerOnBtnRef.current ? true : false
			setIsTurn(isTurnRef.current)

			// Reset timer //
			setResetTimer((timer) => !timer)
			setTimeLeft(100)
		}

		const showActionDisplay = ({
			type,
			winningPlayer,
			losingPlayer,
			value = 0,
		}: {
			type: string
			winningPlayer?: string
			losingPlayer?: string
			value?: number
		}) => {
			if (type === 'DRAW') {
				setPlayersAction({ type, value })
				setOpponentsAction({ type, value })
			} else if (type === 'WINNER') {
				winningPlayer === player.username ||
				(losingPlayer && losingPlayer !== player.username)
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

		const isRoundOver = (action: string) =>
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
						if (isPlayerOne) socket.emit('deal-flop', true)

						dealCardAudio.play()
						break
					case 'flop':
						if (isPlayerOne) socket.emit('deal-turn', true)
						dealCardAudio.play()
						break
					case 'turn':
						if (isPlayerOne) socket.emit('deal-river', true)
						dealCardAudio.play()
						break
					default:
						if (isPlayerOne) socket.emit('hand-is-over')
				}
			}, 1000)
		}

		const dealCommunityCards = () => {
			switch (bettingRoundRef.current) {
				case 'preflop':
					setTimeout(() => isPlayerOne && socket.emit('deal-flop', true), 1500)
					setTimeout(() => isPlayerOne && socket.emit('deal-turn', true), 3000)
					setTimeout(() => isPlayerOne && socket.emit('deal-river', true), 4500)
					setTimeout(() => isPlayerOne && socket.emit('hand-is-over'), 6000)
					break
				case 'flop':
					setTimeout(() => isPlayerOne && socket.emit('deal-turn'), 1500)
					setTimeout(() => isPlayerOne && socket.emit('deal-river'), 3000)
					setTimeout(() => isPlayerOne && socket.emit('hand-is-over'), 4500)
					break
				case 'turn':
					setTimeout(() => isPlayerOne && socket.emit('deal-river'), 1500)
					setTimeout(() => isPlayerOne && socket.emit('hand-is-over'), 3000)
					break
				default:
					setTimeout(() => isPlayerOne && socket.emit('hand-is-over'), 1500)
			}
		}

		// Join socket to the room //
		socket.emit('enter-poker-room', { roomId, player })

		// Listen for opponent to enter the room //
		socket.once('start-game', () => socket.emit('get-players-info'))

		socket.once('get-players-info', ({ username }: { username: string }) => {
			if (!isMounted) return null

			setOpponentsName(username)
			setStartGame(true)

			// Player 1 emits deal to server //
			if (isPlayerOne) socket.emit('deal')
		})

		socket.on('deal-preflop', (holeCards: IHoleCards) => {
			if (!isMounted) return null

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
			const callAmount = isPlayerOnBtnRef.current
				? Math.max(opponentsBlindAmount - SMALL_BLIND, 0)
				: 0

			playersChipsRef.current -= playersBlindAmount
			opponentsChipsRef.current -= opponentsBlindAmount
			potRef.current = playersBlindAmount + opponentsBlindAmount

			dispatch({
				type: ActionType.postBlinds,
				playersBlindAmount,
				opponentsBlindAmount,
				callAmount,
			})

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

		socket.on('deal-flop', (flop: [ICard, ICard, ICard]) => {
			if (!isMounted) return null

			bettingRoundRef.current = 'flop'

			// Reset hasCalledBB variable //
			setHasCalledBB(false)

			// Add Flop cards to communityCards //
			communityCardsRef.current = flop
			setCommunityCards(flop)

			// Set turn //
			setTurn()
		})

		socket.on('deal-turn', (turn: [ICard]) => {
			if (!isMounted) return null

			// Change betting round to turn //
			bettingRoundRef.current = 'turn'

			communityCardsRef.current = [...communityCardsRef.current, turn[0]]
			setCommunityCards((prevCommunityCards: ICard[]) => [
				...prevCommunityCards,
				turn[0],
			])

			// Set turn //
			setTurn()
		})

		socket.on('deal-river', (river: [ICard]) => {
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
			if (!isMounted) return null

			showActionDisplay({ type: 'CHECK' })

			// Play check audio //
			checkAlertAudio.play()

			isRoundOver('check') ? dealNextCard() : alternateTurn()
		})

		socket.on('call', (callAmount: number) => {
			if (!isMounted) return null

			showActionDisplay({ type: 'CALL' })

			// Play call audio //
			betRaiseCallAlertAudio.play()

			// Add chips from players chip total to pot total //
			if (isTurnRef.current) {
				// Current Player is calling //
				playersChipsRef.current -= callAmount
				dispatch({ type: ActionType.playerCalls })
			} else {
				// Opponent is calling //
				opponentsChipsRef.current -= callAmount
				dispatch({ type: ActionType.opponentCalls })
			}

			potRef.current += callAmount

			// Deal all cards if player is all-in //
			if (!playersChipsRef.current || !opponentsChipsRef.current) {
				isPlayerAllInRef.current = true
				setIsTurn(false)

				return dealCommunityCards()
			}

			isRoundOver('call') ? dealNextCard() : alternateTurn()

			hasCalledSBRef.current = true
		})

		socket.on(
			'bet-or-raise',
			({
				betAmount,
				callAmount,
				raiseAmount,
			}: {
				betAmount: number
				callAmount: number
				raiseAmount: number
			}) => {
				if (!isMounted) return null

				const isRaise = !betAmount

				const totalBetSize = isRaise ? callAmount + raiseAmount : betAmount

				showActionDisplay({
					type: isRaise ? 'RAISE' : 'BET',
					value: totalBetSize,
				})

				// Play bet audio //
				betRaiseCallAlertAudio.play()

				if (
					playersChipsRef.current <= totalBetSize ||
					opponentsChipsRef.current <= totalBetSize
				)
					setIsPlayerAllIn(true)

				// All calls but first SB call end betting round //
				hasCalledSBRef.current = true

				if (isTurnRef.current) {
					// Current Player is betting //
					playersChipsRef.current -= totalBetSize
					dispatch({ type: ActionType.playerBets, betAmount: totalBetSize })
				} else {
					// Opponent is betting //
					opponentsChipsRef.current -= totalBetSize
					dispatch({ type: ActionType.opponentBets, betAmount: totalBetSize })
				}

				potRef.current = potRef.current + totalBetSize

				alternateTurn()
			}
		)

		socket.on('fold', () => {
			showActionDisplay({ type: 'FOLD' })

			// Play fold audio //
			foldAlertAudio.play()

			// Emit deal events to prevent extra emitting next hand //
			switch (bettingRoundRef.current) {
				case 'preflop':
					if (isPlayerOne) socket.emit('deal-flop', false)
					if (isPlayerOne) socket.emit('deal-turn', false)
					if (isPlayerOne) socket.emit('deal-river', false)
					break
				case 'flop':
					if (isPlayerOne) socket.emit('deal-turn', false)
					if (isPlayerOne) socket.emit('deal-river', false)
					break
				case 'turn':
					if (isPlayerOne) socket.emit('deal-river', false)
					break
				default:
					throw new Error()
			}
		})

		socket.on('hand-is-over', () =>
			socket.emit('showdown', holeCardsRef.current)
		)

		socket.on(
			'determine-winner',
			({
				username: opponentsName,
				holeCards: opponentsCards,
			}: {
				username: string
				holeCards: IHoleCards
			}) => {
				if (!isMounted) return null

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

				if (isPlayerOne)
					socket.emit('determine-winner', {
						opponentsName,
						playerOnesHand,
						playerTwosHand,
					})
			}
		)

		socket.on(
			'hand-results',
			({
				winningPlayer,
				losingPlayer,
				winningHand,
				isDraw,
			}: {
				winningPlayer: string
				losingPlayer: string
				winningHand: string
				isDraw: boolean
			}) => {
				if (!isMounted) return null

				setIsTurn(false)
				setShowHands(true)

				if (isDraw) {
					// Split pot between players //
					const halfPot = potRef.current / 2

					playersChipsRef.current += halfPot
					opponentsChipsRef.current += halfPot

					dispatch({ type: ActionType.draw })
				} else if (
					winningPlayer === player.username ||
					(losingPlayer && losingPlayer !== player.username)
				) {
					// Player Won //
					playersChipsRef.current += potRef.current
					dispatch({ type: ActionType.playerWinsHand })

					// Play win-hand audio //
					winHandAudio.play()
				} else {
					// Opponent Won //
					opponentsChipsRef.current += potRef.current
					dispatch({ type: ActionType.opponentWinsHand })
				}

				showActionDisplay({
					type: isDraw ? 'DRAW' : 'WINNER',
					winningPlayer,
					losingPlayer,
				})
				setWinningHand(winningHand)

				if (!playersChipsRef.current || !opponentsChipsRef.current) {
					// Game is over //
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
					communityCardsRef.current = []
					setCommunityCards([])
					potRef.current = 0
					isPlayerAllInRef.current = false
					setIsPlayerAllIn(false)
					setShowHands(false)
					setWinningHand('')
					hasCalledSBRef.current = false
				}, 3000)

				if (isPlayerOne) setTimeout(() => socket.emit('deal'), 4500)
			}
		)

		socket.on('opponent-left-game', () => {
			if (!isMounted) return null

			setHasOpponentLeft(true)
			setTimeout(() => setRedirectToLobby(true), 2000)
		})

		// Emit logout when player exits game //
		window.addEventListener('beforeunload', () =>
			socket.emit('logout', player.id)
		)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false

			socket.emit('logout', player.id)
			socket.offAny()
		}
	}, [
		socket,
		player,
		roomId,
		dispatch,
		betRaiseCallAlertAudio,
		checkAlertAudio,
		dealCardAudio,
		dealCardsAudio,
		foldAlertAudio,
		winHandAudio,
		winGameAudio,
	])

	if (!isLoggedIn || redirectToLobby) return <Redirect to='/lobby' />

	return (
		<div className={classes.root}>
			{/* ---------- Nav Links ---------- */}
			<Box
				display='flex'
				justifyContent='flex-end'
				position='absolute'
				className={classes.navBtnGroup}>
				<Button
					className={classes.leaveGameBtn}
					variant='contained'
					onClick={() => setRedirectToLobby(true)}>
					Leave Game
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
							chips={state.opponentsChips}
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
						<h2 className={classes.potText}>Pot: {`$${state.pot}`}</h2>
					</div>

					{/* ---------- Community Cards ---------- */}
					<CommunityCards communityCards={communityCards} />

					{/* ---------- Players HUD ---------- */}
					<div className={`${classes.playersHud} ${classes.bottom}`}>
						{holeCards && <HoleCards holeCards={holeCards} />}
						<PlayersHud
							playersName={player.username}
							chips={state.playersChips}
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
					<>
						{isTurn && (
							<PlayerActions
								playersChips={state.playersChips}
								opponentsChips={state.opponentsChips}
								pot={state.pot}
								callAmount={state.betAmount}
								isPlayerAllIn={isPlayerAllIn}
								hasCalledBB={hasCalledBB}
								timeLeft={timeLeft}
								setIsTurn={setIsTurn}
							/>
						)}
					</>
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
