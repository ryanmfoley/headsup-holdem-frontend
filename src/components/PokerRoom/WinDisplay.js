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
import tenOfHearts from '../../assets/images/cards/TH.png'
import jackOfClubs from '../../assets/images/cards/JC.png'
import queenOfDiamonds from '../../assets/images/cards/QD.png'
import kingOfSpades from '../../assets/images/cards/KS.png'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		top: 0,
		opacity: 0,
		width: '5%',
		'&:nth-child(1)': {
			left: '7%',
			transform: 'rotate(-40deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '182ms',
			'animation-duration': '1416ms',
		},
		'&:nth-child(2)': {
			left: '14%',
			transform: 'rotate(14deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '161ms',
			'animation-duration': '1376ms',
		},
		'&:nth-child(3)': {
			left: '21%',
			transform: 'rotate(-51deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '481ms',
			'animation-duration': '1403ms',
		},
		'&:nth-child(4)': {
			left: '28%',
			transform: 'rotate(61deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '334ms',
			'animation-duration': '1308ms',
		},
		'&:nth-child(5)': {
			left: '35%',
			transform: 'rotate(-52deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '302ms',
			'animation-duration': '1376ms',
		},
		'&:nth-child(6)': {
			left: '42%',
			transform: 'rotate(38deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '180ms',
			'animation-duration': '1468ms',
		},
		'&:nth-child(7)': {
			left: '49%',
			transform: 'rotate(11deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '395ms',
			'animation-duration': '1500ms',
		},
		'&:nth-child(8)': {
			left: '56%',
			transform: 'rotate(49deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '14ms',
			'animation-duration': '1187ms',
		},
		'&:nth-child(9)': {
			left: '63%',
			transform: 'rotate(-72deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '149ms',
			'animation-duration': '1105ms',
		},
		'&:nth-child(10)': {
			left: '70%',
			transform: 'rotate(10deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '351ms',
			'animation-duration': '1359ms',
		},
		'&:nth-child(11)': {
			left: '77%',
			transform: 'rotate(-24deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '278ms',
			'animation-duration': '1333ms',
		},
		'&:nth-child(12)': {
			left: '84%',
			transform: 'rotate(42deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '464ms',
			'animation-duration': '1076ms',
		},
		'&:nth-child(13)': {
			left: '91%',
			transform: 'rotate(-72deg)',
			animation: '$makeItRain 1000ms infinite ease-out',
			'animation-delay': '220ms',
			'animation-duration': '1318ms',
		},
		'&:nth-child(even)': {
			zIndex: 1,
		},
		'&:nth-child(3n)': {
			width: '28px',
			height: '40px',
			margin: '2px',
			'animation-duration': '2300ms',
		},
		'&:nth-child(4n)': {
			width: '42px',
			height: '60px',
			margin: '3px',
			'animation-delay': '1000ms',
			'animation-duration': '2800ms',
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
		to: { transform: 'translateY(550%)' },
	},
	'@keyframes tracking-in-expand-fwd': {
		'0%': {
			letterSpacing: '-0.5em',
			transform: 'translateZ(-700px)',
			opacity: 0,
		},
		'40%': {
			opacity: '0.6',
		},
		'100%': {
			transform: 'translateZ(0)',
			opacity: 1,
		},
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
				/>
			))}
			<div className={classes.winDisplay}>
				<h2 className={classes.winDisplayText}>{winner} wins</h2>
			</div>
		</Box>
	)
}

export default WinDisplay
