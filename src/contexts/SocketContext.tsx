import { createContext } from 'react'
import { io, Socket } from 'socket.io-client'

import ENDPOINT from '../config/config'

export const socket: Socket = io(ENDPOINT, {
	closeOnBeforeunload: false,
})

const SocketContext = createContext<any>(socket)

export default SocketContext
