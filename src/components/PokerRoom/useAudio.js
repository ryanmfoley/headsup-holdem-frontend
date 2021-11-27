import { useState } from 'react'

import betRaiseCallAlert from '../../assets/sounds/bet-raise-call-alert.wav'
import checkAlert from '../../assets/sounds/check-alert.wav'
import dealCard from '../../assets/sounds/deal-card.wav'
import dealCards from '../../assets/sounds/deal-cards.wav'
import foldAlert from '../../assets/sounds/fold-alert.wav'
import timerAlert from '../../assets/sounds/timer-alert.wav'
import winGame from '../../assets/sounds/win-game.wav'
import winHand from '../../assets/sounds/win-hand.wav'

const useAudio = () => {
	const [betRaiseCallAlertAudio] = useState(new Audio(betRaiseCallAlert))
	const [checkAlertAudio] = useState(new Audio(checkAlert))
	const [dealCardAudio] = useState(new Audio(dealCard))
	const [dealCardsAudio] = useState(new Audio(dealCards))
	const [foldAlertAudio] = useState(new Audio(foldAlert))
	const [timerAlertAudio] = useState(new Audio(timerAlert))
	const [winHandAudio] = useState(new Audio(winHand))
	const [winGameAudio] = useState(new Audio(winGame))

	dealCardAudio.volume = 0.2
	timerAlertAudio.volume = 0.2

	return {
		betRaiseCallAlertAudio,
		checkAlertAudio,
		dealCardAudio,
		dealCardsAudio,
		foldAlertAudio,
		timerAlertAudio,
		winHandAudio,
		winGameAudio,
	}
}

export default useAudio
