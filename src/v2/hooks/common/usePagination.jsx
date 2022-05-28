import useConfig from '../app/useConfig';
import useStorageRepo from './useStorageRepo';

export default function usePagination({ name = '', table = [], itemsPerPage = null, startingPage = 1 } = {}) {
	//Defaults
	const config = useConfig();
	if (!itemsPerPage) itemsPerPage = config.get('tables.itemsPerPage');
	//Definitions & typechecking
	itemsPerPage = isNaN(parseInt(itemsPerPage)) ? 5 : parseInt(itemsPerPage);
	startingPage = isNaN(parseInt(startingPage)) ? 1 : parseInt(startingPage);
	if (!Array.isArray(table)) table = [];
	const pageCount = table.length > 0 ? Math.ceil(table.length / itemsPerPage) : 1;
	if (startingPage < 1) startingPage = 1;
	if (startingPage > pageCount) startingPage = pageCount;
	if (!name || typeof name !== 'string') name = 'tablename';

	//Save pagination state
	const [currentPage, setCurrentPage] = useStorageRepo('pagination', name, startingPage);

	//Page change handler
	const onPageChange = (pageNumber = 0) => {
		pageNumber = parseInt(pageNumber);
		if (isNaN(pageNumber)) return;
		if (pageNumber > 0 && pageNumber <= pageCount) {
			setCurrentPage(pageNumber);
		}
	};

	const indexStart = (currentPage - 1) * itemsPerPage;
	const indexEnd = currentPage * itemsPerPage;

	return {
		count: table.length,
		currentPage,
		totalPages: pageCount,
		rows: table.slice(indexStart, indexEnd),
		onPageChange,
	};
}
