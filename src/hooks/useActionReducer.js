import { useReducer } from 'react'

const STARTING_CHIP_STACK = 10000

const reducer = (state, action) => {
	switch (action.type) {
		case 'postBlinds':
			return {
				...state,
				betAmount: action.callAmount,
				playersChips: state.playersChips - action.playersBlindAmount,
				opponentsChips: state.opponentsChips - action.opponentsBlindAmount,
				pot: action.playersBlindAmount + action.opponentsBlindAmount,
			}
		case 'playerBets':
			return {
				...state,
				betAmount: action.betAmount,
				playersChips: state.playersChips - action.betAmount,
				pot: state.pot + action.betAmount,
			}
		case 'opponentBets':
			return {
				...state,
				betAmount: action.betAmount,
				opponentsChips: state.opponentsChips - action.betAmount,
				pot: state.pot + action.betAmount,
			}
		case 'playerCalls':
			return {
				...state,
				betAmount: 0,
				playersChips: state.playersChips - state.betAmount,
				pot: state.pot + state.betAmount,
			}
		case 'opponentCalls':
			return {
				...state,
				betAmount: 0,
				opponentsChips: state.opponentsChips - state.betAmount,
				pot: state.pot + state.betAmount,
			}
		case 'playerWinsHand':
			return {
				...state,
				betAmount: 0,
				playersChips: state.playersChips + state.pot,
				pot: 0,
			}
		case 'opponentWinsHand':
			return {
				...state,
				betAmount: 0,
				opponentsChips: state.opponentsChips + state.pot,
				pot: 0,
			}
		case 'draw':
			const halfPot = state.pot / 2
			return {
				...state,
				betAmount: 0,
				playersChips: state.playersChips + halfPot,
				opponentsChips: state.opponentsChips + halfPot,
				pot: 0,
			}
		default:
			throw new Error()
	}
}

const initialState = {
	playersChips: STARTING_CHIP_STACK,
	opponentsChips: STARTING_CHIP_STACK,
	pot: 0,
	betAmount: 0,
}

const useActionReducer = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

	return [state, dispatch]
}

export default useActionReducer
