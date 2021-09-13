import { useState, useEffect, memo } from 'react'
import {
	Button,
	ButtonGroup,
	Grid,
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

import socket from '../../config/socketConfig'

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
		right: '-10%',
		bottom: '-35%',
		display: 'flex',
		flexDirection: 'column',
		width: '50%',
		height: '80px',
	},
	input: {
		width: 55,
		color: 'white',
	},
})

const BetSlider = withStyles({
	root: {
		color: '#52af77',
		height: 8,
	},
	thumb: {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid currentColor',
		marginTop: -8,
		marginLeft: -12,
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	active: {},
	valueLabel: {
		left: 'calc(-50% + 4px)',
	},
	track: {
		height: 8,
		borderRadius: 4,
	},
	rail: {
		height: 8,
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
}) => {
	const classes = useStyles()
	const [betAmount, setBetAmount] = useState(Math.min(playersChips, BIG_BLIND))
	const [isRaiseAvailable, setIsRaiseAvailable] = useState(null)

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
		setIsRaiseAvailable(
			(!isPlayerAllIn && callAmount && playersChips > callAmount) ||
				(!isPlayerAllIn && hasCalledBB)
		)
		const minBetSize = isRaiseAvailable
			? Math.min(playersChips, callAmount ? callAmount * 2 : BIG_BLIND)
			: Math.min(playersChips, BIG_BLIND)

		setBetAmount(minBetSize)
	}, [playersChips, isPlayerAllIn, isRaiseAvailable, hasCalledBB, callAmount])

	return (
		<div className={classes.root}>
			<ThemeProvider theme={theme}>
				{callAmount || hasCalledBB ? (
					<ButtonGroup variant='contained' fullWidth>
						<Button onClick={handleFold}>Fold</Button>
						{callAmount ? (
							<Button onClick={handleCall}>
								<p style={{ margin: 0 }}>Call</p>
								<p style={{ margin: 0 }}>${callAmount}</p>
							</Button>
						) : (
							<Button onClick={handleCheck}>CHECK</Button>
						)}
						{isRaiseAvailable && (
							<Button onClick={handleRaise}>
								<p style={{ margin: 0 }}>Raise To</p>
								<p style={{ margin: 0 }}>
									$
									{Math.max(
										betAmount,
										isRaiseAvailable
											? Math.min(playersChips, callAmount * 2)
											: Math.min(playersChips, BIG_BLIND)
									)}
								</p>
							</Button>
						)}
					</ButtonGroup>
				) : (
					<ButtonGroup variant='contained' fullWidth>
						<Button onClick={handleFold}>FOLD</Button>
						<Button onClick={handleCheck}>CHECK</Button>
						<Button onClick={handleBet}>
							<p style={{ margin: 0 }}>Bet</p>
							<p style={{ margin: 0 }}>${betAmount}</p>
						</Button>
					</ButtonGroup>
				)}
				{!isPlayerAllIn && (
					<Grid container spacing={2} alignItems='center'>
						<Grid item xs>
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
						</Grid>
						<Grid item>
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
						</Grid>
					</Grid>
				)}
			</ThemeProvider>
		</div>
	)
}

export default memo(BettingOptions)
