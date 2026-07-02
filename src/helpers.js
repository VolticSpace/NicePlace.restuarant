let currentSlide = 0;

export function renderLookUp(arr, con) {
  if (!arr) return;
  con.innerHTML = "";
  let html = "";
  arr.forEach((meal) => {
    const stringLength =
      meal.name.length > 15 ? meal.name.slice(0, 15) + "..." : meal.name;
    html += `
     <div class="meal-card" data-card-id="${meal.id}">
   <img class="image card-img" src="${meal.src}" alt="" />
   <div class="slider-top-overlay card-overlay"></div>
   <div class="meal-card-content">
     <p class="meal-name">${stringLength}</p>
     <p class="meal-text">Made with fine rice and red tomatoes</p>
     <p class="meal-category">${meal.country === null ? "Unknown Country" : `${meal.country}`}</p>
     <button class="view-details-btn" data-card-id="${meal.id}">View Details</
  button>
   </div>
   <div class="more-btn">
   </div>
 </div>
    `;
  });
  con.insertAdjacentHTML("beforeend", html);
}

export function closeSections(...args) {
  args.forEach((arg) => {
    arg?.classList.remove("show-meal-grid");
    arg?.classList.add("hide");
  });
}

export async function lookUpMealByName(mealName) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
    );

    const data = await res.json();

    if (!data.meals) return [];

    return data.meals.map((meal) => ({
      id: meal.idMeal,
      country: meal.strArea,
      src: meal.strMealThumb,
      name: meal.strMeal,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function renderFilters(arr, con) {
  if (!con) return;
  con.innerHTML = "";
  let html = "";
  arr.forEach((filter) => {
    html += `
        <div class="filter" data-filter-id="${filter.id}" 
data-filter-value="${filter.text}">
            <div class="food-tray">
                <img class="tray-image" src="${filter.src}" 
                alt="" />
            </div>
            <p>${filter.text}</p>
        </div>
    `;
  });
  con.insertAdjacentHTML("beforeend", html);
  // const filterConArray = con.querySelectorAll(".filter");
}
export const debounce = (callback, delay) => {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
};
export function openSections(...args) {
  args.forEach((arg) => {
    arg?.classList.remove("hide");
    arg?.classList.add("show-meal-grid");
  });
}

export const updateSlide = (slides) => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};

export const nextSlide = (slides) => {
  currentSlide++;
  if (currentSlide === slides.length) {
    currentSlide = 0;
  }
  updateSlide(slides);
};
