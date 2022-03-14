import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/layout/Navbar';
import { AppContextProvider } from './context/AppContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import MainContext from './context/MainContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	loadThemeFromStorage();

	return (
		<ErrorBoundary>
			{/* React-Toastify configured here. */}
			<ToastContainer
				position='top-center'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
				
			/>
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
