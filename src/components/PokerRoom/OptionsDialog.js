import { useState, memo } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Switch,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import woodenFloor from '../../assets/images/wooden-floor.png'
import grayFloor from '../../assets/images/gray-floor.png'
import blueFloor from '../../assets/images/blue-floor.png'
import redFloor from '../../assets/images/red-floor.png'

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		margin: 'auto',
		width: 'fit-content',
	},
	formControl: {
		marginTop: theme.spacing(2),
		minWidth: 120,
	},
	formControlLabel: {
		marginTop: theme.spacing(1),
	},
}))

// const OptionsDialog = ({ openOptionsDialog, setOpenOptionsDialog }) => {
const OptionsDialog = ({ setFloorOption }) => {
	const classes = useStyles()
	const [openOptionsDialog, setOpenOptionsDialog] = useState(false)

	const handleClickOpen = () => setOpenOptionsDialog(true)

	const handleClose = () => setOpenOptionsDialog(false)

	const handleFloorChange = (e) => setFloorOption(e.target.value)

	return (
		<>
			<Button variant='outlined' color='primary' onClick={handleClickOpen}>
				Options
			</Button>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={openOptionsDialog}
				onClose={handleClose}
				aria-labelledby='max-width-dialog-title'>
				<DialogTitle id='max-width-dialog-title'>
					Customize Poker Room
				</DialogTitle>
				<DialogContent>
					{/* <DialogContentText>
						You can set my maximum width and whether to adapt or not.
					</DialogContentText> */}
					<form className={classes.form} noValidate>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='floor'>Choose Floor</InputLabel>
							<Select
								autoFocus
								// value={}
								onChange={handleFloorChange}
								// inputProps={{
								// 	name: 'max-width',
								// 	id: 'max-width',
								// }}
							>
								<MenuItem value={woodenFloor}>Wooden Floor</MenuItem>
								<MenuItem value={grayFloor}>Gray Floor</MenuItem>
								<MenuItem value={blueFloor}>Blue Floor</MenuItem>
								<MenuItem value={redFloor}>Red Floor</MenuItem>
							</Select>
						</FormControl>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default memo(OptionsDialog)
