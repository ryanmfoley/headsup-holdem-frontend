import { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import io from 'socket.io-client'

import ENDPOINT from '../../config/config'
import Table from './Table'
import './PokerRoom.css'

let socket

const useStyles = makeStyles({
	cardRoom: {
		width: '100vw',
		height: '100vh',
		background: '#242173',
	},
})

const PokerRoom = ({ match, isLoggedIn, setIsLoggedIn }) => {
	const classes = useStyles()

	const [playerOne, setPlayerOne] = useState({})
	const [playerTwo, setPlayerTwo] = useState({})
	// const playerOne = JSON.parse(window.localStorage.getItem('player'))

	// Grab player info from localStorage //
	const player = JSON.parse(localStorage.getItem('player'))

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		// Establish socket connection //
		socket = io(ENDPOINT)

		// const player = JSON.parse(localStorage.getItem('player'))
		const id = match.params.id

		socket.emit('joinGame', { id, player })

		socket.on('startGame', () => {
			console.log('startGame')
			socket.emit('getPlayersInfo')
		})

		socket.on('getPlayersInfo', (player) => {
			// if (isSubscribed)
			// 	player.id === id ? setPlayerOne(player) : setPlayerTwo(player)
			if (isSubscribed) {
				player.id === id ? setPlayerOne(player) : setPlayerTwo(player)
				console.log(player, playerOne, playerTwo)
			}
		})

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.emit('logout')
			socket.offAny()
		}
	}, [player, playerOne, playerTwo, match.params.id])

	if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<>
			<Table playerOne={playerOne} playerTwo={playerTwo} />
		</>
	)
}

export default PokerRoom
