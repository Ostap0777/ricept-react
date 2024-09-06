import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FilterCategory from '../FilterCategory/FilterCategoty'; 
import styles from './mainPage.module.scss';
import debounce from 'lodash.debounce';
import Loader from '../UI/Loader/Loader';
import Pagination from '../UI/Pagination/Pagination';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strSource: string;
}

type MealsArray = Meal[];

const fetchMeals = async (): Promise<MealsArray> => {
  const response = await axios.get<MealsArray>('https://messanger-react-1a323-default-rtdb.firebaseio.com/meals.json');
  return response.data;
};

const addToFavorites = async (meal: Meal) => {
  await axios.post('https://recipe-app-3c604-default-rtdb.firebaseio.com/favorites.json', meal);
};

const ITEMS_PER_PAGE = 10;

export default function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  useEffect(() => {
    const handler = debounce((term: string) => setDebouncedSearchTerm(term), 500);
    handler(searchTerm);

    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  if (isLoading) return <Loader />;
  if (error) return <div>Помилка: {(error as Error).message}</div>;

  const meals = data ?? [];
  
  const filteredMeals = meals.filter(meal =>
    (selectedCategory ? meal.strCategory === selectedCategory : true) &&
    meal.strMeal.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);
  const paginatedMeals = filteredMeals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAddToFavorites = async (meal: Meal) => {
    try {
      await addToFavorites(meal);
    } catch (error) {
      console.error('Помилка при додаванні страви до улюблених:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className='wrapper'>
      <Header />
      <div className='main__container'>
        <FilterCategory onCategoryChange={setSelectedCategory} />
        <input
          type="text"
          placeholder="Пошук"
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.meal__searchinput}
        />
        <div className={styles.main__items}>
          {paginatedMeals.length > 0 ? (
            paginatedMeals.map((meal: Meal) => (
              <div className={styles.main__item} key={meal.idMeal}>
                <img className={styles.meal__image} src={meal.strMealThumb} alt={meal.strMeal} />
                <h3 className={styles.meal__name}>{meal.strMeal}</h3>
                <p className={styles.meal__category}>{meal.strCategory}</p>
                <div className={styles.meal__links}>
                  <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
                    <img className={styles.meal__link} src="/img/free-icon-link-4299107.png" alt="" />
                  </a>
                  <Link className={styles.meal__detail} to={`/meal/${meal.idMeal}`}>Детальніше</Link>
                  <img
                    className={styles.meal__add__favorite}  src="/img/free-icon-heart-shape-outline-25424 (1).png"  alt="Add to favorites" onClick={() => handleAddToFavorites(meal)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>Страви відсутні</div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </main>
  );
}
