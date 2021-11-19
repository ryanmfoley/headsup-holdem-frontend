import { useState, useEffect, useContext, useRef, memo } from 'react'
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
		padding: '10px 25px',
		background:
			'-webkit-gradient(linear, left top, left bottom, from(#000), to(#333))',
		borderBottom: '2px solid transparent',
		'& p': {
			color: '#7c7c7c',
		},
	},
	foldBtn: {
		'&:hover': {
			borderBottom: '2px solid #a71d31',
			'& p': {
				color: '#a71d31',
			},
		},
	},
	checkOrcallBtn: {
		'&:hover': {
			borderBottom: '2px solid #fea',
			'& p': {
				color: '#fea',
			},
		},
	},
	betOrRaiseBtn: {
		'&:hover': {
			borderBottom: '2px solid #52af77',
			'& p': {
				color: '#52af77',
			},
		},
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
	callAmount,
	isPlayerAllIn,
	hasCalledBB,
	timeLeft,
	setIsTurn,
}) => {
	const classes = useStyles()

	const { socket } = useContext(SocketContext)

	const [betAmount, setBetAmount] = useState(Math.min(playersChips, BIG_BLIND))
	const [isRaiseAvailable, setIsRaiseAvailable] = useState(null)

	const _isMounted = useRef(true)

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

	const handleSliderChange = (e, newValue) => {
		const minBetSize = isRaiseAvailable
			? Math.min(playersChips, callAmount ? callAmount * 2 : BIG_BLIND)
			: Math.min(playersChips, BIG_BLIND)

		if (newValue >= minBetSize) setBetAmount(newValue)
	}

	const handleInputChange = (e) =>
		setBetAmount(e.target.value === '' ? '' : Number(e.target.value))

	useEffect(() => {
		if (!_isMounted.current) return null

		setIsRaiseAvailable(
			(!isPlayerAllIn && callAmount && playersChips > callAmount) ||
				(!isPlayerAllIn && hasCalledBB)
		)
		const minBetSize = isRaiseAvailable
			? Math.min(playersChips, callAmount ? callAmount * 2 : BIG_BLIND)
			: Math.min(playersChips, BIG_BLIND)

		setBetAmount(minBetSize)
	}, [playersChips, isPlayerAllIn, isRaiseAvailable, hasCalledBB, callAmount])

	useEffect(() => {
		if (!timeLeft) socket.emit('fold')

		// Cancel subscription to useEffect //
		return () => {
			_isMounted.current = false

			socket.offAny()
		}
	}, [socket, timeLeft])

	return (
		<div className={classes.root}>
			<ThemeProvider theme={theme}>
				{callAmount || hasCalledBB ? (
					<ButtonGroup fullWidth>
						<Button
							className={`${classes.actionBtn} ${classes.foldBtn}`}
							onClick={handleFold}>
							<p>
								<strong>Fold</strong>
							</p>
						</Button>
						{callAmount ? (
							<Button
								className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
								onClick={handleCall}>
								<p style={{ margin: 0 }}>
									<strong>Call</strong>
								</p>
								<p style={{ margin: 0 }}>
									<strong>${callAmount}</strong>
								</p>
							</Button>
						) : (
							<Button
								className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
								onClick={handleCheck}>
								<p>
									<strong>CHECK</strong>
								</p>
							</Button>
						)}
						{isRaiseAvailable && (
							<Button
								className={`${classes.actionBtn} ${classes.betOrRaiseBtn}`}
								onClick={handleRaise}>
								<p style={{ margin: 0 }}>
									<strong>Raise To</strong>
								</p>
								<p style={{ margin: 0 }}>
									<strong>
										$
										{Math.max(
											betAmount,
											isRaiseAvailable
												? Math.min(playersChips, callAmount * 2)
												: Math.min(playersChips, BIG_BLIND)
										)}
									</strong>
								</p>
							</Button>
						)}
					</ButtonGroup>
				) : (
					<ButtonGroup fullWidth>
						<Button
							className={`${classes.actionBtn} ${classes.foldBtn}`}
							onClick={handleFold}>
							<p>
								<strong>FOLD</strong>
							</p>
						</Button>
						<Button
							className={`${classes.actionBtn} ${classes.checkOrcallBtn}`}
							onClick={handleCheck}>
							<p>
								<strong>CHECK</strong>
							</p>
						</Button>
						<Button
							className={`${classes.actionBtn} ${classes.betOrRaiseBtn}`}
							onClick={handleBet}>
							<p style={{ margin: 0 }}>
								<strong>Bet</strong>
							</p>
							<p style={{ margin: 0 }}>
								<strong>${betAmount}</strong>
							</p>
						</Button>
					</ButtonGroup>
				)}
				{!isPlayerAllIn && (
					<Box display='flex' alignItems='center' style={{ marginTop: '.5vw' }}>
						<BetSlider
							value={betAmount}
							step={20}
							min={
								isRaiseAvailable
									? Math.min(playersChips, callAmount * 2)
									: Math.min(playersChips, BIG_BLIND)
							}
							max={Math.min(playersChips, opponentsChips + callAmount)}
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
								min: isRaiseAvailable
									? Math.min(playersChips, callAmount * 2)
									: Math.min(playersChips, BIG_BLIND),
								max: Math.min(playersChips, opponentsChips + callAmount),
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
