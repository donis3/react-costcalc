import { useContext, useEffect, useReducer, useState } from 'react';
import useStorageState from '../common/useStorageState';
import config from '../../config/config.json';
import { getRepoStorageKey } from '../common/useStorageRepo';
import { getStorageSize } from '../../lib/common';
import useDateFns from '../common/useDateFns';
import useDownload from '../common/useDownload';
import useCompanyInfo from '../../context/company/useCompanyInfo';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import systemReducer from './systemReducer';
import useDeleteData from './useDeleteData';
import { SettingsDispatchContext } from '../../context/settings';

const repoName = getRepoStorageKey('application', config);

const defaultSystemData = {
	backup: {
		lastBackupDate: null,
		lastRestorationDate: null,
		lastRestorationFilename: '',
	},
};

export default function useSystem() {
	const { t } = useTranslation('pages/system');

	const [systemRepo, setSystemRepo] = useStorageState('system', defaultSystemData);
	const [system, dispatch] = useReducer(systemReducer, systemRepo);

	const [selectedFile, setSelectedFile] = useState(null);
	const { timeSince, isValid, format } = useDateFns();
	const downloadFile = useDownload();
	const { info } = useCompanyInfo();
	const { deleteData } = useDeleteData();
	const settingsDispatch = useContext(SettingsDispatchContext);

	//Save changes to repo
	useEffect(() => {
		if (system && JSON.stringify(system) !== JSON.stringify(setSystemRepo)) {
			setSystemRepo(system);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [system]);

	//========================// FILE UPLOAD OPERATIONS //=======================//
	const reader = new FileReader();
	reader.addEventListener('load', handleFileLoaded);

	useEffect(() => {
		if (selectedFile && selectedFile.type === 'application/json') reader.readAsText(selectedFile);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFile]);

	/**
	 * Pass the selected file to this method
	 * This will initialize upload using fileReader
	 * @param {*} file
	 * @returns
	 */
	function uploadFile(file) {
		if (!file) return;
		setSelectedFile(file);
	}

	/**
	 * This method will run when upload is completed to fileReader
	 * @param {*} data
	 */
	function handleFileLoaded(data) {
		try {
			//Validate loaded file contents
			if (!selectedFile) return;
			const loadedData = data?.target?.result;
			if (!loadedData) throw new Error();
			const parsedData = JSON.parse(loadedData);
			//Validate parsed data
			if (!parsedData || Object.keys(parsedData).length < 3) {
				//Error occurred
				throw new Error();
			}
			//Some keys to check against to verify this object is valid backup
			const keys = ['company', 'materials', 'products', 'recipes'];
			const matches = keys.reduce((acc, key) => {
				if (key in parsedData) {
					return acc + 1;
				}
				return acc;
			}, 0);
			if (keys.length > matches) {
				//Some keys are missing
				throw new Error();
			}
			//!!! REPLACE LOCAL STORAGE HERE
			const storageString = JSON.stringify(parsedData);
			localStorage.setItem(repoName, storageString);
			//Get filename and save this operations details in system storage
			const payload = {
				lastRestorationDate: Date.now(),
				lastRestorationFilename: selectedFile.name,
			};
			if (selectedFile?.lastModified) {
				payload.lastRestorationDate = selectedFile.lastModified;
			}
			//Dispatch
			dispatch({
				type: 'Restore',
				payload,
			});
			//Toast
			toast.success(t('restore.restoreSuccess'));
			//reload application
			setTimeout(() => {
				window.location.reload(true);
			}, 1000);
		} catch (error) {
			toast.error(t('restore.uploadError'), { toastId: 'restore' });
		}
	}

	//========================// FILE DOWNLOAD OPERATIONS //=======================//
	/**
	 * Get time past since last backup date OR return undefined.
	 * @param {*} backupState
	 * @returns
	 */
	function timeSinceLastBackup(backupState) {
		if (!backupState || 'lastBackupDate' in backupState === false) return;
		if (!backupState.lastBackupDate) return;
		const backupDate = new Date(backupState.lastBackupDate);
		if (isValid(backupDate)) {
			return timeSince(backupDate, new Date());
		}
	}

	/**
	 * Call when a backup is requested
	 * Will stringify local application repo and prompt a download as json file
	 * @returns
	 */
	function handleDownload() {
		if (repoName in localStorage === false || !localStorage[repoName]) return;
		try {
			//Parse json data
			const data = JSON.parse(localStorage[repoName]);
			if (!data) return;
			downloadFile({
				data: JSON.stringify(data),
				fileName: generateFilename(),
				fileType: 'text/json',
			});
			dispatch({
				type: 'InitializeBackup',
				payload: repoName,
			});
		} catch (error) {}
	}

	/**
	 * Generate a backup filename
	 * @returns {string} Appname - Company - Date .json
	 */
	function generateFilename() {
		const dateString = format(new Date(), 'dd-MM-yyyy HH:mm');
		let companyName = info?.name ? info.name : config.app.name;

		const result = t('backup.filename', {
			app: config.app.name,
			company: companyName,
			date: dateString,
		});
		return result;
	}

	//========================// Delete Application Data //=======================//
	function onDeleteRequest(deleteFormState) {
		if (!deleteFormState) return;
		const result = Object.keys(deleteFormState).filter((key) => deleteFormState[key] === true);
		if (result && result.length > 0) deleteData(result);
	}

	//========================// Dekete System //=======================//

	/**
	 * Delete all storage keys belonging to this application
	 */
	function onDeleteEverything(verbose = true) {
		const onSuccess = () => toast.success(t('delete.success'));
		try {
			const prefix = config.app.localStorageKey;
			const keys = Object.keys(localStorage);
			let targetKeys = [];
			if (!keys || keys.length === 0) throw new Error('InvalidStorageData');
			if (!prefix) {
				targetKeys = keys;
			} else {
				keys.forEach((key) => {
					const parts = key.split('.');
					if (parts.length > 0 && parts[0] === prefix) {
						//This key belongs to the application
						targetKeys.push(key);
					}
				});
			}

			if (targetKeys.length === 0) throw new Error('InvalidStorageData');

			//Delete each key
			targetKeys.forEach((key) => {
				localStorage.removeItem(key);
			});

			//Show toast & Reload
			if (verbose) onSuccess();

			setTimeout(() => {
				window.location.reload(true);
			}, 2000);
		} catch (error) {
			toast.error(t('delete.error'));
		}
	}

	//========================// Demo Actions //=======================//

	function leaveDemo(keepData = false) {
		const onSuccess = () => toast.success(t('isDemo.leaveSuccess'));
		const onError = () => toast.success(t('isDemo.leaveError'));

		if (!keepData) {
			onSuccess();
			return onDeleteEverything(false);
		} else {
			const payload = {
				type: 'LeaveDemo',
				success: onSuccess,
				error: onError,
			};
			settingsDispatch(payload);
		}
	}

	//========================// EXPORTS //=======================//
	return {
		system: system,
		actions: {
			backup: handleDownload,
			upload: uploadFile,
			reset: onDeleteRequest,
			deleteSystem: onDeleteEverything,
			leaveDemo,
		},
		size: getStorageSize(repoName),
		timeSinceBackup: timeSinceLastBackup(system.backup),
	};
}
