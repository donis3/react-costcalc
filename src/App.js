import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/navbar/Navbar';
import { AppContextProvider } from './context/AppContext';
import { PanelContextProvider } from './context/PanelContext';
import { DataContextProvider } from './context/DataContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
	loadThemeFromStorage();

	return (
		<>
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
			<ToastContainer
				position='top-center'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</>
	);
}

export default App;
