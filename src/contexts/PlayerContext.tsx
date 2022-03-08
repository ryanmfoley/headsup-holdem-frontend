import { createContext } from 'react'

interface IPlayerContext {
	player: {
		id: number | null
		username: string
	}
	setPlayer: React.Dispatch<
		React.SetStateAction<{
			id: number | null
			username: string
		}>
	>
}

const PlayerContext = createContext<IPlayerContext>({
	player: { id: null, username: '' },
	setPlayer: () => {},
})

export default PlayerContext
