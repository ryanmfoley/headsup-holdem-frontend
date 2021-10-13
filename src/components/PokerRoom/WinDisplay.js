import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import aceOfSpades from '../../assets/images/cards/AS.png'
import twoOfHearts from '../../assets/images/cards/2H.png'
import threeOfClubs from '../../assets/images/cards/3C.png'
import fourOfDiamonds from '../../assets/images/cards/4D.png'
import fiveOfSpades from '../../assets/images/cards/5S.png'
import sixOfHearts from '../../assets/images/cards/6H.png'
import sevenOfClubs from '../../assets/images/cards/7C.png'
import eightOfDiamonds from '../../assets/images/cards/8D.png'
import nineOfSpades from '../../assets/images/cards/9S.png'
import tenOfHearts from '../../assets/images/cards/10H.png'
import jackOfClubs from '../../assets/images/cards/JC.png'
import queenOfDiamonds from '../../assets/images/cards/QD.png'
import kingOfSpades from '../../assets/images/cards/KS.png'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		top: 0,
		opacity: 0,
		width: '4vw',
		'&:nth-child(1)': {
			left: '7%',
			transform: 'rotate(-40deg)',
			animation: '$makeItRain 2232ms ease-out infinite 182ms',
		},
		'&:nth-child(2)': {
			left: '14%',
			transform: 'rotate(4deg)',
			animation: '$makeItRain 2152ms ease-out infinite 161ms',
		},
		'&:nth-child(3)': {
			left: '21%',
			transform: 'rotate(-51deg)',
			animation: '$makeItRain 2206ms ease-out infinite 481ms',
		},
		'&:nth-child(4)': {
			left: '28%',
			transform: 'rotate(61deg)',
			animation: '$makeItRain 1416ms ease-out infinite 334ms',
		},
		'&:nth-child(5)': {
			left: '35%',
			transform: 'rotate(-52deg)',
			animation: '$makeItRain 1376ms ease-out infinite 604ms',
		},
		'&:nth-child(6)': {
			left: '42%',
			transform: 'rotate(38deg)',
			animation: '$makeItRain 2236ms ease-out infinite 180ms',
		},
		'&:nth-child(7)': {
			left: '49%',
			transform: 'rotate(11deg)',
			animation: '$makeItRain 4400ms ease-out infinite 695ms',
		},
		'&:nth-child(8)': {
			left: '56%',
			transform: 'rotate(49deg)',
			animation: '$makeItRain 974ms ease-out infinite 14ms',
		},
		'&:nth-child(9)': {
			left: '63%',
			transform: 'rotate(-72deg)',
			animation: '$makeItRain 1610ms ease-out infinite 149ms',
		},
		'&:nth-child(10)': {
			left: '70%',
			transform: 'rotate(10deg)',
			animation: '$makeItRain 1259ms ease-out infinite 351ms',
		},
		'&:nth-child(11)': {
			left: '77%',
			transform: 'rotate(4deg)',
			animation: '$makeItRain 2264ms ease-out infinite 307ms',
		},
		'&:nth-child(12)': {
			left: '84%',
			transform: 'rotate(42deg)',
			animation: '$makeItRain 852ms ease-out infinite 464ms',
		},
		'&:nth-child(13)': {
			left: '91%',
			transform: 'rotate(-72deg)',
			animation: '$makeItRain 1636ms ease-out infinite 429ms',
		},
		'&:nth-child(even)': {
			zIndex: 1,
		},
		'&:nth-child(3n)': {
			width: '2vw',
			animationDuration: '4000ms',
		},
		'&:nth-child(4n)': {
			width: '3vw',
			animationDelay: '1000ms',
			animationDuration: '5000ms',
		},
	},
	winDisplay: {
		position: 'absolute',
		top: '38%',
		left: '37.5%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '25vw',
		height: '11vw',
		zIndex: 1,
		background: 'rgba(0, 0, 0, 0.9)',
		color: 'white',
		fontFamily: 'Bangers',
		fontSize: '3vw',
		textAlign: 'center',
		borderRadius: '1vw',
		animation: '$scale-in-ver-center 1s both',
	},
	winDisplayText: {
		animation: '$tracking-in-expand-fwd 1s both',
	},
	'@keyframes makeItRain': {
		from: { opacity: 0 },
		'50%': { opacity: 1 },
		to: { transform: 'translateY(40vw)' },
	},
	'@keyframes scale-in-ver-center': {
		'0%': {
			transform: 'scaleY(0)',
			opacity: 1,
		},
		'100%': {
			transform: 'scaleY(1)',
			opacity: 1,
		},
	},
	'@keyframes tracking-in-expand-fwd': {
		'0%': {
			letterSpacing: '-0.5em',
			opacity: 0,
		},
		'40%': {
			opacity: '0.6',
		},
		'100%': {
			opacity: 1,
		},
	},
})

const WinDisplay = ({ winner }) => {
	const classes = useStyles()

	const cards = [
		aceOfSpades,
		twoOfHearts,
		threeOfClubs,
		fourOfDiamonds,
		fiveOfSpades,
		sixOfHearts,
		sevenOfClubs,
		eightOfDiamonds,
		nineOfSpades,
		tenOfHearts,
		jackOfClubs,
		queenOfDiamonds,
		kingOfSpades,
	]

	return (
		<Box>
			{cards.map((card) => (
				<img
					key={card}
					src={card}
					className={classes.root}
					alt='playing card'
					draggable='true'
				/>
			))}
			<div className={classes.winDisplay}>
				<h2 className={classes.winDisplayText}>{winner} wins</h2>
			</div>
		</Box>
	)
}

export default WinDisplay
