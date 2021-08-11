import { useEffect } from 'react'
import { Button, ButtonGroup, Grid, Input, Slider } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import socket from '../../config/socketConfig'

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

const BettingOptions = ({ bet, setBet, chips }) => {
	const classes = useStyles()

	const handleClick = (e) => {
		const { action } = e.currentTarget.dataset

		socket.emit('action', action, bet)
	}

	const handleSliderChange = (event, newValue) => {
		setBet(newValue)
	}

	const handleInputChange = (event) => {
		setBet(event.target.value === '' ? '' : Number(event.target.value))
	}

	const handleBlur = () => {
		if (bet < 0) {
			setBet(0)
		} else if (bet > 100) {
			setBet(100)
		}
	}

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [])

	return (
		<div className={classes.playerOptions}>
			<ButtonGroup variant='contained' fullWidth>
				<Button variant='contained' data-action='check' onClick={handleClick}>
					Check
				</Button>
				<Button variant='contained' data-action='bet' onClick={handleClick}>
					Bet
				</Button>
			</ButtonGroup>
			<ButtonGroup variant='contained' size='small' fullWidth>
				<Button variant='contained' data-action='fold' onClick={handleClick}>
					Fold
				</Button>
				<Button variant='contained' data-action='call' onClick={handleClick}>
					Call
				</Button>
				<Button variant='contained' data-action='raise' onClick={handleClick}>
					Raise
				</Button>
			</ButtonGroup>
			<Grid container spacing={2} alignItems='center'>
				<Grid item xs>
					<BetSlider
						value={typeof bet === 'number' ? bet : 0}
						step={50}
						max={chips}
						onChange={handleSliderChange}
					/>
				</Grid>
				<Grid item>
					<Input
						className={classes.input}
						value={bet}
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

export default BettingOptions
