import { useReducer } from 'react'
import { STARTING_CHIP_STACK } from '../components/PokerRoom/PokerRoom'

export enum ActionType {
	postBlinds,
	playerBets,
	opponentBets,
	playerCalls,
	opponentCalls,
	playerWinsHand,
	opponentWinsHand,
	draw,
}

interface IState {
	playersChips: number
	opponentsChips: number
	pot: number
	betAmount: number
}

interface IAction {
	type: ActionType
	betAmount?: number
	callAmount?: number
	playersBlindAmount?: number
	opponentsBlindAmount?: number
}

const reducer = (state: IState, action: IAction): any => {
	switch (action.type) {
		case ActionType.postBlinds:
			return {
				playersChips:
					state.playersChips - (action.playersBlindAmount as number),
				opponentsChips:
					state.opponentsChips - (action.opponentsBlindAmount as number),
				pot:
					(action.playersBlindAmount as number) +
					(action.opponentsBlindAmount as number),
				betAmount: action.callAmount as number,
			}
		case ActionType.playerBets:
			return {
				playersChips: state.playersChips - (action.betAmount as number),
				opponentsChips: state.opponentsChips,
				pot: state.pot + (action.betAmount as number),
				betAmount: action.betAmount as number,
			}
		case ActionType.opponentBets:
			return {
				playersChips: state.playersChips,
				opponentsChips: state.opponentsChips - (action.betAmount as number),
				pot: state.pot + (action.betAmount as number),
				betAmount: action.betAmount as number,
			}
		case ActionType.playerCalls:
			return {
				playersChips: state.playersChips - state.betAmount,
				opponentsChips: state.opponentsChips,
				pot: state.pot + state.betAmount,
				betAmount: 0,
			}
		case ActionType.opponentCalls:
			return {
				playersChips: state.playersChips,
				opponentsChips: state.opponentsChips - state.betAmount,
				pot: state.pot + state.betAmount,
				betAmount: 0,
			}
		case ActionType.playerWinsHand:
			return {
				playersChips: state.playersChips + state.pot,
				opponentsChips: state.opponentsChips,
				pot: 0,
				betAmount: 0,
			}
		case ActionType.opponentWinsHand:
			return {
				playersChips: state.playersChips,
				opponentsChips: state.opponentsChips + state.pot,
				pot: 0,
				betAmount: 0,
			}
		case ActionType.draw:
			const halfPot = state.pot / 2
			return {
				playersChips: state.playersChips + halfPot,
				opponentsChips: state.opponentsChips + halfPot,
				pot: 0,
				betAmount: 0,
			}
		default:
			throw new Error()
	}
}

const initialState: IState = {
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
