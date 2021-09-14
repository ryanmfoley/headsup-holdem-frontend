import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		top: '370px',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100px',
	},
	cardOutline: {
		height: 80,
		width: 56 /*70% of height*/,
		margin: 4,
		border: '0.1em dashed white',
		borderRadius: '10%',
	},
	cardFront: {
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
	const cards = [...communityCards]

	// Add null to display outline for empty cards //
	for (let i = 0; i <= 5 - communityCards.length; i++) {
		cards.push({ id: i, rank: null })
	}

	return (
		<div className={classes.root}>
			{cards.slice(0, 5).map((card) =>
				card.rank ? (
					<div key={card.rank + card.suit} className={classes.cardFront}>
						<p className={classes.cardText} style={{ color: card.color }}>
							{card.rank}
						</p>
						<p className={classes.cardImg} style={{ color: card.color }}>
							{card.symbol}
						</p>
					</div>
				) : (
					<div key={card.id} className={classes.cardOutline}></div>
				)
			)}
		</div>
	)
}

export default memo(CommunityCards)
