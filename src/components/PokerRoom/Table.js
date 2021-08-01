import { Paper } from '@material-ui/core'

import CommunityCards from './CommunityCards'
import HoleCards from './HoleCards'

const Table = ({
	startGame,
	playersName,
	opponentsName,
	holeCards,
	communityCards,
}) => {
	return (
		<div className='table'>
			<div className='players-hud top'>
				<HoleCards />
				<h2 className='name-display'>{opponentsName}</h2>
			</div>
			<CommunityCards communityCards={communityCards} />
			<div className='players-hud bottom'>
				<HoleCards holeCards={holeCards} />
				<h2 className='name-display'>{playersName}</h2>
			</div>
			{!startGame && (
				<Paper className='waiting-display'>
					<h5 className='waiting-text'>WAITING FOR OPPONENT</h5>
				</Paper>
			)}
		</div>
	)
}

export default Table
