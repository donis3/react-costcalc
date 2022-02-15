import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';

import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/navbar/Navbar';



function App() {
	loadThemeFromStorage();
	
	return (
		<>
			{/* <MainLayout footer={<Footer />} header={<NavBar />}> */}
			<MainLayout footer={<Footer />} header={<Navbar />}>
				<Router />
			</MainLayout>
		</>
	);
}

export default App;
