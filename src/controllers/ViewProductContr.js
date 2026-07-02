import { ProductManager } from "../Managers/ViewProductManager.js";

const mealImg = document.querySelector(".mealImg");
const mealTitle = document.querySelector(".mealTitle");
const ingredientsCon = document.getElementById("ingredientGrid");
const instructionsCon = document.getElementById("mealInstructions");
const videoFrame = document.getElementById("mealVideo");
const mealArea = document.getElementById("mealArea");
const mealTag = document.getElementById("mealTags");
const mealCategory = document.getElementById("mealCategory");
const blogBtn = document.querySelector(".blog-btn");
const videoBtn = document.querySelector(".outline-btn");
const videoWrapper = document.querySelector(".video-wrapper");

const productManager = new ProductManager();

async function init() {
  const params = new URLSearchParams(window.location.search);
  const mealId = params.get("id");

  const data = await productManager.getMealDetails(mealId);
  if (!data) return;
  const { meals } = data;
  const mealData = meals[0];
  const meal = {
    id: mealData.idMeal,
    country: mealData.strArea,
    src: mealData.strMealThumb,
    name: mealData.strMeal,
    tag: mealData.strTags,
    ingredients: [],
    instructions: mealData.strInstructions,
    video: mealData.strYoutube,
    mealSource: mealData.strSource,
    category: mealData.strCategory,
  };

  for (let i = 1; i <= 20; i++) {
    const ingred = mealData[`strIngredient${i}`];
    const ingredMeasure = mealData[`strMeasure${i}`];

    if (ingred && ingred.trim()) {
      meal.ingredients.push({
        ingredient: ingred,
        measure: ingredMeasure,
      });
    }
  }
  const instructions = meal.instructions.split("\r\n\r\n").filter(Boolean);

  let instrStr = "";
  instructions.forEach((instr) => {
    instrStr += `<p>${instr}</p>`;
  });
  instructionsCon.insertAdjacentHTML("beforeend", instrStr);
  mealImg.src = meal.src;
  mealTitle.textContent = meal.name;
  let html = "";
  meal.ingredients.forEach((ingMrs) => {
    html += `<div>${ingMrs.ingredient} : ${ingMrs.measure}</div>`;
  });

  ingredientsCon.insertAdjacentHTML("beforeend", html);
  const youtubeUrl = meal.video;

  const videoId = new URL(youtubeUrl).searchParams.get("v");
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  videoFrame.src = embedUrl;
  const tag = meal.tag === null ? "" : `${meal.tag}`;
  mealArea.textContent = meal.country;
  mealTag.textContent = tag;

  mealCategory.textContent = meal.category;
  console.log(mealData);

  blogBtn.addEventListener("click", () => {
    window.location.href = meal.mealSource;
  });
  videoBtn.addEventListener("click", () => {
    videoWrapper.scrollIntoView({
      behavior: "smooth",
    });
  });
}
init();
