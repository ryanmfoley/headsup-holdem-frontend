import { useState } from 'react'

// Using require silences TypeScript warning //
const betRaiseCallAlert = require('../../assets/sounds/bet-raise-call-alert.wav')
const checkAlert = require('../../assets/sounds/check-alert.wav')
const dealCard = require('../../assets/sounds/deal-card.wav')
const dealCards = require('../../assets/sounds/deal-cards.wav')
const foldAlert = require('../../assets/sounds/fold-alert.wav')
const timerAlert = require('../../assets/sounds/timer-alert.wav')
const winGame = require('../../assets/sounds/win-game.wav')
const winHand = require('../../assets/sounds/win-hand.wav')

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
