import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	cardIndex: {
		width: '33%',
		margin: 0,
		textAlign: 'center',
		'& p': {
			margin: 0,
			padding: 0,
		},
	},
	smallPip: {
		margin: 0,
		padding: 0,
		fontSize: '.8vw',
	},
	largePip: {
		position: 'absolute',
		top: '60%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '67%',
		textAlign: 'center',
		margin: 'auto',
		fontSize: '2vw',
	},
})

const Card = ({ deckOption, card, index }) => {
	const classes = useStyles()

	return (
		<>
			<div className={classes.cardIndex}>
				<p style={{ color: card.color }}>{card.rank}</p>
				<p
					className={classes.smallPip}
					style={{
						color: 'transparent',
						textShadow: `0 0 0 ${card.color}`,
					}}>
					{card.symbol}
				</p>
			</div>
			{index ? (
				<p
					className={classes.largePip}
					style={{
						color: 'transparent',
						textShadow: `0 0 0 ${card.color}`,
					}}>
					{card.symbol}
				</p>
			) : (
				<></>
			)}
		</>
	)
}

export default memo(Card)
