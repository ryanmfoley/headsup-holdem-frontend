import { useEffect, useRef, memo } from 'react'
import { Button, ButtonGroup, Grid, Input, Slider } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import socket from '../../config/socketConfig'

const useStyles = makeStyles({
	root: {
		width: 250,
	},
	bettingOptions: {
		position: 'absolute',
		right: '-10%',
		bottom: '-35%',
		display: 'flex',
		flexDirection: 'column',
		width: '35%',
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

const BettingOptions = ({
	isPlayerOnBtn,
	betAmount,
	setBetAmount,
	amountToCall,
	setAmountToCall,
	chips,
}) => {
	const classes = useStyles()

	const handleFold = () => socket.emit('handIsOver')

	const handleCheck = () => socket.emit('check')

	const handleCall = () => {
		socket.emit('call', amountToCall)
	}

	const handleBetOrRaise = () => {
		socket.emit('bet', { betAmount })
	}

	const handleSliderChange = (e, newValue) => {
		setBetAmount(newValue)
	}

	const handleInputChange = (e) => {
		setBetAmount(e.target.value === '' ? '' : Number(e.target.value))
	}

	const handleBlur = () => {
		if (betAmount < 0) {
			setBetAmount(0)
		} else if (betAmount > 100) {
			setBetAmount(100)
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
			<Grid container spacing={2} alignItems='center'>
				<Grid item xs>
					<BetSlider
						value={typeof betAmount === 'number' ? betAmount : 0}
						step={50}
						max={chips}
						onChange={handleSliderChange}
					/>
				</Grid>
				<Grid item>
					<Input
						className={classes.input}
						value={betAmount}
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
