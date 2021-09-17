import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from './Card'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		bottom: '15%',
		left: '65%',
		display: 'flex',
		width: '100%',
		height: '100%',
		zIndex: 1,
		fontSize: '1.5vw',
		"& [data-index='1']": {
			position: 'absolute',
			left: '6%',
			top: '7%',
		},
	},
	card: {
		width: '16%',
		height: '100%',
		margin: '.1%',
		borderRadius: '10%',
	},
	cardFront: {
		background: 'white',
		border: '.2vw solid black',
	},
	cardBack: {
		border: '.2vw solid white',
	},
})

const HoleCards = ({ deckOption, holeCards }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			{holeCards ? (
				<>
					{holeCards.map((card, index) => (
						<div
							key={card.rank + card.suit}
							className={`${classes.card} ${classes.cardFront}`}
							data-index={index}>
							<Card card={card} index={index} />
						</div>
					))}
				</>
			) : (
				<>
					{[0, 1].map((index) => (
						<div
							key={index}
							className={`${classes.card} ${classes.cardBack}`}
							style={{ background: deckOption }}
							data-index={index}></div>
					))}
				</>
			)}
		</div>
	)
}

export default memo(HoleCards)
