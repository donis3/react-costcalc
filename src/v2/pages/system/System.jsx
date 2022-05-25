import React from 'react';
import ResetSystem from './components/ResetSystem';
import RestoreSystem from './components/RestoreSystem';
import BackupSystem from './components/BackupSystem';
import useSettings from '../../context/settings/useSettings';
import DeleteSystem from './components/DeleteSystem';

export default function System() {
	const { isDemo, setupComplete } = useSettings();

	/**
	 * If setup is not yet complete, show ony restore
	 * If in demo mode, show only restore
	 */
	if (!setupComplete || isDemo) {
		return <RestoreSystem showCancel={!setupComplete || isDemo} />;
	}

	/**
	 * Normal mode
	 */
	return (
		<>
			<BackupSystem />
			<RestoreSystem showCancel={!setupComplete || isDemo} />
			<ResetSystem />
			<DeleteSystem />
		</>
	);
}
