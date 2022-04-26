

export default function useSettingsReducer(defaultSettings = {}) {
	function settingsReducer(state, action) {
		const { type, payload, success, error } = action || {};

		const onError = (msg = '') => {
			error?.();
			console.warn(msg);
			return state;
		};
		const onSuccess = (newState) => {
			if (JSON.stringify(newState) === JSON.stringify(state)) return state;
			success?.();
			return newState;
		};

		switch (type) {
			case 'InitializeBackup': {
				const repo = payload;
				if (!repo) return onError('InvalidRequest');
				if (repo in localStorage === false) return onError('InvalidRepoName');
				//Repo exists, save download date
				return onSuccess({ ...state, backup: { ...state.backup, lastBackupDate: Date.now() } });
			}

			case 'Restore': {
				if (!payload || 'lastRestorationDate' in payload === false) return onError();

				return onSuccess({ ...state, backup: { ...state.backup, ...payload } });
			}
			default:
				throw new Error('Invalid dispatch type for settings Reducer');
				break;
		}
	}

	return settingsReducer;
}
