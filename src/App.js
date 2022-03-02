import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/layout/Navbar';
import { AppContextProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
	loadThemeFromStorage();

	return (
		<ErrorBoundary>
			<AppContextProvider>
				<MainLayout footer={<Footer />} header={<Navbar />}>
					<Router />
				</MainLayout>
			</AppContextProvider>
			<ToastContainer
				position='top-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
			/>
		</ErrorBoundary>
	);
}

export default App;
