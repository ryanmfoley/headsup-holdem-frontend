const HoleCards = ({ holeCards }) => {
	return (
		<div className='hole-cards'>
			{holeCards && holeCards.length >= 2 ? (
				<>
					<div className='card'>
						<p className={`card-text ${holeCards[0].color}`}>
							{holeCards[0].rank}
						</p>
						<p className={`card-img ${holeCards[0].color}`}>
							{holeCards[0].symbol}
						</p>
					</div>
					<div className='card'>
						<p className={`card-text ${holeCards[1].color}`}>
							{holeCards[1].rank}
						</p>
						<p className={`card-img ${holeCards[1].color}`}>
							{holeCards[1].symbol}
						</p>
					</div>
				</>
			) : (
				<>
					<div className='card card-back'></div>
					<div className='card card-back'></div>
				</>
			)}
		</div>
	)
}

export default HoleCards
