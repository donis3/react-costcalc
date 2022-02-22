import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/navbar/Navbar';
import { AppContextProvider } from './context/AppContext';
import { PanelContextProvider } from './context/PanelContext';
import { DataContextProvider } from './context/DataContext';

function App() {
	loadThemeFromStorage();

	return (
		<AppContextProvider>
			<DataContextProvider>
				<PanelContextProvider>
					{/* <MainLayout footer={<Footer />} header={<NavBar />}> */}
					<MainLayout footer={<Footer />} header={<Navbar />}>
						<Router />
					</MainLayout>
				</PanelContextProvider>
			</DataContextProvider>
		</AppContextProvider>
	);
}

export default App;
