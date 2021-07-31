import { useState } from 'react'
import { Paper } from '@material-ui/core'

const Table = ({ startGame, playerOne, playerTwo }) => {
	const player = JSON.parse(localStorage.getItem('player'))
	const opponent =
		player.username !== playerOne.username ? playerOne : playerTwo

	return (
		<div className='table'>
			<div className='players-hud top'>
				<div className='hole-cards'>
					<div className='card'>
						<p className='card-text red'>J</p>
						<p className='card-img red'>&diams;</p>
					</div>
					<div className='card'>
						<p className='card-text red'>J</p>
						<p className='card-img red'>&diams;</p>
					</div>
				</div>
				<h2 className='name-display'>{opponent.username}</h2>
			</div>
			<div className='community-cards'>
				<div className='card'>
					<p className='card-text red'>10</p>
					<p className='card-img red'>&diams;</p>
				</div>
				<div className='card'>
					<p className='card-text black'>J</p>
					<p className='card-img black'>&clubs;</p>
				</div>
				<div className='card'>
					<p className='card-text red'>Q</p>
					<p className='card-img red'>&hearts;</p>
				</div>
				<div className='card'>
					<p className='card-text red'>K</p>
					<p className='card-img red'>&diams;</p>
				</div>
				<div className='card'>
					<p className='card-text black'>A</p>
					<p className='card-img black'>&spades;</p>
				</div>
			</div>
			<div className='players-hud bottom'>
				<div className='hole-cards'>
					<div className='card'>
						<p className='card-text red'>J</p>
						<p className='card-img red'>&diams;</p>
					</div>
					<div className='card'>
						<p className='card-text red'>J</p>
						<p className='card-img red'>&diams;</p>
					</div>
				</div>
				<h2 className='name-display'>{player.username}</h2>
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
