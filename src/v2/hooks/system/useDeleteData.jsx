import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import config from '../../config/config.json';
import useConfig from '../app/useConfig';
import { getRepoStorageKey } from '../common/useStorageRepo';
import useApplicationDefaults from './useApplicationDefaults';


const repoName = getRepoStorageKey('application', config);
const otherModules = ['recipes', 'endproducts', 'widgets'];

export default function useDeleteData() {
	const { t } = useTranslation('pages/system');
	const config = useConfig();
	const defaultData = useApplicationDefaults();
	const data = getCurrentData(repoName);
	
	//Remove data that is not present in default data
	const cleanData = Object.keys(data).reduce((acc, key) => {
		if (key in defaultData) {
			return { ...acc, [key]: data[key] };
		} else {
			config.get('debug.general') && console.log(`Detected an unsupported application data key: ${key}`);
			return acc;
		}
	}, defaultData);

	function deleteData(modulesArray) {
		if (!Array.isArray(modulesArray) || modulesArray.length === 0) return;
		const deletedData = [];

		//remove requested data from current data
		const newAppState = Object.keys(cleanData).reduce((acc, key) => {
			switch (key) {
				/**
				 * Decide which parts of the company data will be reset
				 */
				case 'company': {
					//Copy current company state
					const newCompanyData = { ...cleanData.company };
					if (modulesArray.includes('employees')) {
						deletedData.push(t(`reset.employees`));
						newCompanyData.employees = defaultData.company.employees;
						newCompanyData.totals = defaultData.company.totals;
					}
					if (modulesArray.includes('expenses')) {
						deletedData.push(t(`reset.expenses`));
						newCompanyData.expenses = defaultData.company.expenses;
						newCompanyData.totals = defaultData.company.totals;
					}
					if (modulesArray.includes('companydetails')) {
						deletedData.push(t(`reset.companydetails`));
						newCompanyData.info = defaultData.company.info;
					}
					if (modulesArray.includes('materials')) {
						newCompanyData.production = defaultData.company.production;
					}

					return { ...acc, company: newCompanyData };
				}
				/**
				 * Reset keys that are in modulesArray
				 * if 'others' key is requested in modulesArray, check that too
				 */
				default: {
					//Check if delete others is requested and this key is an other
					if (modulesArray.includes('others') && otherModules.includes(key)) {
						//This module is requested to be deleted
						deletedData.push(t(`reset.${key}`));
						return { ...acc, [key]: defaultData[key] };
					}
					//Check if this key is requested to be deleted
					if (modulesArray.includes(key)) {
						deletedData.push(t(`reset.${key}`));
						return { ...acc, [key]: defaultData[key] };
					}
					//Keep original
					return { ...acc, [key]: cleanData[key] };
				}
			}
		}, {});

		//We can now save this new data to local storage and refresh app
		try {
			localStorage.setItem(repoName, JSON.stringify(newAppState));
			toast.success(t('reset.resetSuccess', { modules: deletedData.join(', ') }));
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} catch (error) {
			toast.error(t('reset.resetError'));
		}
	}

	return { deleteData };
}
//===============// Helpers //===================//
/**
 * Get current storage data for given storage key
 * @param {*} storageKey
 * @returns
 */
function getCurrentData(storageKey) {
	try {
		const localData = localStorage.getItem(storageKey);
		const parsedData = JSON.parse(localData);
		return parsedData ? parsedData : {};
	} catch (error) {
		return {};
	}
}
