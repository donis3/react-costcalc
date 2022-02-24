import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PanelContext = createContext();

export default PanelContext;
export function PanelContextProvider({ children }) {
	const [isPanelOpen, setPanelOpen] = useState(false);
	const [panelTitle, setPanelTitle] = useState('Panel Title');
	const [panelContent, setPanelContent] = useState(null);
	const [panelId, setPanelId] = useState(false);
	const { t } = useTranslation('translation');

	const setPanelOptions = ({ id, title, content }) => {
		setPanelId(id);
		setPanelTitle(title);
		setPanelContent(content);
	};
	const resetPanel = () => {
		setPanelId(false);
		setPanelContent(null);
		setPanelTitle(t('panel.title'));
		setPanelOpen(false);
	};
	//Handle Open Panel request.
	const openPanel = ({ id = false, title = null, content = null, reload = false }) => {
		if (id === false) {
			id = Math.round(Math.random() * 1000);
			console.warn(`Creating bottom panel requires a unique id`);
		}
		if (title && typeof title !== 'string') {
			title = t('panel.title');
			console.warn(`Bottom panel title should be a string.`);
		}
		if (id && id === panelId && reload === false) {
			//Same panel, do not reload data, just open
			return setPanelOpen(true);
		}
		//Set panel options
		setPanelOptions({ id, title, content });
		//Open panel
		setPanelOpen(true);
	};

	const closePanel = (reset = false) => {
		if (reset === true) {
			return resetPanel();
		} else {
			return setPanelOpen(false);
		}
	};

	const payload = {
		open: openPanel,
		close: closePanel,
		isOpen: isPanelOpen,
		title: panelTitle,
		content: panelContent,
		id: panelId,
	};

	
	return <PanelContext.Provider value={payload}>{children}</PanelContext.Provider>;
}
