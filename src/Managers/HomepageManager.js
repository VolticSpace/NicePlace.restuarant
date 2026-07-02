export class HomePageManager {
  constructor(currentIndex = 0, mealFeature, cardCons, mealGrid) {
    this.currentIndex = currentIndex;
    this.mealFeature = mealFeature;
    this.cardsCons = cardCons;
    this.mealGrid = mealGrid;
  }
  init(cardsContainer) {
    const spaghetti = fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=spaghetti",
    );
    const pizza = fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=pizza",
    );
    const rice = fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=rice",
    );
    Promise.all([rice, pizza, spaghetti])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((data) => {
        const meals = data
          .flatMap((item) => item.meals)
          .sort((a, b) => a.strMeal.localeCompare(b.strMeal));
        const mealArray = meals.map((meal) => ({
          id: meal.idMeal,
          country: meal.strArea,
          src: meal.strMealThumb,
          name: meal.strMeal,
        }));
        this.renderLookUp(mealArray, cardsContainer);
      })
      .catch(console.error);
  }
  renderLookUp(arr, con) {
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
    <p class="meal-category">${
      meal.country === null ? "Unknown Country" : `${meal.country}`
    }</p>
    <button class="view-details-btn" data-card-id="${meal.id}">View Details</
  button>
  </div>
  <div class="more-btn">
    <svg class="fav" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
  </div>
  </div>
   `;
    });
    con.insertAdjacentHTML("beforeend", html);
  }
  filterMeal() {}
  async searchMeal(...args) {
    const [mealName] = args;
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
      );
      const data = await res.json();
      if (!data.meals) return [];
      const meals = data.meals.map((meal) => ({
        id: meal.idMeal,
        country: meal.strArea,
        src: meal.strMealThumb,
        name: meal.strMeal,
      }));

      this.renderLookUp(meals, this.mealGrid);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  goTo(page, id) {
    window.location.href = `${page}.html?id=${id}`;
  }
  saveMealDetails(id) {
    localStorage.setItem("id", JSON.stringify(id));
  }
  debounce(callback, delay) {
    let timer;

    function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    }

    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  }
  updateMealCard() {
    const cards = this.mealFeature.querySelectorAll(".meal-card");
    const styles = getComputedStyle(this.cardsCons);
    const gap = parseFloat(styles.columnGap || styles.gap);
    if (!cards.length) return;
    const cardwidth = cards[0].getBoundingClientRect().width;
    this.cardsCons.style.transform = `translateX(-${
      this.currentIndex * (cardwidth + gap)
    }px)`;
  }
  nextMealSlide() {
    const cards = document.querySelectorAll(".meal-card");
    this.currentIndex++;
    if (this.currentIndex > cards.length - 9) {
      this.currentIndex = 0;
    }
    this.updateMealCard();
  }
  prevMealSlide() {
    const cards = document.querySelectorAll(".meal-card");
    this.currentIndex--;
    if (this.currentIndex < cards.length - 3) {
      this.currentIndex = 0;
    }
    this.updateMealCard();
  }
  navigatePage(con) {
    con.addEventListener("click", () => {});
  }
}
