import React from 'react';
import styles from './filterCategoty.module.scss';

interface FilterCategoryProps {
  onCategoryChange: (category: string | null) => void;
}

export default function FilterCategory({ onCategoryChange }: FilterCategoryProps) {
  const categories = ['Sup', 'Dessert', 'mainCourse'];

  return (
    <section className={styles.category__section}>
      <ul className={styles.category__items}>
        {categories.map(category => (
          <li
            key={category}
            className={styles.category__item}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </li>
        ))}
        <li
          className={styles.category__item}
          onClick={() => onCategoryChange(null)}
        >
          Всі
        </li>
      </ul>
    </section>
  );
}
