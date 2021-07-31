import { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import io from 'socket.io-client'

import ENDPOINT from '../../config/config'
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
			socket.emit('getPlayersInfo')
		})

		socket.on('getPlayersInfo', (player) => {
			if (isSubscribed)
				player.id === id ? setPlayerOne(player) : setPlayerTwo(player)
		})

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.emit('logout')
			socket.offAny()
		}
	}, [player, match.paramsid])

	if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<Grid container justifyContent='center' className={classes.cardRoom}>
			<div class='table'>
				<div class='community-cards'>
					<div class='card'>
						<p class='card-text red'>10</p>
						<p class='card-img red'>&diams;</p>
					</div>
					<div class='card'>
						<p class='card-text black'>J</p>
						<p class='card-img black'>&clubs;</p>
					</div>
					<div class='card'>
						<p class='card-text red'>Q</p>
						<p class='card-img red'>&hearts;</p>
					</div>
					<div class='card'>
						<p class='card-text red'>K</p>
						<p class='card-img red'>&diams;</p>
					</div>
					<div class='card'>
						<p class='card-text black'>A</p>
						<p class='card-img black'>&spades;</p>
					</div>
				</div>
			</div>
		</Grid>
	)
}

export default PokerRoom
