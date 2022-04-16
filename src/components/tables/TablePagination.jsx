import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	FaAngleLeft as PreviousIcon,
	FaAngleRight as NextIcon,
	FaAngleDoubleLeft as FirstIcon,
	FaAngleDoubleRight as LastIcon,
} from 'react-icons/fa';
import useConfig from '../../hooks/app/useConfig';

export default function TablePagination({ current, total, handler, arrows, doubleArrows, itemCount, perPage }) {
	const { t } = useTranslation('translation');
	const config = useConfig();
	if (!perPage || isNaN(parseInt(perPage))) perPage = config.get('tables.itemsPerPage');
	if (isNaN(parseInt(current))) current = 0;
	if (isNaN(parseInt(total))) total = 0;
	const pages = usePagination({
		current,
		total,
		limit: 5, //How many buttons to show
		addArrows: arrows,
		addDoubleArrows: doubleArrows,
	});
	if (current <= 1 && total <= 1) return <></>; //No need for pagination

	const getHandler = (pageNum = null) => {
		switch (pageNum) {
			case 'first': {
				return () => handler(1);
			}
			case 'last': {
				return () => handler(total);
			}
			case 'previous': {
				return () => handler(current - 1);
			}
			case 'next': {
				return () => handler(current + 1);
			}

			default: {
				const num = parseInt(pageNum);
				if (isNaN(num) || num === current) return null;
				return () => handler(num);
			}
		}
	};

	const getBtnText = (pageNum = null) => {
		switch (pageNum) {
			case 'first': {
				return <FirstIcon />;
			}
			case 'last': {
				return <LastIcon />;
			}
			case 'previous': {
				return <PreviousIcon />;
			}
			case 'next': {
				return <NextIcon />;
			}
			default: {
				return pageNum;
			}
		}
	};

	//Calculate start and end counts
	const startCount = (current - 1) * perPage;
	const endCount = current * perPage > itemCount ? itemCount : current * perPage;

	return (
		<div className='flex flex-col items-center mt-5 gap-y-1'>
			<div className='btn-group'>
				{pages.map((page, i) => {
					const handleClick = getHandler(page);
					if (handleClick) {
						return (
							<button type='button' key={i} className='btn btn-ghost btn-sm lg:btn-md' onClick={handleClick}>
								{getBtnText(page)}
							</button>
						);
					} else {
						return (
							<button type='button' key={i} className='btn btn-ghost btn-sm lg:btn-md btn-active '>
								{getBtnText(page)}
							</button>
						);
					}
				})}
			</div>
			<div>
				<span className='text-xs opacity-70'>
					{/* Show start-end of total text */}
					{t('pagination.info', { start: startCount, end: endCount, total: itemCount })}
				</span>
			</div>
		</div>
	);
}

TablePagination.defaultProps = {
	current: 0,
	total: 0,
	handler: (page) => console.log(`Pagination missing onClick handler for page ${page}`),
	arrows: true,
	doubleArrows: true,
	itemCount: 0,
	perPage: null,
};

/**
 * Trying to get  « 1 ... 45 46 47 ... 100 »
 * @param {*} param0
 */
function usePagination({ current = 0, total = 0, limit = 5, addArrows = true, addDoubleArrows = true }) {
	current = isNaN(parseInt(current)) ? 0 : parseInt(current);
	total = isNaN(parseInt(total)) ? 0 : parseInt(total);
	limit = isNaN(parseInt(limit)) ? 0 : parseInt(limit);
	if (limit % 2 === 0) limit += 1; //Must be odd number

	let pages = [];

	const sideCount = Math.floor(limit / 2); //How many pages will be shown at each side of current
	//Add left side
	for (let index = -sideCount; index < 0; index++) {
		const pageNum = current + index;
		if (pageNum > 0 && pageNum < current) pages.push(pageNum);
	}
	//Add current
	pages.push(current);
	//Add right side
	for (let index = 1; index <= sideCount; index++) {
		const pageNum = current + index;
		if (pageNum > current && pageNum <= total) pages.push(pageNum);
	}
	//Previous  & NExt
	if (addArrows && total > 1) {
		if (current > 1) {
			pages.unshift('previous');
		}
		if (current < total) {
			pages.push('next');
		}
	}

	//First & Last
	if (addDoubleArrows && total > 1) {
		if (current > 1) {
			pages.unshift('first');
		}
		if (current < total) {
			pages.push('last');
		}
	}

	return pages;
}
