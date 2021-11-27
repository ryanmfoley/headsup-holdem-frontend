import { useState, useEffect, useContext, memo } from 'react'
import {
	Box,
	Button,
	ButtonGroup,
	Input,
	Slider,
	Tooltip,
} from '@material-ui/core'
import {
	createTheme,
	ThemeProvider,
	makeStyles,
	withStyles,
} from '@material-ui/core/styles'

import SocketContext from '../../contexts/SocketContext'

const theme = createTheme({
	overrides: {
		MuiButton: {
			label: {
				flexDirection: 'column',
			},
		},
	},
})

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		right: '5%',
		bottom: '10%',
		display: 'flex',
		flexDirection: 'column',
		width: '33%',
		'& p': {
			fontSize: '1vw',
			color: 'white',
		},
	},
	input: {
		width: '7vw',
		color: 'white',
		marginLeft: '1vw',
		paddingLeft: '.5vw',
		background: 'rgba(0, 0, 0, 0.8)',
		fontSize: '1.3vw',
		borderRadius: '.8vw',
	},
	actionBtn: {
		borderRadius: '5px',
		padding: '1vw',
		boxShadow: 'inset 0px 1px 0px gray',
		background:
			'-webkit-gradient(linear, left top, left bottom, from(#000), to(#333))',
		borderBottom: '3px solid transparent',
		'& p': {
			fontSize: '12px',
			margin: 0,
		},
	},
	betSizingBtn: {
		boxShadow: 'inset 0px 1px 0px gray',
		background:
			'-webkit-linear-gradient(top,  #000, #222 15%, #333 28%, #000  63%, #2f2f2f 87%, #000)',

		'& p': {
			color: 'white',
		},
		'&:hover': {
			boxShadow: 'inset 0px 1px 0px gray',
			'& p': {
				color: 'white',
			},
		},
	},
	foldBtn: {
		'& p': {
			color: '#a71d31',
		},
		'&:hover': {
			borderBottom: '3px solid #a71d31',
		},
	},
	checkOrcallBtn: {
		'& p': {
			color: '#fea',
		},
		'&:hover': {
			borderBottom: '3px solid #fea',
		},
	},
	betOrRaiseBtn: {
		'& p': {
			color: '#52af77',
		},
		'&:hover': {
			borderBottom: '3px solid #52af77',
		},
	},
	betSizingGroup: {
		height: '30px',
		padding: 0,
		color: 'blue',
	},
})

const BetSlider = withStyles({
	root: {
		color: '#52af77',
	},
	thumb: {
		width: '2vw',
		height: '2vw',
		backgroundColor: '#fff',
		border: '.3vw solid currentColor',
		marginTop: '-.6vw',
		marginLeft: '-4%',
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	active: {},
	track: {
		height: '.7vw',
		borderRadius: 4,
	},
	rail: {
		height: '.7vw',
		borderRadius: 4,
	},
})(Slider)

const LightTooltip = withStyles((theme) => ({
	tooltip: {
		background: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}))(Tooltip)

const ValueLabelComponent = (props) => {
	const { children, open, value } = props

	return (
		<LightTooltip
			open={open}
			enterTouchDelay={0}
			placement='bottom'
			title={value}
			arrow>
			{children}
		</LightTooltip>
	)
}

const BIG_BLIND = 20

const PlayerActions = ({
	playersChips,
	opponentsChips,
	pot,
	callAmount,
	isPlayerAllIn,
	hasCalledBB,
	timeLeft,
	setIsTurn,
}) => {
	const classes = useStyles()

	const { socket } = useContext(SocketContext)

	const [betAmount, setBetAmount] = useState(0)
	const [isRaiseAvailable, setIsRaiseAvailable] = useState(true)

	const smallestChipStack = Math.min(playersChips, opponentsChips)
	const minBet = isRaiseAvailable
		? Math.min(playersChips, opponentsChips, callAmount * 2)
		: Math.min(smallestChipStack, BIG_BLIND)
	const maxBet = Math.min(playersChips, opponentsChips + callAmount)

	const handleFold = () => {
		socket.emit('fold')

		setIsTurn(false)
	}

	const handleCheck = () => {
		socket.emit('check')

		setIsTurn(false)
	}

	const handleCall = () => {
		socket.emit('call', callAmount)

		setIsTurn(false)
	}

	const handleBet = () => {
		if (betAmount >= BIG_BLIND || betAmount === playersChips)
			socket.emit('bet', {
				betAmount: Math.min(playersChips, opponentsChips, betAmount),
			})

		setIsTurn(false)
	}

	const handleRaise = () => {
		const raiseAmount = betAmount - callAmount

		if (raiseAmount >= callAmount || betAmount === playersChips)
			socket.emit('raise', {
				callAmount,
				raiseAmount,
			})

		setIsTurn(false)
	}

	const halfPotBet = () => {
		const halfPot = pot / 2

		smallestChipStack >= halfPot
			? setBetAmount(halfPot)
			: setBetAmount(smallestChipStack)
	}

	const fullPotBet = () =>
		smallestChipStack >= pot
			? setBetAmount(pot)
			: setBetAmount(smallestChipStack)

	const doublePotBet = () => {
		const doublePot = pot * 2

		smallestChipStack >= doublePot
			? setBetAmount(doublePot)
			: setBetAmount(smallestChipStack)
	}

	const halfPotRaise = () => {
		const raiseAmount = (pot + callAmount) / 2

		setBetAmount(raiseAmount + callAmount)
	}

	const fullPotRaise = () => {
		const raiseAmount = pot + callAmount

		setBetAmount(raiseAmount + callAmount)
	}

	const doublePotRaise = () => {
		const raiseAmount = (pot + callAmount) * 2

		setBetAmount(raiseAmount + callAmount)
	}

	const handleSliderChange = (e, newValue) => {
		const minBetSize = isRaiseAvailable
			? Math.min(playersChips, callAmount ? callAmount * 2 : BIG_BLIND)
			: minBet

		if (newValue >= minBetSize) setBetAmount(newValue)
	}

	const handleInputChange = (e) =>
		setBetAmount(e.target.value === '' ? '' : Number(e.target.value))

	useEffect(() => {
		setIsRaiseAvailable(
			(!isPlayerAllIn && callAmount && playersChips > callAmount) ||
				(!isPlayerAllIn && hasCalledBB)
		)
	}, [playersChips, isPlayerAllIn, hasCalledBB, callAmount])

	useEffect(() => {
		const minBetSize = isRaiseAvailable
			? Math.min(playersChips, callAmount ? callAmount * 2 : BIG_BLIND)
			: minBet

		setBetAmount(minBetSize)
	}, [playersChips, callAmount, minBet, isRaiseAvailable])

	useEffect(() => {
		if (!timeLeft) socket.emit('fold')

		return () => {
			socket.offAny()
		}
	}, [socket, timeLeft])

	return (
		<div className={classes.root}>
			<ThemeProvider theme={theme}>
				<ButtonGroup className={classes.betSizingGroup} fullWidth>
					<Button
						variant='contained'
						className={classes.betSizingBtn}
						onClick={isRaiseAvailable ? halfPotRaise : halfPotBet}>
						<p>1/2 Pot</p>
					</Button>
					<Button
						variant='contained'
						className={classes.betSizingBtn}
						onClick={isRaiseAvailable ? fullPotRaise : fullPotBet}>
						<p>Pot</p>
					</Button>
					<Button
						variant='contained'
						className={classes.betSizingBtn}
						onClick={isRaiseAvailable ? doublePotRaise : doublePotBet}>
						<p>2X Pot</p>
					</Button>
				</ButtonGroup>
				{callAmount || hasCalledBB ? (
					<ButtonGroup fullWidth>
						<Button
							className={`${classes.actionBtn} ${classes.foldBtn}`}
							onClick={handleFold}>
							<p>Fold</p>
						</Button>
						{callAmount ? (
							<Button
								className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
								onClick={handleCall}>
								<p>Call</p>
								<p>${callAmount}</p>
							</Button>
						) : (
							<Button
								className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
								onClick={handleCheck}>
								<p>Check</p>
							</Button>
						)}
						{isRaiseAvailable && (
							<Button
								className={`${classes.actionBtn} ${classes.betOrRaiseBtn}`}
								onClick={handleRaise}>
								<p>Raise To</p>
								<p>${betAmount}</p>
							</Button>
						)}
					</ButtonGroup>
				) : (
					<ButtonGroup fullWidth>
						<Button
							className={`${classes.actionBtn} ${classes.foldBtn}`}
							onClick={handleFold}>
							<p>Fold</p>
						</Button>
						<Button
							className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
							onClick={handleCheck}>
							<p>Check</p>
						</Button>
						<Button
							className={`${classes.actionBtn} ${classes.betOrRaiseBtn}`}
							onClick={handleBet}>
							<p>Bet</p>
							<p>${betAmount}</p>
						</Button>
					</ButtonGroup>
				)}
				{!isPlayerAllIn && (
					<Box display='flex' alignItems='center' style={{ marginTop: '.5vw' }}>
						<BetSlider
							value={betAmount}
							step={20}
							min={minBet}
							max={maxBet}
							valueLabelDisplay='auto'
							ValueLabelComponent={ValueLabelComponent}
							onChange={handleSliderChange}
						/>
						<Input
							className={classes.input}
							value={betAmount}
							margin='dense'
							onChange={handleInputChange}
							inputProps={{
								step: 20,
								min: minBet,
								max: maxBet,
								type: 'number',
							}}
						/>
					</Box>
				)}
			</ThemeProvider>
		</div>
	)
}

export default memo(PlayerActions)
