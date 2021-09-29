import { useState, memo } from 'react'
import {
	Menu,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import woodenFloor from '../../assets/images/floors/wooden-floor.png'
import grayFloor from '../../assets/images/floors/gray-floor.png'
import blueFloor from '../../assets/images/floors/blue-floor.png'
import redFloor from '../../assets/images/floors/red-floor.png'
import greenTable from '../../assets/images/tables/green-table.png'
import blueTable from '../../assets/images/tables/blue-table.png'
import redTable from '../../assets/images/tables/red-table.png'
import grayTable from '../../assets/images/tables/gray-table.png'

const useStyles = makeStyles((theme) => ({
	optionsBtn: {
		marginLeft: '.4vw',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))

const Options = ({ setFloorOption, setTableOption, setDeckOption }) => {
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

	const handleDeckChange = (e) => setDeckOption(e.target.value)

	return (
		<>
			<button className={classes.optionsBtn} onClick={handleClick}>
				Options
			</button>
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
						defaultValue={woodenFloor}
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
						defaultValue={greenTable}
						onChange={handleTableChange}>
						<MenuItem value={greenTable}>Green</MenuItem>
						<MenuItem value={blueTable}>Blue</MenuItem>
						<MenuItem value={redTable}>Red</MenuItem>
						<MenuItem value={grayTable}>Gray</MenuItem>
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-deck-label'>Select Deck</InputLabel>
					<Select
						labelId='select-deck-label'
						defaultValue={'red-design'}
						onChange={handleDeckChange}>
						<MenuItem value={'red-design'}>Red Design</MenuItem>
						<MenuItem value={'gray-design'}>Gray Design</MenuItem>
						<MenuItem value={'red-plain'}>Red Plain</MenuItem>
						<MenuItem value={'gray-plain'}>Gray Plain</MenuItem>
					</Select>
				</FormControl>
			</Menu>
		</>
	)
}

export default memo(Options)
