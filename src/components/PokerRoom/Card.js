const Card = ({ card }) => (
	<img
		src={
			require(`../../assets/images/cards/${
				card.rank
			}${card.suit[0].toUpperCase()}.png`).default
		}
		style={{ width: '4vw' }}
		alt='playing card'
	/>
)

export default Card
