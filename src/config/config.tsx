const apiUrl =
	window.location.hostname === 'localhost'
		? 'http://localhost:3000'
		: 'https://headsup-holdem-backend.herokuapp.com'

export default apiUrl
