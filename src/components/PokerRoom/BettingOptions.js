import { useState, memo } from 'react'
import { Button, ButtonGroup, Grid, Input, Slider } from '@material-ui/core'
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
		width: 52,
		background: 'rgba(255, 255, 255, 0.3)',
		borderRadius: '5px',
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

const BIG_BLIND = 20

const BettingOptions = ({
	playersChips,
	opponentsChips,
	callAmount,
	isPlayerAllIn,
}) => {
	const classes = useStyles()
	const [betAmount, setBetAmount] = useState(Math.min(playersChips, BIG_BLIND))
	const isRaiseAvailable = !isPlayerAllIn && playersChips > callAmount

	const handleFold = () => socket.emit('handIsOver')

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

	const handleSliderChange = (e, newValue) => setBetAmount(newValue)

	const handleInputChange = (e) =>
		setBetAmount(e.target.value === '' ? '' : Number(e.target.value))

	return (
		<div className={classes.root}>
			<ThemeProvider theme={theme}>
				{callAmount ? (
					<ButtonGroup variant='contained' fullWidth>
						<Button onClick={handleFold}>Fold</Button>
						<Button onClick={handleCall}>
							<p style={{ margin: 0 }}>Call</p>
							<p style={{ margin: 0 }}>${callAmount}</p>
						</Button>
						{isRaiseAvailable && (
							<Button onClick={handleRaise}>
								<p style={{ margin: 0 }}>Raise To</p>
								<p style={{ margin: 0 }}>${betAmount}</p>
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
				{isRaiseAvailable && (
					<Grid container spacing={2} alignItems='center'>
						<Grid item xs>
							<BetSlider
								value={betAmount ? betAmount : Math.min(playersChips, 20)}
								step={50}
								min={Math.min(playersChips, BIG_BLIND)}
								max={Math.min(playersChips, opponentsChips + callAmount)}
								valueLabelDisplay='auto'
								onChange={handleSliderChange}
							/>
						</Grid>
						<Grid item>
							<Input
								className={classes.input}
								value={betAmount ? betAmount : Math.min(playersChips, 20)}
								margin='dense'
								onChange={handleInputChange}
								inputProps={{
									step: 50,
									min: Math.min(playersChips, BIG_BLIND),
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
