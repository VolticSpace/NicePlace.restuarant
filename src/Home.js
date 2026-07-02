import {
  renderLookUp,
  closeSections,
  lookUpMealByName,
  renderFilters,
  debounce,
  openSections,
} from "./helpers.js";

const slides = document.querySelectorAll(".slide");
const cardsContainer = document.querySelector(".meal-cards");
const nextBtn = document.querySelector(".right");
const prevBtn = document.querySelector(".left");
const filtersCon = document.querySelector(".meal-discovery-filters");
const slider = document.querySelector(".meal-cards-slider");
const searchBar = document.querySelector(".search-bar");
const heroSection = document.querySelector(".hero-section");
const mealFeatures = document.querySelector(".meal-features");
const mealGrid = document.querySelector(".meal-grid");
const mostPopularCon = document.querySelector(".popular-meal");

let currentIndex = 0;
let currentSlide = 0;

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${100 * i}%)`;
});

const updateSlide = () => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};

const nextSlide = () => {
  currentSlide++;
  if (currentSlide === slides.length) {
    currentSlide = 0;
  }
  updateSlide();
};

setInterval(nextSlide, 5000);
// function initCard() {
// const spaghetti = fetch(
// "https://www.themealdb.com/api/json/v1/1/search.php?s=spaghetti",
// );
//
// const pizza = fetch(
// "https://www.themealdb.com/api/json/v1/1/search.php?s=pizza",
// );
//
// const rice = fetch(
// "https://www.themealdb.com/api/json/v1/1/search.php?s=rice",
// );
//
// Promise.all([rice, pizza, spaghetti])
// .then((responses) => Promise.all(responses.map((res) => res.json())))
// .then((data) => {
// const meals = data
// .flatMap((item) => item.meals)
// .sort((a, b) => a.strMeal.localeCompare(b.strMeal));
//
// console.log(meals);
//
// const mealArray = meals.map((meal) => ({
// id: meal.idMeal,
// country: meal.strArea,
// src: meal.strMealThumb,
// name: meal.strMeal,
// }));
// renderLookUp(mealArray, cardsContainer);
// })
// .catch(console.error);
// }
// initCard();

renderFilters(filters, filtersCon);

function updateMealCard() {
  const cards = mealFeatures.querySelectorAll(".meal-card");
  const styles = getComputedStyle(cardsContainer);
  const gap = parseFloat(styles.columnGap || styles.gap);

  if (!cards.length) return;

  const cardwidth = cards[0].getBoundingClientRect().width;
  cardsContainer.style.transform = `translateX(-${currentIndex * (cardwidth + gap)}px)`;
}

function nextMealCard() {
  const cards = document.querySelectorAll(".meal-card");

  currentIndex++;

  if (currentIndex > cards.length - 9) {
    currentIndex = 0;
  }

  updateMealCard();
}

function prevMealCard() {
  const cards = document.querySelectorAll(".meal-card");

  currentIndex--;

  if (currentIndex < cards.length - 3) {
    currentIndex = 0;
  }

  updateMealCard();
}

const debouncedSearch = debounce(searchMeal, 500);

searchBar.querySelector("input").addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (!value) {
    debouncedSearch.cancel();
    openSections(heroSection, mealFeatures);
    closeSections(mealGrid);
    initCard();
    return;
  }

  debouncedSearch(value);
});

async function searchMeal(value) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`,
  );

  const data = await res.json();

  if (!data.meals) {
    openSections(heroSection, mealFeatures);
    closeSections(mealGrid);
    initCard();
    return;
  }

  const meals = data.meals.map((meal) => ({
    id: meal.idMeal,
    country: meal.strArea,
    src: meal.strMealThumb,
    name: meal.strMeal,
  }));

  closeSections(heroSection, mealFeatures);
  openSections(mealGrid);
  renderLookUp(meals, mealGrid);
}

filtersCon.addEventListener("click", async (e) => {
  const filter = e.target.closest(".filter");

  if (!filter) return;

  const filterConArray = filtersCon.querySelectorAll(".filter");

  filterConArray.forEach((item) => item.classList.remove("active-meal-filter"));

  filter.classList.add("active-meal-filter");

  const filterValue = filter.dataset.filterValue.toLowerCase();

  const meals = await lookUpMealByName(filterValue);

  currentIndex = 0;

  renderLookUp(meals, cardsContainer);
  mostPopularCon.querySelector("p").textContent =
    filterValue.slice(0, 1).toUpperCase() +
    filterValue.slice(1, filterValue.length);
  updateMealCard();
});

slider.addEventListener("click", (e) => {
  if (e.target.closest(".right")) {
    nextMealCard();
  }
  if (e.target.closest(".left")) {
    prevMealCard();
  }
});

cardsContainer.addEventListener("click", (e) => {
  if (e.target.closest(".view-details-btn")) {
    // alert("ye");
  }
});
