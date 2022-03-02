import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/layout/Navbar';
import { AppContextProvider } from './context/AppContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import MainContext from './context/MainContext';

function App() {
	loadThemeFromStorage();

	return (
		<ErrorBoundary>
			<AppContextProvider>
				{/* Main context has multiple context in it */}
				<MainContext>
					<MainLayout footer={<Footer />} header={<Navbar />}>
						<Router />
					</MainLayout>
				</MainContext>
			</AppContextProvider>
		</ErrorBoundary>
	);
}

export default App;
