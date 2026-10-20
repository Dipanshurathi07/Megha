(() => {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = document.querySelectorAll(".garba-reveal");

  if ("IntersectionObserver" in window && !motionPreference.matches) {
    document.body.classList.add("garba-motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const photoButtons = [...document.querySelectorAll("[data-photo-index]")];
  const lightbox = document.querySelector(".garba-lightbox");
  const lightboxImage = document.querySelector(".garba-lightbox-image");
  const lightboxCaption = document.querySelector(".garba-lightbox-caption");
  const lightboxCount = document.querySelector(".garba-lightbox-count");

  if (!lightbox || photoButtons.length === 0) {
    return;
  }

  let activeIndex = 0;

  const showPhoto = (index) => {
    activeIndex = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[activeIndex];
    const photo = button.querySelector("img");
    const caption = button.closest("figure").querySelector("figcaption strong");

    lightboxImage.src = photo.currentSrc || photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = caption.textContent;
    lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photoButtons.length).padStart(2, "0")}`;
  };

  photoButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showPhoto(index);
      lightbox.showModal();
    });
  });

  document.querySelector(".garba-lightbox-close").addEventListener("click", () => lightbox.close());
  document.querySelector(".garba-lightbox-prev").addEventListener("click", () => showPhoto(activeIndex - 1));
  document.querySelector(".garba-lightbox-next").addEventListener("click", () => showPhoto(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showPhoto(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      showPhoto(activeIndex + 1);
    }
  });
})();
