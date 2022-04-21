import React from 'react';
import MiniStat from '../../../components/common/MiniStat';
import useModuleGrid from './useModuleGrid';

export default function ModuleGrid() {
	const miniStats = useModuleGrid();

	return (
		<div className='grid grid-cols-3 md:grid-cols-6 gap-5'>
			{miniStats.map((item, i) => (
				<MiniStat key={i} {...item} />
			))}
		</div>
	);
}
