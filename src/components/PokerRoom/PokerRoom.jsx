import React, { useState, useEffect } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { Button } from '@material-ui/core'

import socket from '../../config/socketConfig'
import Table from './Table'
import './PokerRoom.css'

const PokerRoom = ({ isLoggedIn, setIsLoggedIn }) => {
	////////////// TURN REDIRECT BACK ON //////////////

	const { id } = useParams()

	// Player data //
	const [playerOne, setPlayerOne] = useState({})
	const [playerTwo, setPlayerTwo] = useState({})
	const [playersName, setPlayersName] = useState('')
	const [opponentsName, setOpponentsName] = useState('')
	const [chips, setChips] = useState(10000)
	const [holeCards, setHoleCards] = useState([])
	const playerData = {
		playerOne,
		setPlayerOne,
		playerTwo,
		setPlayerTwo,
		playersName,
		setPlayersName,
		opponentsName,
		setOpponentsName,
		chips,
		setChips,
		holeCards,
		setHoleCards,
	}

	// Game variables //
	const [startGame, setStartGame] = useState(false)
	const [communityCards, setCommunityCards] = useState([])
	const [pot, setPot] = useState([])
	const [fold, setFold] = useState(false)
	const [check, setCheck] = useState(false)
	const [call, setCall] = useState(false)
	const [bet, setBet] = useState(false)
	const [raise, setRaise] = useState(false)
	const gameVariables = {
		startGame,
		setStartGame,
		communityCards,
		setCommunityCards,
		pot,
		setPot,
		fold,
		setFold,
		check,
		setCheck,
		call,
		setCall,
		bet,
		setBet,
		raise,
		setRaise,
	}

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		setPlayersName(currentPlayer.username)

		// Join socket to given room //
		socket.emit('enterPokerRoom', { id, currentPlayer })

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [id])

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		const currentPlayer = JSON.parse(localStorage.getItem('player'))
		const isPlayerOne = currentPlayer.id === id

		// Listen for opponent to enter the room //
		socket.once('startGame', () => socket.emit('getPlayersInfo', currentPlayer))

		socket.on('getPlayersInfo', (opponent) => {
			if (!isSubscribed) return null

			// Set opponents name //
			setOpponentsName(opponent.username)

			// Player who created the game is playerOne //
			setPlayerOne(isPlayerOne ? currentPlayer : opponent)
			setPlayerTwo(!isPlayerOne ? currentPlayer : opponent)

			// playerOne emits deal to server //
			if (isPlayerOne) socket.emit('deal')

			setStartGame(true)
		})

		// socket.on('deal', (cards) => {
		// 	if (!isSubscribed) return null

		// 	setCommunityCards(cards)

		// 	socket.emit('dealHoleCards', currentPlayer)
		// })

		socket.on(
			'deal',
			({ playerOneHoleCards, playerTwoHoleCards, communityCards }) => {
				if (!isSubscribed) return null

				setHoleCards(isPlayerOne ? playerOneHoleCards : playerTwoHoleCards)
				setCommunityCards(communityCards)
			}
		)

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [])

	// useEffect(() => {
	// 	window.addEventListener('beforeunload', () => socket.emit('logout'))
	// }, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className='card-room-container'>
			<Link to='/lobby'>
				<Button variant='contained'>Lobby</Button>
			</Link>
			<Table playerData={playerData} gameVariables={gameVariables} />
		</div>
	)
}

export default PokerRoom
