import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
	card: {
		height: 80,
		width: 56 /*70% of height*/,
		margin: '5px 3px',
		borderRadius: '10%',
	},
	cardFront: {
		background: 'white',
		border: '0.2em solid black',
	},
	cardBack: {
		background: 'salmon',
		border: '0.2em solid white',
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

const HoleCards = ({ holeCards }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			{holeCards ? (
				<>
					{holeCards.map((card) => (
						<div
							key={card.rank + card.suit}
							className={`${classes.card} ${classes.cardFront}`}>
							<p className={classes.cardText} style={{ color: card.color }}>
								{card.rank}
							</p>
							<p className={classes.cardImg} style={{ color: card.color }}>
								{card.symbol}
							</p>
						</div>
					))}
				</>
			) : (
				<>
					<div className={`${classes.card} ${classes.cardBack}`}></div>
					<div className={`${classes.card} ${classes.cardBack}`}></div>
				</>
			)}
		</div>
	)
}

export default memo(HoleCards)
