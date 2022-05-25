import { useContext } from 'react';
import { WidgetsContext } from '.';

export default function useWidgets() {
	const widgets = useContext(WidgetsContext);

	return { widgets };
}
