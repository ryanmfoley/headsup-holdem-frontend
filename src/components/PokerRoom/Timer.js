import { useState, useEffect, useRef, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import timerAlert from '../../assets/sounds/timer-alert.wav'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		top: '100%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		alignItems: 'center',
		width: '35%',
		height: '20%',
		padding: '0 2%',
		background: 'rgba(255,255,255,0.1)',
		borderRadius: 500,
	},
	timerBar: {
		height: '35%',
		background: '#fff',
		borderRadius: 500,
	},
})

const Timer = ({ timeLeft, setTimeLeft, resetTimer }) => {
	const classes = useStyles()

	const timerRef = useRef()

	const [showTimer, setShowTimer] = useState(false)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		clearInterval(timerRef.currrent)

		let currentCount = 30
		const countDownTo = 0
		const timerAlertAudio = new Audio(timerAlert)
		timerAlertAudio.volume = 0.2

		timerRef.current = setInterval(() => {
			if (currentCount < 20) {
				if (!isMounted) return null

				// Display timer //
				setShowTimer(true)
				setTimeLeft((timeLeft) => timeLeft - 5)

				// Play sound when timer starts //
				if (currentCount === 19) timerAlertAudio.play()
			}

			if (currentCount === countDownTo) clearInterval(timerRef.current)

			currentCount--
		}, 1000)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			clearInterval(timerRef.current)
		}
	}, [setTimeLeft, resetTimer]) // resetTimer dependency allows the count to reset //

	return (
		<div
			className={classes.root}
			style={{ display: showTimer ? 'flex' : 'none' }}>
			<div className={classes.timerBar} style={{ width: `${timeLeft}%` }}></div>
		</div>
	)
}

export default memo(Timer)
