import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ScrollToBottom from 'react-scroll-to-bottom'

const useStyles = makeStyles({
	root: {
		flex: 'auto',
		height: '100px',
		overflow: 'auto',
	},
})

const DisplayMessages = ({ messages }) => {
	const classes = useStyles()

	if (messages.length) {
		return (
			<ScrollToBottom className={classes.root}>
				{messages.map(({ user, text }, index) => (
					<Box key={index} display='flex' alignItems='center'>
						<div
							style={{
								marginRight: '10px',
								padding: '0px',
								color: 'pink',
							}}>
							<p>{user}</p>
						</div>
						<Box display='flex'>
							<p style={{ margin: '0px', padding: '0px', color: 'white' }}>
								{text}
							</p>
						</Box>
					</Box>
				))}
			</ScrollToBottom>
		)
	}
	return <div className={classes.root}></div>
}

export default DisplayMessages
