import React, { useState, memo } from 'react'
import {
	Button,
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

interface IProps {
	setFloorOption: React.Dispatch<React.SetStateAction<string>>
	setTableOption: React.Dispatch<React.SetStateAction<string>>
	setDeckOption: React.Dispatch<React.SetStateAction<string>>
}

const useStyles = makeStyles({
	optionsBtn: {
		marginLeft: '.4vw',
		border: '.12vw solid transparent',
		'&:hover': {
			color: 'blue',
			border: '.12vw solid blue',
		},
	},
	formControl: {
		margin: '.5vmin',
		minWidth: 120,
	},
})

const DisplayOptions = ({
	setFloorOption,
	setTableOption,
	setDeckOption,
}: IProps) => {
	const classes = useStyles()

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(e.currentTarget)

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleFloorChange = (e: React.MouseEvent<HTMLLIElement>) => {
		const { value } = (e.target as HTMLLIElement).dataset
		setFloorOption(value ? value : woodenFloor)
	}

	const handleTableChange = (e: React.MouseEvent<HTMLLIElement>) => {
		const { value } = (e.target as HTMLLIElement).dataset
		setTableOption(value ? value : greenTable)
	}

	const handleDeckChange = (e: React.MouseEvent<HTMLLIElement>) => {
		const { value } = (e.target as HTMLLIElement).dataset
		setDeckOption(value ? value : 'red-design')
	}

	return (
		<>
			<Button
				className={classes.optionsBtn}
				variant='contained'
				onClick={handleClick}></Button>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-floor-label'>Select Floor</InputLabel>
					<Select labelId='select-floor-label' defaultValue={woodenFloor}>
						<MenuItem value={woodenFloor} onMouseEnter={handleFloorChange}>
							Wooden
						</MenuItem>
						<MenuItem value={grayFloor} onMouseEnter={handleFloorChange}>
							Gray
						</MenuItem>
						<MenuItem value={blueFloor} onMouseEnter={handleFloorChange}>
							Blue
						</MenuItem>
						<MenuItem value={redFloor} onMouseEnter={handleFloorChange}>
							Red
						</MenuItem>
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-table-label'>Select Table</InputLabel>
					<Select labelId='select-table-label' defaultValue={greenTable}>
						<MenuItem value={greenTable} onMouseEnter={handleTableChange}>
							Green
						</MenuItem>
						<MenuItem value={blueTable} onMouseEnter={handleTableChange}>
							Blue
						</MenuItem>
						<MenuItem value={redTable} onMouseEnter={handleTableChange}>
							Red
						</MenuItem>
						<MenuItem value={grayTable} onMouseEnter={handleTableChange}>
							Gray
						</MenuItem>
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='select-deck-label'>Select Deck</InputLabel>
					<Select labelId='select-deck-label' defaultValue={'red-design'}>
						<MenuItem value={'red-design'} onMouseEnter={handleDeckChange}>
							Red Design
						</MenuItem>
						<MenuItem value={'gray-design'} onMouseEnter={handleDeckChange}>
							Gray Design
						</MenuItem>
						<MenuItem value={'red-plain'} onMouseEnter={handleDeckChange}>
							Red Plain
						</MenuItem>
						<MenuItem value={'gray-plain'} onMouseEnter={handleDeckChange}>
							Gray Plain
						</MenuItem>
					</Select>
				</FormControl>
			</Menu>
		</>
	)
}

export default memo(DisplayOptions)
