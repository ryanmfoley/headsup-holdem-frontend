import { makeStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import pokerBanner from '../../assets/images/poker-banner.jpg'

const useStyles = makeStyles((theme) => ({
	pokerBanner: {
		width: '100%',
	},
}))

const Home = () => {
	const classes = useStyles()

	return (
		<>
			<Header />
			<img
				className={classes.pokerBanner}
				src={pokerBanner}
				alt='poker banner'
			/>
		</>
	)
}

export default Home
