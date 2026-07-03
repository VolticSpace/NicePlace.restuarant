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
const backBtn = document.querySelector(".back-btn");
const header = document.querySelector(".header");
const navLinkCon = document.querySelector(".nav-links");
const categoryGrid = document.querySelector(".category-grid");
const categoryCon = document.querySelector(".exploree");
const heroCta = document.querySelector(".hero-cta");

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
  homePageManager.renderCategory(categoryGrid);
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
    openSections(heroSection, mealFeatures, categoryCon);
    closeSections(mealGrid);
    initializeHomepage();
    return;
  }
  openSections(mealGrid);
  closeSections(heroSection, mealFeatures, categoryCon);

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
  closeSections(heroSection, mealFeatures, categoryCon);
  openSections(mealGrid);
  backBtn.classList.remove("close");
  backBtn.classList.add("show");
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

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".back-btn");
  if (!btn) return;
  closeSections(mealGrid);
  openSections(heroSection, mealFeatures, categoryCon);
  btn.classList.remove("show");
  btn.classList.add("close");

  filtersCon
    .querySelectorAll(".filter")
    .forEach((fil) => fil.classList.remove("active-meal-filter"));
});

navLinkCon.addEventListener("click", (e) => {
  const links = navLinkCon.querySelectorAll("li");
  const link = e.target.closest("li");
  if (!link) return;

  links.forEach((li) => {
    li.classList.remove("active-nav-link");
    link.classList.add("active-nav-link");
  });
  const linkValue = link.dataset.value;

  if (linkValue === "explore") {
    closeSections(mealGrid);
    openSections(mealFeatures, heroSection);
    categoryCon.scrollIntoView({
      behavior: "smooth",
    });
    btn.classList.remove("show");
    btn.classList.add("close");
    initializeHomepage();
  }

  if (linkValue === "home") {
    closeSections(mealGrid);
    openSections(mealFeatures, heroSection);
    heroSection.scrollIntoView({
      behavior: "smooth",
    });
    btn.classList.remove("show");
    btn.classList.add("close");
    initializeHomepage();
  }
});

heroCta.addEventListener("click", () => {
  categoryCon.scrollIntoView({
    behavior: "smooth",
  });
});

categoryGrid.addEventListener("click", async (e) => {
  const button = e.target.closest(".explore-btn");
  if (!button) return;
  const categoryName = button.dataset.categoryId;
  const meals = await homePageManager.searchByCategory(categoryName);

  if (meals) {
    closeSections(heroSection, mealFeatures, categoryCon);
    openSections(mealGrid);
    homePageManager.renderLookUp(meals, mealGrid);
    backBtn.classList.remove("close");
    backBtn.classList.add("show");
  } else {
    closeSections(mealGrid);
    openSections(heroSection, mealFeatures, categoryCon);
    initializeHomepage();
  }
  console.log(categoryName);
});
