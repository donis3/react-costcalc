import { useContext } from 'react';
import AppContext from './index';

export default function useApp() {
	const app = useContext(AppContext);

	return app;
}
