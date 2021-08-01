import { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core'
import io from 'socket.io-client'

import ENDPOINT from '../../config/config'

const StyledTableCell = withStyles((theme) => ({
	head: {
		background: '#333333',
		color: 'white',
	},
	body: {
		fontSize: 14,
		color: 'black',
	},
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
	root: {
		background: '#fafafa',
	},
}))(TableRow)

const useStyles = makeStyles({
	lobbyContainer: {
		background: 'pink',
		margin: '60px auto',
	},
	table: {
		width: 300,
	},
})

let socket

const Lobby = ({ isLoggedIn, setIsLoggedIn }) => {
	const classes = useStyles()

	const [player, setPlayer] = useState({})
	const [playersWaiting, setPlayersWaiting] = useState([])

	const createGame = () => socket.emit('createGame', player)

	const joinGame = (e) =>
		socket.emit('updatePlayersWaiting', e.target.dataset.id)

	useEffect(() => {
		// Clean up controller //
		let isSubscribed = true

		socket = io(ENDPOINT)

		const username = JSON.parse(localStorage.getItem('username'))

		socket.emit('enterLobby', username)
		socket.on('enterLobby', (player) => {
			if (!isSubscribed) return null

			if (player.username === username) {
				setPlayer(player)
				localStorage.setItem('player', JSON.stringify(player))
			}
		})

		socket.on(
			'playersWaiting',
			(players) => isSubscribed && setPlayersWaiting(players)
		)

		// Cancel subscription to useEffect //
		return () => {
			isSubscribed = false
			socket.offAny()
		}
	}, [setPlayersWaiting])

	if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.lobbyContainer}>
			<TableContainer component={Paper}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<StyledTableCell>Name</StyledTableCell>
							<StyledTableCell align='right'>Invite</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{playersWaiting.map((player) => (
							<StyledTableRow key={player.id}>
								<StyledTableCell component='th' scope='player'>
									{player.username}
								</StyledTableCell>
								<StyledTableCell align='right'>
									<Link
										to={`/poker-room/${player.id}`}
										style={{ textDecoration: 'none' }}>
										<Button
											color='primary'
											variant='contained'
											onClick={joinGame}>
											<span data-id={player.id}>Play</span>
										</Button>
									</Link>
								</StyledTableCell>
							</StyledTableRow>
						))}
						<StyledTableRow>
							<StyledTableCell component='th' />
							<StyledTableCell component='th' />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell component='th' />
							<StyledTableCell component='th' />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell component='th' />
							<StyledTableCell component='th' />
						</StyledTableRow>
					</TableBody>
				</Table>
				<Link
					to={`/poker-room/${player.id}`}
					style={{ textDecoration: 'none' }}>
					<Button
						variant='contained'
						size='large'
						onClick={createGame}
						fullWidth>
						CREATE GAME
					</Button>
				</Link>
			</TableContainer>
		</div>
	)
}

export default Lobby
