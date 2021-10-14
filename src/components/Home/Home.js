import { makeStyles, Typography } from '@material-ui/core'

import Header from '../Header/Header'
import pokerBanner from '../../assets/images/poker.png'

const useStyles = makeStyles({
	root: {
		position: 'relative',
	},
	backgroundImage: {
		width: '100%',
	},
	heading: {
		position: 'absolute',
		// top: '45%',
		top: '35%',
		left: '73%',
		transform: 'translate(-50%, -50%)',
		width: '40%',
		textAlign: 'center',
		color: 'white',
		'& h1': {
			margin: 0,
			fontSize: '4vw',
			textShadow: '4px 4px 2px rgba(50, 50, 50, 1)',
		},
	},
	text: {
		marginTop: '5%',
		fontSize: '1.7vw',
	},
})

const Home = () => {
	const classes = useStyles()

	return (
		<>
			<Header />
			<div className={classes.root}>
				<img
					className={classes.backgroundImage}
					src={pokerBanner}
					alt='poker banner'
				/>
				<div className={classes.heading}>
					<h1>NO-LIMIT</h1>
					<h1>TEXAS HOLD'EM</h1>
					<Typography variant='body1' className={classes.text}>
						Texas Hold'em is the most popular poker game in the world. Each
						player is dealt two cards which belong only to that player. Five
						community cards are dealt face-up on the ‘board’ and all players may
						use these cards in conjunction with their own hole cards to make the
						best five-card poker hand possible.
					</Typography>
				</div>
			</div>
		</>
	)
}

export default Home
