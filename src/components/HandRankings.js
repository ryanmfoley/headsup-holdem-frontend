import { makeStyles } from '@material-ui/core'

import Header from './Header'
import pokerHandRankings from '../assets/images/poker-hand-rankings.jpeg'

const useStyles = makeStyles({
	root: {
		width: '100%',
		paddingTop: '5%',
		background:
			'radial-gradient(circle, rgba(1,165,105,1) 0%, rgba(0,95,89,1) 100%)',
	},
	handRankingsImg: {
		display: 'block',
		width: '45%',
		margin: 'auto',
	},
	'@media screen and (max-width: 767px)': {
		handRankingsImg: {
			width: '85%',
		},
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
