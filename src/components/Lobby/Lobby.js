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

import Header from '../Header/Header'
import ENDPOINT from '../../config/config'

let socket

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
	root: {
		background: 'pink',
	},
	table: {
		width: 'min(40%, 500px)',
		margin: '100px auto',
	},
})

const Lobby = ({ isLoggedIn, setIsLoggedIn }) => {
	////////////// TURN REDIRECT BACK ON //////////////

	const classes = useStyles()
	const [player, setPlayer] = useState({})
	const [playersWaiting, setPlayersWaiting] = useState([])

	const createGame = () => socket.emit('create-game', player)

	const joinGame = (e) =>
		socket.emit('update-players-waiting', e.target.dataset.id)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket = io(ENDPOINT)

		const username = JSON.parse(localStorage.getItem('username'))

		socket.emit('enter-lobby', username)

		socket.once('enter-lobby', (player) => {
			if (!isMounted) return null

			setPlayer(player)
			localStorage.setItem('player', JSON.stringify(player))
		})

		socket.on(
			'players-waiting',
			(players) => isMounted && setPlayersWaiting(players)
		)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.disconnect()
		}
	}, [])

	// if (!isLoggedIn) return <Redirect to='/login' />

	return (
		<div className={classes.root}>
			<Header />
			<TableContainer component={Paper} className={classes.table}>
				<Table>
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
										to={`/rooms/${player.id}`}
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
				<Link to={`/rooms/${player.id}`} style={{ textDecoration: 'none' }}>
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
