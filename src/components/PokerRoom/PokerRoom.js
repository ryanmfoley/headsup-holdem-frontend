import { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client'

import ENDPOINT from '../../config/config'
import Table from './Table'
import './PokerRoom.css'

let socket

const PokerRoom = ({ match, isLoggedIn, setIsLoggedIn }) => {
	const [playerOne, setPlayerOne] = useState({})
	const [playerTwo, setPlayerTwo] = useState({})
	const [startGame, setStartGame] = useState(false)

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		if (isSubscribed) {
			// Establish socket connection //
			socket = io(ENDPOINT)

			const id = match.params.id
			const player = JSON.parse(localStorage.getItem('player'))

			socket.emit('enterPokerRoom', { id, player })

			socket.on('startGame', () => socket.emit('getPlayersInfo'))

			socket.on('getPlayersInfo', (player) => {
				player.id === id ? setPlayerOne(player) : setPlayerTwo(player)
				setStartGame(true)
			})
		}

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [match.params.id])

	if (!isLoggedIn) return <Redirect to='/login' />

	// if (!startGame) {
	// 	return (
	// 		<div className='card-room-container'>
	// 			<Paper className='waiting-display'>
	// 				<h5 className='waiting-text'>WAITING FOR OPPONENT</h5>
	// 			</Paper>
	// 		</div>
	// 	)
	// }

	return (
		<div className='card-room-container'>
			{
				<Table
					startGame={startGame}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
			}
		</div>
	)
}

export default PokerRoom
