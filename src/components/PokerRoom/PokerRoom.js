import { useState, useEffect } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import io from 'socket.io-client'

import ENDPOINT from '../../config/config'
import Table from './Table'
import './PokerRoom.css'

let socket

const PokerRoom = ({ isLoggedIn, setIsLoggedIn }) => {
	const { id } = useParams()

	const [playerOne, setPlayerOne] = useState({})
	const [playerTwo, setPlayerTwo] = useState({})
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [holeCards, setHoleCards] = useState([])
	const [startGame, setStartGame] = useState(false)
	const [communityCards, setCommunityCards] = useState([])

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		// Establish socket connection //
		socket = io(ENDPOINT)

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		setPlayersName(currentPlayer.username)

		socket.emit('enterPokerRoom', { id, currentPlayer })

		// Listen for opponent to enter the room //
		socket.on('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.on('getPlayersInfo', (player) => {
			if (!isSubscribed) return null

			// Player who created the game is playerOne //
			player.id === id ? setPlayerOne(player) : setPlayerTwo(player)

			// Set opponents name //
			if (currentPlayer.username !== player.username)
				setOpponentsName(player.username)
			setStartGame(true)

			socket.emit('deal')
		})

		socket.on('dealHoleCards', (cards) => {
			if (!isSubscribed) return null

			setHoleCards(cards)
		})

		socket.on('dealCommunityCards', (cards) => {
			if (!isSubscribed) return null

			setCommunityCards(cards)
		})

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [id])

	if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className='card-room-container'>
			<Link to='/lobby'>
				<button>Lobby</button>
			</Link>
			<Table
				startGame={startGame}
				playersName={playersName}
				opponentsName={opponentsName}
				holeCards={holeCards}
				communityCards={communityCards}
			/>
		</div>
	)
}

export default PokerRoom
