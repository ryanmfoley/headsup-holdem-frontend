import { makeStyles, Box, Grid, Typography } from '@material-ui/core'

import Header from '../Header/Header'
import pokerBanner from '../../assets/images/poker.png'

const useStyles = makeStyles({
	root: {
		padding: '3%',
		background:
			'radial-gradient(circle, rgba(1,165,105,1) 0%, rgba(0,95,89,1) 100%)',
	},
	pokerImage: { width: '100%' },
	heading: {
		padding: '3%',
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
		fontSize: '1.9vw',
	},
	'@media screen and (max-width: 959px)': {
		heading: {
			'& h1': {
				fontSize: '7vw',
				marginTop: 0,
			},
		},
		pokerImage: { width: '40%' },
		text: { fontSize: '4vw' },
	},
})

const Home = () => {
	const classes = useStyles()

	return (
		<>
			<Header />
			<div className={classes.root}>
				<Grid container>
					<Grid container item justifyContent='center' xs={12} md={6}>
						<img
							className={classes.pokerImage}
							src={pokerBanner}
							alt='poker banner'
						/>
					</Grid>
					<Grid
						className={classes.heading}
						container
						item
						justifyContent='center'
						xs={12}
						md={6}
						style={{ padding: 0 }}>
						<Box className={classes.heading} display='block'>
							<h1>NO-LIMIT</h1>
							<h1>TEXAS HOLD'EM</h1>
							<Typography variant='body1' className={classes.text}>
								Texas Hold'em is the most popular poker game in the world. Each
								player is dealt two cards which belong only to that player. Five
								community cards are dealt face-up on the ‘board’ and all players
								may use these cards in conjunction with their own hole cards to
								make the best five-card poker hand possible.
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</div>
		</>
	)
}

export default Home
