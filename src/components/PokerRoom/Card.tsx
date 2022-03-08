export interface ICard {
	id: number | null
	rank: number | string | null
	suit: string
	value: number | null
}

const Card = ({ card }: { card: ICard }) => (
	<img
		src={
			require(`../../assets/images/cards/${
				card.rank
			}${card.suit.toUpperCase()}.png`).default
		}
		style={{ width: '4vw' }}
		alt='playing card'
	/>
)

export default Card
