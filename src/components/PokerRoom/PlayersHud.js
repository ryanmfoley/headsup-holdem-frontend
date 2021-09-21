import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

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
		border: '.1vw solid #bfbfbf',
		borderRadius: '10%/20%',
		'& h2': {
			margin: '4%',
		},
	},
	active: {
		borderColor: '#9ecaed',
		boxShadow: '0 0 1vw #9ecaed',
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
	chipStack: {
		color: 'lightgreen',
	},
})

const PlayersHud = ({ playersName, chips, active, action }) => {
	const classes = useStyles()

	return (
		<div className={`${classes.root} ${active ? classes.active : ''}`}>
			{!action.type ? (
				<>
					<h2>{playersName}</h2>
					<h2 className={classes.chipStack}>${chips}</h2>
				</>
			) : (
				<div className={classes.actionContainer}>
					<h2 className={classes.actionText}>{action.type}</h2>
					{Boolean(action.value) && (
						<h2 className={classes.actionText}>${action.value}</h2>
					)}
				</div>
			)}
		</div>
	)
}

export default memo(PlayersHud)
