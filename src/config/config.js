const apiUrl =
	window.location.hostname === 'localhost'
		? 'http://localhost:3000/api/users'
		: 'https://headsup-holdem-backend.herokuapp.com/api/users'

export default apiUrl
