import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';

export default function Recipe() {
	const { page } = useAppContext();
	const { pathname } = useLocation();

	useEffect(() => {
		page.setBreadcrumb('Recipe Name');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	return <div>Recipe</div>;
}
