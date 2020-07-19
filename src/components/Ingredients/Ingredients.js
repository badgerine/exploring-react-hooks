import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS.', ingredients)
  }, [ingredients]);

  const addIngredientHandler = ingredient => {
    fetch('https://burger-builder-ed94e.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content_Type': 'application/JSON' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const removeIngredientHandler = ingredientId => {
    fetch(`https://burger-builder-ed94e.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      return response.json();
    }).then(responseData => {
      console.log('response.json()=', responseData);
      setIngredients(prevIngredients => prevIngredients.filter(
        ingredientItem => (ingredientItem.id !== ingredientId)
      ));
    });

  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={(enteredIngredient) => addIngredientHandler(enteredIngredient)} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={(ingredientId) => removeIngredientHandler(ingredientId)} />
      </section>
    </div>
  );
}

export default Ingredients;
