const railLinks = [...document.querySelectorAll("[data-rail]")];
const pluginSections = [...document.querySelectorAll("[data-plugin]")];
const siteHeader = document.querySelector(".site-header");
const sectionRail = document.querySelector(".section-rail");

function findBackgroundColor(element) {
  let currentElement = element;

  while (currentElement) {
    const color = window.getComputedStyle(currentElement).backgroundColor;
    const channels = color.match(/[\d.]+/g)?.map(Number);

    if (channels && (channels.length < 4 || channels[3] > 0)) {
      return channels;
    }

    currentElement = currentElement.parentElement;
  }

  return [5, 5, 5];
}

function updateRailOutlines() {
  if (!sectionRail || typeof document.elementFromPoint !== "function") return;

  sectionRail.style.pointerEvents = "none";

  railLinks.forEach((link) => {
    const bounds = link.getBoundingClientRect();
    const sampleX = Math.min(window.innerWidth - 1, Math.max(0, bounds.left + 1));
    const sampleY = Math.min(window.innerHeight - 1, Math.max(0, bounds.top + bounds.height / 2));
    const backdrop = document.elementFromPoint(sampleX, sampleY);
    const [red, green, blue] = findBackgroundColor(backdrop);
    const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;

    link.style.setProperty(
      "--rail-outline",
      brightness > 128 ? "var(--ink)" : "var(--paper)",
    );
  });

  sectionRail.style.removeProperty("pointer-events");
}

function updateSectionRail() {
  const headerHeight = siteHeader?.offsetHeight ?? 0;
  const activationLine = Math.max(headerHeight + 2, window.innerHeight * 0.4);
  let activePlugin = null;

  pluginSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) {
      activePlugin = section.dataset.plugin;
    }
  });

  railLinks.forEach((link) => {
    if (link.dataset.rail === activePlugin) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  updateRailOutlines();
}

window.addEventListener("scroll", updateSectionRail, { passive: true });
document.addEventListener("scroll", updateSectionRail, { passive: true, capture: true });
window.addEventListener("resize", updateSectionRail);
window.addEventListener("load", updateSectionRail);
window.addEventListener("pageshow", updateSectionRail);
updateSectionRail();
