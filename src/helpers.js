let currentSlide = 0;

export function closeSections(...args) {
  args.forEach((arg) => {
    arg?.classList.remove("show-meal-grid");
    arg?.classList.add("hide");
  });
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
