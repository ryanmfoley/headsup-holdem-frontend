import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from './Card'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		top: '45%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: '25%',
		height: '10%',
	},
	card: {
		position: 'relative',
		width: '16%',
		height: '100%',
		fontSize: '1.5vw',
		borderRadius: '10%',
	},
	cardFront: {
		background: 'white',
		border: '.2vw solid black',
	},
	cardOutline: {
		border: '0.1em dashed white',
	},
})

const CommunityCards = ({ communityCards, deckOption }) => {
	const classes = useStyles()

	const cards = [...communityCards]

	// Add null to display outline for empty cards //
	for (let i = 0; i <= 5 - communityCards.length; i++) {
		cards.push({ id: i, rank: null })
	}

	return (
		<div className={classes.root}>
			{cards.slice(0, 5).map((card, index) =>
				card.rank ? (
					<div
						key={card.rank + card.suit}
						className={`${classes.card} ${classes.cardFront}`}
						data-index={index}>
						<Card card={card} index={index + 1} />
					</div>
				) : (
					<div
						key={card.id}
						className={`${classes.card} ${classes.cardOutline}`}></div>
				)
			)}
		</div>
	)
}

export default memo(CommunityCards)
