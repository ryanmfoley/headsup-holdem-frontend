import { Link } from 'react-router-dom'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GitHubIcon from '@material-ui/icons/GitHub'
import LinkedInIcon from '@material-ui/icons/LinkedIn'

const useStyles = makeStyles({
	roleText: {
		textAlign: 'center',
		fontSize: '20px',
		color: 'white',
	},
	nameText: {
		textAlign: 'center',
		fontSize: '28px',
		color: '#f44336',
		fontWeight: 400,
	},
	socialIcon: {
		width: '38px',
		height: '38px',
		margin: '5px',
		color: 'white',
	},
})

const Footer = () => {
	const classes = useStyles()

	return (
		<footer>
			<Typography className={classes.roleText} variant='h2'>
				Developer
			</Typography>
			<Typography className={classes.nameText} variant='h2'>
				Ryan Foley
			</Typography>
			<Box display='flex' justifyContent='center'>
				<Link to='https://www.linkedin.com/in/ryanmfoley84/' target='_blank'>
					<LinkedInIcon className={classes.socialIcon} />
				</Link>
				<Link to='https://github.com/ryanmfoley' target='_blank'>
					<GitHubIcon className={classes.socialIcon} />
				</Link>
			</Box>
		</footer>
	)
}

export default Footer
