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
	position,
	betOrRaise,
	setBetOrRaise,
	amountToCall,
	setAmountToCall,
	chips,
}) => {
	const classes = useStyles()
	const betOrRaiseAmount = useRef(0)

	// const handleClick = (e) => {
	// 	const { action } = e.currentTarget.dataset

	// 	socket.emit('action', position, action, bet)
	// }

	const handleFold = () => socket.emit('fold')

	const handleCheck = () => socket.emit('check')

	const handleCall = () => socket.emit('call')

	const handleBetOrRaise = () => {
		socket.emit('betOrRaise', betOrRaiseAmount.current)
	}

	const handleSliderChange = (e, newValue) => {
		betOrRaiseAmount.current = newValue
	}

	const handleInputChange = (e) => {
		betOrRaiseAmount.current =
			e.target.value === '' ? '' : Number(e.target.value)
	}

	const handleBlur = () => {
		if (betOrRaise < 0) {
			setBetOrRaise(0)
		} else if (betOrRaise > 100) {
			setBetOrRaise(100)
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
		<div className={classes.playerOptions}>
			{amountToCall ? (
				<ButtonGroup variant='contained' size='small' fullWidth>
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
			<Grid container spacing={2} alignItems='center'>
				<Grid item xs>
					<BetSlider
						value={typeof betOrRaise === 'number' ? betOrRaise : 0}
						step={50}
						max={chips}
						onChange={handleSliderChange}
					/>
				</Grid>
				<Grid item>
					<Input
						className={classes.input}
						value={betOrRaise}
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
