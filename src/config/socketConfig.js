import { io } from 'socket.io-client'

import ENDPOINT from './config'

const socket = io(ENDPOINT, { closeOnBeforeunload: false })

export default socket
