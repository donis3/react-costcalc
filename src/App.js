import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';


function App() {
	loadThemeFromStorage();
	
	return (
		<>
			<MainLayout footer={<Footer />} header={<NavBar />}>
				<Router />
			</MainLayout>
		</>
	);
}

export default App;
