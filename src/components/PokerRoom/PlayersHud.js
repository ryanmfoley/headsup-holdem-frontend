import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		marginBottom: '10px',
		padding: '3px',
		background: 'black',
		textAlign: 'center',
		color: 'white',
		border: '.8px solid white',
		borderRadius: '20%/50%',
	},
})

const PlayersHud = ({ playersName, chips }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<h2 style={{ margin: 0 }}>{playersName}</h2>
			<h2 style={{ margin: 0 }}>${chips}</h2>
		</div>
	)
}

export default memo(PlayersHud)
