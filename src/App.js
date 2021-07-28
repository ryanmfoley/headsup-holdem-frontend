import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Header from './components/Header/Header'

const useStyles = makeStyles((theme) => ({
	root: {
		border: '2px solid pink',
		background: 'pink',
	},
	container: {
		border: '2px solid black',
	},
	header: {
		width: '100%',
		border: '2px solid red',
	},
	content: {
		border: '2px solid blue',
	},
}))

const App = () => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Grid container direction='column'>
				<Grid item>
					<Header />
				</Grid>
				<Grid item container></Grid>
			</Grid>
		</div>
	)
}

export default App
