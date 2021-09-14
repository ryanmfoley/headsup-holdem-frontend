import { useState, useEffect } from 'react'
import { Box, Button, Paper, TextField } from '@material-ui/core'
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
	},
	chatInput: {
		color: 'white',
		width: '100%',
		height: '100%',
		margin: '0 5px',
		background: 'rgba(0, 0, 0, 0.5)',
		border: 'none',
	},
	sendButton: {
		color: 'white',
	},
})

const Chat = () => {
	const classes = useStyles()

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	// const [messages, setMessages] = useState([
	// 	{ user: 'ryan', text: 'hello' },
	// 	{ user: 'ryan', text: 'hello' },
	// 	{ user: 'ryan', text: 'hello' },
	// 	{ user: 'ryan', text: 'hello' },
	// ])

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
					{/* <TextField
							className={classes.chatInput}
							label='Type here to chat'
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={(e) => (e.key === 'Enter' ? handleSend(e) : null)}
							size='small'
							fullWidth
						/> */}
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
