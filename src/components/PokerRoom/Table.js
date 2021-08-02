import { useState, useEffect } from 'react'
import {
	Button,
	ButtonGroup,
	Grid,
	Input,
	Paper,
	Slider,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import socket from '../../config/socketConfig'
import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'

const useStyles = makeStyles({
	root: {
		width: 250,
	},
	input: {
		// width: 42,
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

const Table = ({ playerData, gameVariables }) => {
	const classes = useStyles()

	// Grab player data variables //
	const {
		playerOne,
		setPlayerOne,
		playerTwo,
		setPlayerTwo,
		playersName,
		setPlayersName,
		opponentsName,
		setOpponentsName,
		chips,
		setChips,
		holeCards,
		setHoleCards,
	} = playerData

	// Grab game variables //
	const {
		startGame,
		setStartGame,
		communityCards,
		setCommunityCards,
		pot,
		setPot,
		fold,
		setFold,
		check,
		setCheck,
		call,
		setCall,
		bet,
		setBet,
		raise,
		setRaise,
	} = gameVariables

	const [value, setValue] = useState(0)

	const handleCheck = () => {
		setCheck(true)
	}
	const handleBet = () => {
		// setBet()
		socket.emit('deal')
	}
	const handleFold = () => {
		setFold(true)
	}
	const handleCall = () => {
		setCall(true)
	}
	const handleRaise = () => {
		// setRaise()
	}

	const handleSliderChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleInputChange = (event) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value))
	}

	const handleBlur = () => {
		if (value < 0) {
			setValue(0)
		} else if (value > 100) {
			setValue(100)
		}
	}

	useEffect(() => {
		socket.on('bet', () => {
			console.log(socket)
		})

		return () => {}
	}, [])

	return (
		<div className='table'>
			<div className='players-hud top'>
				<HoleCards />
				<h2 className='name-display'>{opponentsName}</h2>
			</div>
			<CommunityCards communityCards={communityCards} />
			<div className='players-hud bottom'>
				<HoleCards holeCards={holeCards} />
				<div className='player-data'>
					<h2 style={{ margin: 0 }}>{playersName}</h2>
					<h2 style={{ margin: 0 }}>${chips}</h2>
				</div>
				<ButtonGroup variant='contained' fullWidth>
					<Button variant='contained' onClick={handleCheck}>
						Check
					</Button>
					<Button variant='contained' onClick={handleBet}>
						Bet
					</Button>
				</ButtonGroup>
				<ButtonGroup variant='contained' size='small' fullWidth>
					<Button variant='contained' onClick={handleFold}>
						Fold
					</Button>
					<Button variant='contained' onClick={handleCall}>
						Call
					</Button>
					<Button variant='contained' onClick={handleRaise}>
						Raise
					</Button>
				</ButtonGroup>
				<Grid container spacing={2} alignItems='center'>
					<Grid item>{/* <VolumeUp /> */}</Grid>
					<Grid item xs>
						<BetSlider
							value={typeof value === 'number' ? value : 0}
							step={50}
							max={chips}
							onChange={handleSliderChange}
						/>
					</Grid>
					<Grid item>
						<Input
							className={classes.input}
							value={value}
							margin='dense'
							onChange={handleInputChange}
							onBlur={handleBlur}
							inputProps={{
								step: 10,
								min: 100,
								// max: chips,
								max: 1000,
								type: 'number',
							}}
						/>
					</Grid>
				</Grid>
			</div>
			{!startGame && (
				<Paper className='waiting-display'>
					<h5 className='waiting-text'>WAITING FOR OPPONENT</h5>
				</Paper>
			)}
		</div>
	)
}

export default Table
