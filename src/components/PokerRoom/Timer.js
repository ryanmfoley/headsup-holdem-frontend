import { useState, useEffect, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		position: 'relative',
		top: '100%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		alignItems: 'center',
		width: '35%',
		height: '20%',
		padding: '0 5px',
		background: 'rgba(255,255,255,0.1)',
		borderRadius: '100px',
	},
	timerBar: {
		boxShadow: '0 10px 40px -10px #fff',
		borderRadius: '100px',
		background: '#fff',
		height: '35%',
	},
})

const Timer = ({ timeLeft, setTimeLeft, resetTimer }) => {
	const classes = useStyles()
	const [showTimer, setShowTimer] = useState(false)

	useEffect(() => {
		// Clean up controller //
		let isMounted = true

		clearInterval(window.timerId)

		let currentCount = 30
		const countDownTo = 0

		window.timerId = setInterval(() => {
			if (currentCount < 20) {
				if (!isMounted) return null

				setShowTimer(true)
				setTimeLeft((timeLeft) => timeLeft - 5)
			}

			if (currentCount === countDownTo) {
				clearInterval(window.timerId)
			}
			currentCount--
		}, 1000)

		// Cancel subscription to useEffect //
		return () => {
			isMounted = false
			clearInterval(window.timerId)
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
