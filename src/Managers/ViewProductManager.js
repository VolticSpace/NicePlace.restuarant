import { HomePageManager } from "./HomepageManager.js";

export class ProductManager extends HomePageManager {
  constructor() {
    super(null, null, null, null);
  }

  async getMealDetails(id) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );

    const data = await res.json();

    if (!data) return;

    return data;
  }
  renderMealDetails() {}
  goToYouTube() {}
}
