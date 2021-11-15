import { useState, useEffect, useContext, useRef, memo } from 'react'
import { Box, Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SocketContext from '../../contexts/SocketContext'
import DisplayMessages from './DisplayMessages'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '80%',
		background: 'rgba(0, 0, 0, 0.5)',
		margin: 0,
		padding: '1%',
	},
	chatInput: {
		color: 'white',
		width: '95%',
		height: '100%',
		paddingLeft: '2.5%',
		background: 'rgba(0, 0, 0, 0.5)',
		border: 'none',
		'&:focus': {
			outline: '.05vw solid white',
		},
	},
	sendButton: {
		minWidth: '6vw',
		padding: '.1vw',
		color: '#878787',
		fontSize: '1.3vw',
		border: '.1vw solid #878787',
	},
})

const Chat = () => {
	const classes = useStyles()

	const { socket } = useContext(SocketContext)

	const _isMounted = useRef(true)

	const messageRef = useRef('')
	const [messages, setMessages] = useState([])

	const handleSend = (e) => {
		e.preventDefault()

		if (messageRef.current.value)
			// Send message to server
			socket.emit(
				'send-chat-message',
				messageRef.current.value,
				() => (messageRef.current.value = '')
			)
	}

	useEffect(() => {
		socket.on('chat-message', (message) => {
			if (!_isMounted.current) return null

			setMessages((messages) => [...messages, message])
		})

		// Cancel subscription to useEffect //
		return () => {
			_isMounted.current = false

			socket.offAny()
		}
	}, [socket])

	return (
		<Paper className={classes.root}>
			<DisplayMessages messages={messages} />
			<form onSubmit={handleSend}>
				<Box display='flex'>
					<Box flexGrow={1} m={0} p={0}>
						<input
							type='text'
							className={classes.chatInput}
							ref={(message) => (messageRef.current = message)}
							autoComplete='off'
						/>
					</Box>
					<Box display='flex' alignItems='center'>
						<Button type='submit' className={classes.sendButton}>
							Send
						</Button>
					</Box>
				</Box>
			</form>
		</Paper>
	)
}

export default memo(Chat)
