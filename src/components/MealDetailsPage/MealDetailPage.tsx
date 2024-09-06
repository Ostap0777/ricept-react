import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './mealId.module.scss';
import Loader from '../UI/Loader/Loader';
interface Meal {
	idMeal: string;
	strMeal: string;
	strDrinkAlternate?: string | null;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strMealThumb: string;
	strTags?: string | null;
	strYoutube?: string;
	strIngredient1?: string;
	strIngredient2?: string;
	strIngredient3?: string;
	strIngredient4?: string;
	strIngredient5?: string;
	strIngredient6?: string;
	strIngredient7?: string;
	strIngredient8?: string;
	strIngredient9?: string;
	strIngredient10?: string;
	strIngredient11?: string;
	strIngredient12?: string;
	strIngredient13?: string;
	strIngredient14?: string;
	strIngredient15?: string;
	strIngredient16?: string;
	strIngredient17?: string;
	strIngredient18?: string;
	strIngredient19?: string;
	strIngredient20?: string;
	strMeasure1?: string;
	strMeasure2?: string;
	strMeasure3?: string;
	strMeasure4?: string;
	strMeasure5?: string;
	strMeasure6?: string;
	strMeasure7?: string;
	strMeasure8?: string;
	strMeasure9?: string;
	strMeasure10?: string;
	strMeasure11?: string;
	strMeasure12?: string;
	strMeasure13?: string;
	strMeasure14?: string;
	strMeasure15?: string;
	strMeasure16?: string;
	strMeasure17?: string;
	strMeasure18?: string;
	strMeasure19?: string;
	strMeasure20?: string;
	strSource: string;
	strImageSource?: string | null;
	strCreativeCommonsConfirmed?: string | null;
	dateModified?: string | null;
 }
 

const fetchMealDetail = async (id: string): Promise<Meal> => {
  const response = await axios.get<Meal>(`https://messanger-react-1a323-default-rtdb.firebaseio.com/meals/${id}.json`);
  console.log(response.data)
  return response.data;
};

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<Meal, Error>({
    queryKey: ['mealDetail', id],
    queryFn: () => fetchMealDetail(id!),
    enabled: !!id,
  });

  if (isLoading) return  <Loader/>;
  if (error) return <div>Помилка: {(error as Error).message}</div>;
  if (!data) return <div>Немає даних</div>;

  return (
    <div className={styles.meal__detail}>
      <Link to={'/'} className={styles.meal__backLink}>Назад</Link>
      <h1 className={styles.meal__name}>{data.strMeal}</h1>
      <img className={styles.meal__image} src={data.strMealThumb} alt={data.strMeal} />
      <p className={styles.meal__category}>{data.strCategory}</p>
      <p className={styles.meal__instructions}>{data.strInstructions}</p>
      <div className={styles.meal__ingredients}>
        {Object.keys(data)
          .filter(key => key.startsWith('strIngredient') && data[key as keyof Meal])
          .map((key, index) => (
            <p key={index} className={styles.meal__ingredient}>
              {data[key as keyof Meal]} - {data[`strMeasure${index + 1}` as keyof Meal]}
            </p>
          ))}
      </div>
		<div className={styles.meal__links}>
      <a href={data.strSource} target="_blank" rel="noopener noreferrer" className={styles.meal__sourceLink}>
        <img className={styles.meal__sourceLink} src="/img/free-icon-link-4299107.png" alt="" />
      </a>
      {data.strYoutube && (
        <a href={data.strYoutube} target="_blank" rel="noopener noreferrer" className={styles.meal__youtubeLink}>
          <img className={styles.meal__video} src="/img/free-icon-video-70776.png" alt="" />
        </a>
      )}
    </div>
	 </div>
  );
}
