import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card, { ICard } from './Card'

export type IHoleCards = [ICard, ICard]

interface IProps {
	deckOption?: string
	holeCards?: IHoleCards | []
}

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		bottom: '15%',
		left: '67%',
		display: 'flex',
		width: '100%',
		height: '100%',
		zIndex: 1,
		"& [data-index='1']": {
			position: 'absolute',
			left: '6%',
			top: '7%',
		},
	},
	card: {
		width: '4vw',
		margin: '.1%',
		borderRadius: '10%',
	},
	cardFront: {
		border: '.2vw solid black',
	},
})

const HoleCards = ({ deckOption, holeCards }: IProps) => {
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
							<Card card={card} />
						</div>
					))}
				</>
			) : (
				<>
					{[0, 1].map((index) => (
						<img
							key={index}
							src={
								require(`../../assets/images/cards/${deckOption}-card-back.png`)
									.default
							}
							className={classes.card}
							data-index={index}
							alt='back of playing card'
						/>
					))}
				</>
			)}
		</div>
	)
}

export default memo(HoleCards)
