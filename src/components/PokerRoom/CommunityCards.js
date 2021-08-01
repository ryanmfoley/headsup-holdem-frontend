const CommunityCards = ({ communityCards }) => {
	return (
		communityCards.length > 0 && (
			<div className='community-cards'>
				{communityCards.map((card) => (
					<div key={card.id} className='card'>
						<p className={`card-text ${card.color}`}>{card.rank}</p>
						<p className={`card-img ${card.color}`}>{card.symbol}</p>
					</div>
				))}
			</div>
		)
	)
}

export default CommunityCards
