import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FetchDrinksContext } from '../context/FetchDrinksContext';
import { FetchCategoryDrinksContext } from '../context/FetchCategoryDrinksContext';

function DrinksFilter() {
  const { searchDrinks, fetchDrinksAPI } = useContext(FetchDrinksContext);
  const [prevClicked, setPrevCliked] = useState('All');
  const {
    searchCategory,
    fetchCategoryDrinksAPI,
  } = useContext(FetchCategoryDrinksContext);
  const noMagic5 = 5;
  const categoryData = searchCategory.slice(0, noMagic5);
  const history = useHistory();

  useEffect(() => {
    const fetch = async () => {
      await fetchCategoryDrinksAPI();
    };
    fetch();
  }, []);

  const funcCategory = async (param) => {
    if (param === 'All' || param === prevClicked) {
      await fetchDrinksAPI('s');
      setPrevCliked('All');
    } else {
      await fetchDrinksAPI('c', param);
      setPrevCliked(param);
    }
  };

  if (searchDrinks.length === 1) {
    const { idDrink } = searchDrinks[0];
    history.push(`/drinks/${idDrink}`);
  }

  return (
    <div>
      <button
        key="All"
        data-testid="All-category-filter"
        type="radio"
        name="category"
        id="All"
        value="All"
        onClick={ () => funcCategory('All') }
      >
        All

      </button>
      {categoryData.map((e, index) => (
        <button
          key={ `${index}` }
          data-testid={ `${e.strCategory}-category-filter` }
          name="category"
          type="radio"
          id={ e.strCategory }
          value={ e.strCategory }
          onClick={ () => funcCategory(e.strCategory) }
        >
          { e.strCategory }

        </button>
      ))}
    </div>
  );
}

export default DrinksFilter;
