import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		left: '29.5%',
		width: '20%',
		padding: '0 10%',
		margin: '0 auto',
		background: '#212121',
		textAlign: 'center',
		color: 'white',
		// fontSize: '80%',
		fontSize: '1vw',
		border: '.1vw solid #bfbfbf',
		// borderRadius: '20%/50%',
		borderRadius: '5%',
		// outline: '1px solid blue',
	},
})

const PlayersHud = ({ playersName, chips }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<h2 style={{ margin: 0 }}>{playersName}</h2>
			<div>
				<hr />
			</div>
			<h2 style={{ margin: 0 }}>${chips}</h2>
		</div>
	)
}

export default memo(PlayersHud)
