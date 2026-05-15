const chips = document.querySelectorAll(".chip");
const response = document.querySelector("[data-response]");
const counter = document.querySelector("[data-counter]");
const action = document.querySelector("[data-demo-action]");
let interactions = 0;

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    if (response) {
      response.textContent = chip.dataset.response || "";
    }
  });
});

if (action && counter) {
  action.addEventListener("click", () => {
    interactions += 1;
    counter.textContent = `Interações nesta visita: ${interactions}`;
    action.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-2px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 220, easing: "ease-out" }
    );
  });
}
