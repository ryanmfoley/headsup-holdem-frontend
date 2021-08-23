import { useEffect, useRef, memo } from 'react'
import { Button, ButtonGroup, Grid, Input, Slider } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import socket from '../../config/socketConfig'

// Fold - Check - Bet
// Fold - Call - Raise
// Fold - Call // facing allin

const useStyles = makeStyles({
	root: {
		width: 250,
	},
	bettingOptions: {
		position: 'absolute',
		// top: 0,
		right: '3%',
		bottom: '8%',
		// left: 0,
		display: 'flex',
		flexDirection: 'column',
		width: '35%',
		height: '80px',
		// margin: 'auto',
		// outline: '2px solid yellow',
	},
	// betSlider: { width:  },
	input: {
		width: 52,
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

const BettingOptions = ({
	isPlayerOnBtn,
	betOrRaiseAmount,
	setBetOrRaiseAmount,
	amountToCall,
	setAmountToCall,
	chips,
}) => {
	const classes = useStyles()

	// const handleClick = (e) => {
	// 	const { action } = e.currentTarget.dataset

	// 	socket.emit('action', isPlayerOnBtn, action, bet)
	// }

	const handleFold = () => socket.emit('fold')

	const handleCheck = () => socket.emit('check')

	const handleCall = () => socket.emit('call')

	const handleBetOrRaise = () => {
		socket.emit('betOrRaise', betOrRaiseAmount)
	}

	const handleSliderChange = (e, newValue) => {
		setBetOrRaiseAmount(newValue)
	}

	const handleInputChange = (e) => {
		setBetOrRaiseAmount(e.target.value === '' ? '' : Number(e.target.value))
	}

	const handleBlur = () => {
		if (betOrRaiseAmount < 0) {
			setBetOrRaiseAmount(0)
		} else if (betOrRaiseAmount > 100) {
			setBetOrRaiseAmount(100)
		}
	}

	// useEffect(() => {
	// 	// Clean up controller //
	// 	let isMounted = true

	// 	// Cancel subscription to useEffect //
	// 	return () => {
	// 		isMounted = false
	// 		socket.offAny()
	// 	}
	// }, [])

	return (
		<div className={classes.bettingOptions}>
			{amountToCall ? (
				<ButtonGroup variant='contained' fullWidth>
					<Button variant='contained' onClick={handleFold}>
						Fold
					</Button>
					<Button variant='contained' onClick={handleCall}>
						Call
					</Button>
					<Button variant='contained' onClick={handleBetOrRaise}>
						Raise
					</Button>
				</ButtonGroup>
			) : (
				<ButtonGroup variant='contained' fullWidth>
					<Button variant='contained' onClick={handleFold}>
						FOLD
					</Button>
					<Button variant='contained' onClick={handleCheck}>
						CHECK
					</Button>
					<Button variant='contained' onClick={handleBetOrRaise}>
						BET
					</Button>
				</ButtonGroup>
			)}
			<Grid
				container
				spacing={2}
				alignItems='center'
				className={classes.betSlider}>
				<Grid item xs>
					<BetSlider
						value={typeof betOrRaiseAmount === 'number' ? betOrRaiseAmount : 0}
						step={50}
						max={chips}
						onChange={handleSliderChange}
					/>
				</Grid>
				<Grid item>
					<Input
						className={classes.input}
						value={betOrRaiseAmount}
						margin='dense'
						onChange={handleInputChange}
						onBlur={handleBlur}
						inputProps={{
							step: 50,
							max: chips,
							type: 'number',
						}}
					/>
				</Grid>
			</Grid>
		</div>
	)
}

export default memo(BettingOptions)
