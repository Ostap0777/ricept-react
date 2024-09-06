import React from 'react'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
	 <div className={styles.header__section}>
		  <div className='header__container'>
			<Link to={'/favorite'}>
			<img className={styles.header__favorite} src="/img/free-icon-heart-shape-outline-25424 (1).png" alt="" />
			</Link>
		 </div>
	 </div>
  )
}
