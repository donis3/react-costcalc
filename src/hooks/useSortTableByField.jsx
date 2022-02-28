import useStorageRepo from './useStorageRepo';
import config from '../config/config.json';

export default function useSortTableByField(tableName = 'tbl', fields = [], defaultField = null) {
	const [sortState, setSortState] = useStorageRepo(
		'table-sorting',
		tableName,
		generateDefaultData(fields, defaultField)
	);

	/**
	 * Change sort state for the table.
	 * Sort by ASCENDING by default, Will toggle to DESC when sorting same field again
	 * @param {*} field Name of the field to be sorted by
	 * @returns void
	 */
	const changeSortState = (field = null) => {
		//Make sure field exists
		if (!field || !Array.isArray(fields) || !fields.includes(field)) return null;
		//Default sort state for this field
		const newSortingState = { field: field, asc: true };
		//Check if field is already sorted
		if (sortState && typeof sortState === 'object' && sortState?.field && sortState.field === field) {
			//Sorting same field again, let asc be opposite
			newSortingState.asc = !sortState.asc;
		}
		//save
		setSortState(newSortingState);
	};

	//Expose state and setState handler
	return [sortState, changeSortState];
}

//Generate initial state for table sorting status.
const generateDefaultData = (fields, defaultField) => {
	if (!fields || !Array.isArray(fields) || fields.length === 0) {
		config.debug.storage && console.error('useSortTableByField could not generate default sorting state');
		return { field: 'missingFieldData', asc: true };
	}
	if (!defaultField || fields.includes(defaultField) === false) defaultField = fields[0];

	//Default sorting state for this table
	return { field: defaultField, asc: true };
};
