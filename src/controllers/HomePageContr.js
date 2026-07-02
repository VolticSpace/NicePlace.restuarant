import { HomePageManager } from "../Managers/HomepageManager.js";
import {
  updateSlide,
  nextSlide,
  renderFilters,
  openSections,
  closeSections,
} from "../helpers.js";

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

const homePageManager = new HomePageManager(
  0,
  mealFeatures,
  cardsContainer,
  mealGrid,
);

const debouncedSearch = homePageManager.debounce(
  homePageManager.searchMeal.bind(homePageManager),
  500,
);

let currentIndex = 0;

const filters = [
  {
    id: 0,
    text: "Chicken",
    src: "assets/chicken.jfif",
  },
  {
    id: 1,
    text: "Turkey",
    src: "assets/turkey.jfif",
  },
  {
    id: 2,
    text: "Beef",
    src: "assets/beef.jfif",
  },
  {
    id: 3,
    text: "Goat",
    src: "assets/goatMeat.jfif",
  },
];

function initializeHomepage() {
  homePageManager.init(cardsContainer);
  updateSlide(slides);
  setInterval(nextSlide.bind(null, slides), 5000);
  renderFilters(filters, filtersCon);
}

initializeHomepage();

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${100 * i}%)`;
});

nextBtn.addEventListener(
  "click",
  homePageManager.nextMealSlide.bind(homePageManager),
);

prevBtn.addEventListener(
  "click",
  homePageManager.prevMealSlide.bind(homePageManager),
);

searchBar.querySelector("input").addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (!value) {
    debouncedSearch.cancel();
    openSections(heroSection, mealFeatures);
    closeSections(mealGrid);
    initializeHomepage();
    return;
  }
  openSections(mealGrid);
  closeSections(heroSection, mealFeatures);

  debouncedSearch(value);
});

filtersCon.addEventListener("click", (e) => {
  const filter = e.target.closest(".filter");
  const filters = filtersCon.querySelectorAll(".filter");
  if (!filter) return;

  filters.forEach((filter) => {
    filter.classList.remove("active-meal-filter");
  });
  filter.classList.add("active-meal-filter");

  const filterValue = filter.dataset.filterValue;
  if (!filterValue) return;
  homePageManager.searchMeal(filterValue.toLowerCase());
  closeSections(heroSection, mealFeatures);
  openSections(mealGrid);
});

cardsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".view-details-btn");
  if (btn) {
    const mealCard = e.target.closest(".meal-card");
    const mealId = mealCard.dataset.cardId;

    homePageManager.goTo("product", mealId);
  }
});

mealGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".view-details-btn");
  if (btn) {
    const mealCard = e.target.closest(".meal-card");
    const mealId = mealCard.dataset.cardId;
    homePageManager.goTo("product", mealId);
  }
});
