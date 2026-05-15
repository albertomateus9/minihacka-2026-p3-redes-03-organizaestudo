const chips = document.querySelectorAll(".chip");
const demoTitle = document.querySelector("[data-demo-title]");
const demoSummary = document.querySelector("[data-demo-summary]");
const demoMeta = document.querySelector("[data-demo-meta]");
const demoDetail = document.querySelector("[data-demo-detail]");
const counter = document.querySelector("[data-counter]");
const action = document.querySelector("[data-demo-action]");
let interactions = 0;

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    if (demoTitle) {
      demoTitle.textContent = chip.dataset.scenarioTitle || "";
    }
    if (demoSummary) {
      demoSummary.textContent = chip.dataset.scenarioSummary || "";
    }
    if (demoMeta) {
      demoMeta.textContent = chip.dataset.scenarioMeta || "";
    }
    if (demoDetail) {
      demoDetail.textContent = chip.dataset.scenarioDetail || "";
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
