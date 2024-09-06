
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';

import MealDetailPage from './components/MealDetailsPage/MealDetailPage';
import FavoritePage from './components/FavoritePage/FavoritePage';




function App() {
  return (
	<Router>
	<Routes>
	  <Route path="/" element={<MainPage />} />
	  <Route path="/meal/:id" element={<MealDetailPage />} />
	  <Route path="/favorite" element={<FavoritePage/>}/>
	</Routes>
 </Router>
  );
}

export default App;
