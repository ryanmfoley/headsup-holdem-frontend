import Header from '../Header/Header'
import pokerBanner from '../../assets/images/poker-banner.jpg'

const Home = () => (
	<>
		<Header />
		<img style={{ width: '100%' }} src={pokerBanner} alt='poker banner' />
	</>
)

export default Home
