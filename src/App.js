import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/navbar/Navbar';
import { AppContextProvider } from './context/AppContext';


function App() {
	loadThemeFromStorage();
	
	return (
		<AppContextProvider>
			{/* <MainLayout footer={<Footer />} header={<NavBar />}> */}
			<MainLayout footer={<Footer />} header={<Navbar />}>
				<Router />
			</MainLayout>
		</AppContextProvider>
	);
}

export default App;
