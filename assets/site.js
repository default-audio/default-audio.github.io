const railLinks = [...document.querySelectorAll("[data-rail]")];
const pluginSections = [...document.querySelectorAll("[data-plugin]")];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const active = visible.target.dataset.plugin;
      railLinks.forEach((link) => {
        if (link.dataset.rail === active) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { threshold: [0.35, 0.55, 0.75] },
  );

  pluginSections.forEach((section) => observer.observe(section));
}
