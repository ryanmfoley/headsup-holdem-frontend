import { useState, useEffect, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import useAudio from './useAudio'

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

const STARTING_COUNT = 60

const Timer = ({ timeLeft, setTimeLeft, resetTimer }) => {
	const classes = useStyles()

	const [showTimer, setShowTimer] = useState(false)

	const { timerAlertAudio } = useAudio()

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		let currentCount = STARTING_COUNT
		const countDownTo = 0

		const timer = setInterval(() => {
			if (!isMounted) return null

			if (currentCount < 20) {
				// Display timer //
				setShowTimer(true)
				setTimeLeft((timeLeft) => timeLeft - 5)

				// Play sound when timer starts //
				if (currentCount === 19) timerAlertAudio.play()
			}

			if (currentCount === countDownTo) clearInterval(timer)

			currentCount--
		}, 1000)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false

			clearInterval(timer)
		}
	}, [setTimeLeft, resetTimer, timerAlertAudio]) // resetTimer dependency allows the count to reset //

	return (
		<div
			className={classes.root}
			style={{ display: showTimer ? 'flex' : 'none' }}>
			<div className={classes.timerBar} style={{ width: `${timeLeft}%` }}></div>
		</div>
	)
}

export default memo(Timer)
