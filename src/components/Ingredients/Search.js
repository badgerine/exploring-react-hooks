import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

let renderCount = 0;
const Search = React.memo(props => {
  console.log('[Search] renderCount=',++renderCount);
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  //executes after every re/render cycle of this cycle | 
  //[] only rerun when changes are detected on the properties listed in the array => effectively componentDidMount().
  useEffect(() => {
    console.log('[Search.useEffect[enteredFilter, onLoadIngredients, inputRef]] update=', enteredFilter,inputRef);
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://burger-builder-ed94e.firebaseio.com/ingredients.json' + query)
          .then(response => {
            return response.json();
          }).then(responseJSObject => {
            console.log('responseJSObject=', responseJSObject);
            const loadedIngredients = [];
            for (let key in responseJSObject) {
              loadedIngredients.push({
                id: key,
                ...responseJSObject[key]
              });
            }
            // setIngredients(loadedIngredients.filter(ingredient => (ingredient.amount != null)));
            onLoadIngredients(loadedIngredients.filter(ingredient => (ingredient.amount != null)));
          });
      }
    }, 800);
    return () => {
      clearTimeout(timer);
    }; //useEffect returns a function, we will use this to clean up the timer in setTimeout(). I.e. a timer is created for every key stroke.
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
