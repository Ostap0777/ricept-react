import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './favorite.module.scss';
import Loader from '../UI/Loader/Loader';


interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strSource: string;
  [key: string]: any;
}


interface FirebaseMeals {
  [key: string]: Meal;
}


const fetchFavorites = async (): Promise<Meal[]> => {
  const response = await axios.get<FirebaseMeals>('https://recipe-app-3c604-default-rtdb.firebaseio.com/favorites.json');

const data = Object.keys(response.data).map(key => ({ ...response.data[key], idMeal: key }));
  console.log('Favorites data:', data);
  return data;
};

export default function FavoritePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites
  });

  if (isLoading) return <Loader/>;
  if (error) return <div>Помилка: {(error as Error).message}</div>;

  const favorites = data ?? [];

  const totalIngredients = favorites.reduce((count, meal) => {
    const ingredientCount = Object.keys(meal)
      .filter(key => key.startsWith('strIngredient') && meal[key])
      .length;
    return count + ingredientCount;
  }, 0);


  const allIngredients = favorites.flatMap(meal =>
    Object.keys(meal)
      .filter(key => key.startsWith('strIngredient') && meal[key])
      .map(key => meal[key])
  );

  const uniqueIngredients = Array.from(new Set(allIngredients));

  return (
    <div className='favorite__container'>
      <h1 className={styles.favorite__title}>Favorite dish</h1>
      <div className={styles.favorite__items}>
        {favorites.length > 0 ? (
          favorites.map((meal: Meal) => (
            <div className={styles.favorite__item} key={meal.idMeal}>
              <div className={styles.meal__content__left}>
                <h3 className={styles.meal__name}>{meal.strMeal}</h3>
                <img className={styles.meal__image} src={meal.strMealThumb} alt={meal.strMeal} />
                <p className={styles.meal__category}>{meal.strCategory}</p>
                <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
                  <img className={styles.meal__source} src="/img/free-icon-link-4299107.png" alt="" />
                </a>
              </div>
              <div className={styles.meal__content__right}>
                <div className={styles.meal__ingredients}>
                  {Object.keys(meal)
                    .filter(key => key.startsWith('strIngredient') && meal[key])
                    .map((key, index) => (
                      <p key={index} className={styles.ingredient}>
                        {meal[key]} - {meal[`strMeasure${index + 1}`]}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Немає улюблених страв</div>
        )}
      </div>
      <div className={styles.content__total}>
        <h2 className={styles.total__count}>Загальна кількість інгредієнтів: {totalIngredients}</h2>
      </div>
      <div className={styles.content__ingredient}>
        <h2 className={styles.content__title}>Список усіх інгредієнтів:</h2>
        {uniqueIngredients.length > 0 ? (
          uniqueIngredients.map((ingredient, index) => (
            <p key={index} className={styles.list__ingredient}>
              {ingredient}
            </p>
          ))
        ) : (
          <div>Немає інгредієнтів</div>
        )}
      </div>
    </div>
  );
}
