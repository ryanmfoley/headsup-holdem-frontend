import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ScrollToBottom from 'react-scroll-to-bottom'

const useStyles = makeStyles({
	root: {
		flex: 'auto',
		height: '10vw',
		overflow: 'auto',
	},
})

const DisplayMessages = ({ messages }) => {
	const classes = useStyles()

	return messages.length ? (
		<ScrollToBottom className={classes.root}>
			{messages.map(({ user, text }, index) => (
				<Box
					key={index}
					display='flex'
					alignItems='center'
					sx={{ padding: '1.3% 0%' }}>
					<div
						style={{
							marginRight: '3%',
							color: 'teal',
						}}>
						<p style={{ margin: 0, padding: 0 }}>{user}:</p>
					</div>
					<Box display='flex'>
						<p style={{ margin: 0, padding: 0, color: 'white' }}>{text}</p>
					</Box>
				</Box>
			))}
		</ScrollToBottom>
	) : (
		<div className={classes.root}></div>
	)
}

export default DisplayMessages
