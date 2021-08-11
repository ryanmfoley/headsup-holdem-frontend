import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	playerData: {
		marginBottom: '10px',
		background: 'black',
		textAlign: 'center',
		color: 'white',
		border: '2px solid black',
		borderRadius: '10px',
	},
})

const PlayersHud = ({ playersName, chips }) => {
	const classes = useStyles()

	return (
		<div className={classes.playerData}>
			<h2 style={{ margin: 0 }}>{playersName}</h2>
			<h2 style={{ margin: 0 }}>${chips}</h2>
		</div>
	)
}

export default PlayersHud
