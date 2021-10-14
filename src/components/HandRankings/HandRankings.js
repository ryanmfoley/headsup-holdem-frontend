import { makeStyles } from '@material-ui/core'

import Header from '../Header/Header'
import pokerHandRankings from '../../assets/images/poker-hand-rankings.jpeg'

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '93vh',
		paddingTop: '3vh',
		background:
			'radial-gradient(circle, rgba(1,165,105,1) 0%, rgba(0,95,89,1) 100%)',
	},
	handRankingsImg: {
		display: 'block',
		width: '35%',
		margin: 'auto',
	},
})

const HandRankings = () => {
	const classes = useStyles()

	return (
		<>
			<Header />
			<div className={classes.root}>
				<img
					className={classes.handRankingsImg}
					src={pokerHandRankings}
					alt='poker hand rankings'
				/>
			</div>
		</>
	)
}

export default HandRankings
