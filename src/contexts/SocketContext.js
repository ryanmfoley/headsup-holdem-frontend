import { createContext } from 'react'
import { io } from 'socket.io-client'

import ENDPOINT from '../config/config'

export const socket = io(ENDPOINT, { closeOnBeforeunload: false })

const SocketContext = createContext()

export default SocketContext
