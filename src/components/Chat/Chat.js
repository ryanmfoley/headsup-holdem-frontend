import { useState, useEffect } from 'react'
import { Box, Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import DisplayMessages from './DisplayMessages'
import socket from '../../config/socketConfig'

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

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])

	const handleSend = (e) => {
		e.preventDefault()

		if (message) {
			// Send message to server
			socket.emit('send-chat-message', message, () => setMessage(''))
		}
	}

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		socket.on('chat-message', (message) => {
			if (!isMounted) return null

			setMessages((messages) => [...messages, message])
		})

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			socket.offAny()
		}
	}, [])

	return (
		<Paper className={classes.root}>
			<DisplayMessages messages={messages} />
			<Box display='flex'>
				<Box flexGrow={1} m={0} p={0}>
					<input
						type='text'
						className={classes.chatInput}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={(e) => (e.key === 'Enter' ? handleSend(e) : null)}
					/>
				</Box>
				<Box display='flex' alignItems='center'>
					<Button className={classes.sendButton} onClick={handleSend}>
						Send
					</Button>
				</Box>
			</Box>
		</Paper>
	)
}

export default Chat
