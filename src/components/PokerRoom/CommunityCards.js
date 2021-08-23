import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 300,
		height: 100,
	},
	card: {
		height: 80,
		width: 56 /*70% of height*/,
		margin: 4,
		background: 'white',
		border: '0.2em solid black',
		borderRadius: '10%',
	},
	cardText: {
		margin: 0,
		marginTop: '15%',
		textAlign: 'center',
		fontSize: '1.5em',
		fontWeight: 'bold',
	},
	cardImg: {
		textAlign: 'center',
		margin: 0,
		fontSize: '2em',
	},
})

const CommunityCards = ({ communityCards }) => {
	const classes = useStyles()

	return communityCards.length > 0 ? (
		<div className={classes.root}>
			{communityCards.map((card) => (
				<div key={card.rank + card.suit} className={classes.card}>
					<p className={classes.cardText} style={{ color: card.color }}>
						{card.rank}
					</p>
					<p className={classes.cardImg} style={{ color: card.color }}>
						{card.symbol}
					</p>
				</div>
			))}
		</div>
	) : (
		<div className={classes.root}></div>
	)
	// return (
	// 	communityCards.length > 0 && (
	// 		<div className={classes.root}>
	// 			{communityCards.map((card) => (
	// 				<div key={card.rank + card.suit} className={classes.card}>
	// 					<p className={classes.cardText} style={{ color: card.color }}>
	// 						{card.rank}
	// 					</p>
	// 					<p className={classes.cardImg} style={{ color: card.color }}>
	// 						{card.symbol}
	// 					</p>
	// 				</div>
	// 			))}
	// 		</div>
	// 	)
	// )
}

export default memo(CommunityCards)
