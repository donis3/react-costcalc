import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PackageCosts({ packageData} = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	
	return <div>Package Cost</div>;
}
