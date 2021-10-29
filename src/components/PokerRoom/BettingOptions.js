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
	foldBtn: {
		background:
			'linear-gradient(0deg, hsl(9, 100%, 23%) 0%, hsl(9, 100%, 53%) 100%)',
	},
	checkOrcallBtn: {
		background:
			'linear-gradient(0deg, hsl(43, 92%, 43%) 0%, hsl(43, 92%, 73%) 100%)',
	},
	betOrRaiseBtn: {
		background:
			'linear-gradient(0deg, hsl(120, 60%, 30%) 0%, hsl(120, 60%, 50%) 100%)',
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

const BettingOptions = ({
	playersChips,
	opponentsChips,
	callAmount,
	isPlayerAllIn,
	hasCalledBB,
	timeLeft,
}) => {
	const classes = useStyles()

	const { socket } = useContext(SocketContext)

	const [betAmount, setBetAmount] = useState(Math.min(playersChips, BIG_BLIND))
	const [isRaiseAvailable, setIsRaiseAvailable] = useState(null)

	const _isMounted = useRef(true)

	const handleFold = () => socket.emit('fold')

	const handleCheck = () => socket.emit('check')

	const handleCall = () => socket.emit('call', callAmount)

	const handleBet = () => {
		if (betAmount >= BIG_BLIND || betAmount === playersChips)
			socket.emit('bet', {
				betAmount: Math.min(playersChips, opponentsChips, betAmount),
			})
	}

	const handleRaise = () => {
		const raiseAmount = betAmount - callAmount

		if (raiseAmount >= callAmount || betAmount === playersChips)
			socket.emit('raise', {
				callAmount,
				raiseAmount,
			})
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
					<ButtonGroup variant='contained' fullWidth>
						<Button className={classes.foldBtn} onClick={handleFold}>
							<p>
								<strong>Fold</strong>
							</p>
						</Button>
						{callAmount ? (
							<Button className={classes.checkOrcallBtn} onClick={handleCall}>
								<p style={{ margin: 0 }}>
									<strong>Call</strong>
								</p>
								<p style={{ margin: 0 }}>
									<strong>${callAmount}</strong>
								</p>
							</Button>
						) : (
							<Button className={classes.checkOrcallBtn} onClick={handleCheck}>
								<p>
									<strong>CHECK</strong>
								</p>
							</Button>
						)}
						{isRaiseAvailable && (
							<Button className={classes.betOrRaiseBtn} onClick={handleRaise}>
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
					<ButtonGroup variant='contained' fullWidth>
						<Button className={classes.foldBtn} onClick={handleFold}>
							<p>
								<strong>FOLD</strong>
							</p>
						</Button>
						<Button className={classes.checkOrcallBtn} onClick={handleCheck}>
							<p>
								<strong>CHECK</strong>
							</p>
						</Button>
						<Button className={classes.betOrRaiseBtn} onClick={handleBet}>
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

export default memo(BettingOptions)
