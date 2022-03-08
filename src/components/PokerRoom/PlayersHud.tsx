import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

interface IProps {
	playersName: string
	chips: number
	active: boolean | null
	action: {
		type: string
		value: number
	}
}

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		left: '29.5%',
		width: '20%',
		height: '75%',
		padding: '1% 10%',
		margin: 0,
		background: '#212121',
		textAlign: 'center',
		color: 'white',
		fontSize: '1vw',
		border: '.1vw solid darkgray',
		borderRadius: '10%/20%',
		'& h2': {
			margin: '4%',
		},
	},
	active: {
		borderColor: 'white',
		boxShadow: '0 0 1vw white',
	},
	actionContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	actionText: {
		color: 'cyan',
	},
	playersNameText: {
		fontFamily: 'Bangers',
		letterSpacing: '.15vw',
	},
	chipStackValue: {
		color: 'lightgreen',
	},
	winnerText: {
		'--neon-text-color': '#08f',
		textShadow:
			'-0.05vw -0.05vw .25vw #fff, 0vw 0vw 0vw #fff, 0 0 0vw var(--neon-text-color), 0 0 1vw var(--neon-text-color), 0 0 .5vw var(--neon-text-color), 0 0 1vw var(--neon-text-color),0 0 1.2vw var(--neon-text-color)',
	},
})

const PlayersHud = ({ playersName, chips, active, action }: IProps) => {
	const classes = useStyles()

	return (
		<div className={`${classes.root} ${active ? classes.active : ''}`}>
			{!action.type ? (
				<>
					<h2 className={classes.playersNameText}>{playersName}</h2>
					<h2 className={classes.chipStackValue}>${chips}</h2>
				</>
			) : (
				<div className={classes.actionContainer}>
					<h2
						className={
							action.type === 'WINNER' ? classes.winnerText : classes.actionText
						}>
						{action.type}
					</h2>
					{Boolean(action.value) && (
						<h2 className={classes.actionText}>${action.value}</h2>
					)}
				</div>
			)}
		</div>
	)
}

export default memo(PlayersHud)
