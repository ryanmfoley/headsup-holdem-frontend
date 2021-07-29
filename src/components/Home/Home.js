import { makeStyles } from '@material-ui/core/styles'

import pokerBanner from '../../assets/images/poker-banner.jpg'

const useStyles = makeStyles((theme) => ({
	pokerBanner: {
		width: '100%',
	},
}))

const Home = () => {
	const classes = useStyles()

	return (
		<div>
			<img
				className={classes.pokerBanner}
				src={pokerBanner}
				alt='poker banner'
			/>
		</div>
	)
}

export default Home
