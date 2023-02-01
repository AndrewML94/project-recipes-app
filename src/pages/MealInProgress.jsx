import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FetchMealsContext } from '../context/FetchMealsContext';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

function MealInProgress() {
  const [clickedShare, setClickedShare] = useState(false);
  const [allCheckboxes, setAllCheckboxes] = useState([]);
  // const [isDisabled, setIsDisabled] = useState(true);
  // const [totalChecked, setTotalChecked] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { detailsMeals, fetchDetailsMeals } = useContext(FetchMealsContext);
  // const getStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const history = useHistory();
  const { id } = useParams();
  // console.log(id);
  // console.log(detailsMeals);

  useEffect(() => {
    const fetchAPI = async () => {
      await fetchDetailsMeals(id);
    };
    fetchAPI();
    const favoritesRecip = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const favorite = favoritesRecip.some((e) => e.id === id);
    setIsFavorite(favorite);
  }, []);

  useEffect(() => {
    // const recipeId = id;
    // const inProgressRecipes = JSON
    //   .parse(localStorage.getItem('inProgressRecipes') || '[]');
    // inProgressRecipes.push(allCheckboxes);
    localStorage.setItem('inProgressRecipes', JSON.stringify(allCheckboxes));
    // console.log(allCheckboxes);
  }, [allCheckboxes]);

  const finishRecipe = () => {
    // req 43 - usar a lógica do botão de favoritar para salvar as receitas feitas no localStorage
    history.push('/done-recipes');
  };

  const share = () => {
    const link = `http://localhost:3000/meals/${id}/in-progress`;
    setClickedShare(true);
    navigator.clipboard.writeText(link);
  };

  const favButton = (elem) => {
    const favoritesRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    if (!isFavorite) {
      favoritesRecipes.push({
        id: elem.idMeal,
        type: 'meal',
        nationality: elem.strArea,
        category: elem.strCategory,
        alcoholicOrNot: '',
        name: elem.strMeal,
        image: elem.strMealThumb,
      });
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoritesRecipes));
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoritesRecipes
        .filter((e) => e.id !== id)));
    }
    setIsFavorite(!isFavorite);
  };

  // const handleCheck = ({ target }) => {
  //   const noMagic4 = 4;
  //   if (target.checked) setTotalChecked(totalChecked + 1);
  //   else setTotalChecked(totalChecked - 1);
  //   if (totalChecked >= noMagic4) setIsDisabled(false);
  // };

  const handleCheckboxChange = ({ target }) => {
    setAllCheckboxes({
      ...allCheckboxes,
      [target.id]: target.checked,
    });
    // let elementos = [];
    // const inProgressRecipes = JSON
    //   .parse(localStorage.getItem('inProgressRecipes') || '[]');
    // inProgressRecipes.forEach((element) => {
    //   if (element[id]) {
    //     console.log('ACHEI');
    //     inProgressRecipes.push(...inProgressRecipes, {
    //       ...allCheckboxes,
    //       [target.id]: target.checked,
    //     });
    //   } else {
    //     console.log('não achei ainda');
    //     inProgressRecipes.push({ [id]: {
    //       ...allCheckboxes,
    //       [target.id]: target.checked,
    //     } });
    //   }
    // });
    // inProgressRecipes.push(...inProgressRecipes, {
    //   ...allCheckboxes,
    //   [target.id]: target.checked,
    // });
    // localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  };

  return (
    <div>
      {
        detailsMeals.map((elem) => (
          <div key={ elem.idMeal }>
            <img
              src={ elem.strMealThumb }
              alt={ elem.strMeal }
              data-testid="recipe-photo"
              height="200px"
              width="200px"
            />
            <h1 data-testid="recipe-title">{ elem.strMeal }</h1>
            <h3 data-testid="recipe-category">{ elem.strCategory }</h3>
            <ul>
              {Object.keys(elem).reduce((acc, cur) => {
                if (cur.includes('Ingredient')
                && elem[cur] !== ''
                && elem[cur] !== null) {
                  return [...acc, elem[cur]];
                }
                return acc;
              }, []).map((e, i) => (
                <li key={ i }>
                  <label
                    data-testid={ `${i}-ingredient-step` }
                    htmlFor={ `${i}-ingredient-name-and-measure` }
                  >
                    <input
                      id={ `${i}-ingredient-name-and-measure` }
                      onChange={ handleCheckboxChange }
                      type="checkbox"
                      data-testid={ `${i}-ingredient-name-and-measure` }
                    />
                    {`${e} - ${elem[`strMeasure${i + 1}`]}`}
                  </label>
                </li>
              ))}
            </ul>
            <p data-testid="instructions">{ elem.strInstructions}</p>
            <iframe
              data-testid="video"
              title="recipe"
              width="280px"
              height="280px"
              src={ `https://www.youtube.com/embed/${elem.strYoutube}` }
            />
            <button
              data-testid="share-btn"
              onClick={ share }
            >
              Compartilhar
            </button>
            { clickedShare && <p>Link copied!</p> }
            <button
              type="submit"
              data-testid="favorite-btn"
              onClick={ () => favButton(elem) }
              src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
            >
              <img
                src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
                alt={ elem.strMeal }
              />
            </button>
          </div>
        ))
      }
      <button
        data-testid="finish-recipe-btn"
        className="finishRecipe"
        // disabled={ isDisabled }
        onClick={ finishRecipe }
      >
        Finish Recipe
      </button>
    </div>
  );
}

export default MealInProgress;
