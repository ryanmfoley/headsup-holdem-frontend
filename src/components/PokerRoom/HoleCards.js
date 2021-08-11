import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	holeCards: {
		display: 'flex',
		justifyContent: 'center',
		padding: '15px',
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

const HoleCards = ({ holeCards }) => {
	const classes = useStyles()

	return (
		<div className={classes.holeCards}>
			{holeCards && holeCards.length >= 2 ? (
				<>
					{holeCards.map((card) => (
						<div key={card.rank + card.suit} className={classes.card}>
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
					<div style={{ background: 'salmon' }}></div>
					<div style={{ background: 'salmon' }}></div>
				</>
			)}
		</div>
	)
}

export default HoleCards
