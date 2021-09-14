import { useState, memo } from 'react'
import {
	Button,
	Menu,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import woodenFloor from '../../assets/images/wooden-floor.png'
import grayFloor from '../../assets/images/gray-floor.png'
import blueFloor from '../../assets/images/blue-floor.png'
import redFloor from '../../assets/images/red-floor.png'
import greenTable from '../../assets/images/green-table.png'
import blueTable from '../../assets/images/blue-table.png'
import redTable from '../../assets/images/red-table.png'
import grayTable from '../../assets/images/gray-table.png'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))

const Options = ({ setFloorOption, setTableOption }) => {
	const classes = useStyles()
	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleFloorChange = (e) => setFloorOption(e.target.value)

	const handleTableChange = (e) => setTableOption(e.target.value)

	return (
		<div>
			<Button
				variant='outlined'
				color='secondary'
				size='small'
				aria-controls='simple-menu'
				aria-haspopup='true'
				onClick={handleClick}>
				Options
			</Button>
			<Menu
				id='simple-menu'
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-floor-label'>Select Floor</InputLabel>
					<Select
						labelId='select-floor-label'
						// value={}
						onChange={handleFloorChange}>
						<MenuItem value={woodenFloor}>Wooden</MenuItem>
						<MenuItem value={grayFloor}>Gray</MenuItem>
						<MenuItem value={blueFloor}>Blue</MenuItem>
						<MenuItem value={redFloor}>Red</MenuItem>
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-table-label'>Select Table</InputLabel>
					<Select
						labelId='select-table-label'
						// value={}
						onChange={handleTableChange}>
						<MenuItem value={greenTable}>Green</MenuItem>
						<MenuItem value={blueTable}>blue</MenuItem>
						<MenuItem value={redTable}>Red</MenuItem>
						<MenuItem value={grayTable}>Gray</MenuItem>
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-deck-label'>Select Deck</InputLabel>
					<Select
						labelId='select-deck-label'
						// value={12}
						onChange={handleFloorChange}>
						<MenuItem value={woodenFloor}>Wooden</MenuItem>
						<MenuItem value={grayFloor}>Gray</MenuItem>
						<MenuItem value={blueFloor}>Blue</MenuItem>
						<MenuItem value={redFloor}>Red</MenuItem>
					</Select>
				</FormControl>
			</Menu>
		</div>
	)
}

export default memo(Options)
