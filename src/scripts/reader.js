    const modeButtons = document.querySelectorAll(".comic-mode-btn");
    const scrollContainer = document.getElementById("scroll-container");
    const pageControls = document.querySelectorAll(".comic-pager__nav");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageImg = document.getElementById("comic-page-img");
    const pageIndicator = document.getElementById("page-indicator");

    let url = new URL(window.location.href);
    let currentMode = url.searchParams.get("mode") || "infinite";
    let currentPage = Math.max(
      0,
      parseInt(url.searchParams.get("page") || "0"),
    );
    let currentScrollPage = 1;

    function updateUI() {
      scrollContainer.style.display =
        currentMode === "infinite" ? "block" : "none";
      pageControls.forEach((pager) => {
        pager.style.display = currentMode === "paged" ? "block" : "none";
      });

      modeButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.mode === currentMode);
      });

      if (currentMode === "paged") {
        if (currentPage >= images.length) currentPage = images.length - 1;
        pageImg.src = images[currentPage];
        pageIndicator.textContent = `${currentPage + 1} / ${images.length}`;
        prevButton.disabled = currentPage <= 0;
        nextButton.disabled = currentPage >= images.length - 1;
      }

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("mode", currentMode);
      if (currentMode === "paged") newUrl.searchParams.set("page", currentPage);
      else newUrl.searchParams.delete("page");
      window.history.replaceState({}, "", newUrl);
    }

    // Intersection Observer для отслеживания видимых страниц при бесконечной прокрутке
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    let visiblePages = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const pageIndex = parseInt(entry.target.dataset.pageIndex);
        if (entry.isIntersecting) {
          visiblePages.add(pageIndex);
        } else {
          visiblePages.delete(pageIndex);
        }
      });

      if (visiblePages.size > 0) {
        const minPage = Math.min(...visiblePages);
        currentScrollPage = minPage + 1;
        pageIndicator.textContent = `${currentScrollPage} / ${images.length}`;
      }
    }, observerOptions);

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const newMode = btn.dataset.mode;

        // Синхронизируем текущую страницу при переключении режимов
        if (currentMode === "infinite" && newMode === "paged") {
          // Переходим из infinite в paged - устанавливаем страницу на основе scrollPage
          currentPage = currentScrollPage - 1;
        } else if (currentMode === "paged" && newMode === "infinite") {
          // Переходим из paged в infinite - обновляем scrollPage на основе currentPage
          currentScrollPage = currentPage + 1;
        }

        currentMode = newMode;
        updateUI();

        // Если переключились на бесконечную прокрутку, скроллим к текущей странице
        if (newMode === "infinite") {
          // Используем setTimeout для того, чтобы DOM обновился до скролла
          setTimeout(() => {
            scrollToPage(currentPage);
          }, 100);
        }
      });
    });

    const navigate = (step) => {
      currentPage = Math.max(
        0,
        Math.min(images.length - 1, currentPage + step),
      );
      updateUI();
    };

    const scrollToPage = (pageIndex) => {
      const comicPages = scrollContainer?.querySelectorAll(".comic-page");
      if (comicPages && comicPages[pageIndex]) {
        comicPages[pageIndex].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    prevButton?.addEventListener("click", () => navigate(-1));
    nextButton?.addEventListener("click", () => navigate(1));

    const tocToggles = document.querySelectorAll(".chapter-toc-toggle");
    const chapterToc = document.getElementById("chapter-toc");
    const blurOverlay = document.getElementById("overlay");

    tocToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        chapterToc.classList.toggle("active");
        blurOverlay.classList.toggle("is-active");
        // Включаем или выключаем блокировку скролла страницы
        document.body.classList.toggle("no-scroll");
      });
    });

    blurOverlay.addEventListener("click", () => {
      chapterToc.classList.toggle("active");
      blurOverlay.classList.toggle("is-active");
      // Включаем или выключаем блокировку скролла страницы
      document.body.classList.toggle("no-scroll");
    });

    chapterToc?.querySelectorAll("nav a, ul a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 1024px)").matches) {
          chapterToc.classList.remove("active");
          blurOverlay.classList.toggle("is-active");
          // Включаем или выключаем блокировку скролла страницы
          document.body.classList.toggle("no-scroll");
        }
      });
    });

    // Добавляем data-attribute к каждому комиксу для отслеживания
    const comicPages = scrollContainer?.querySelectorAll(".comic-page");
    comicPages?.forEach((page, index) => {
      page.dataset.pageIndex = index;
      observer.observe(page);
    });

    updateUI();

    // При загрузке в режиме infinite, если есть page в URL, скроллим к этой странице
    if (currentMode === "infinite" && url.searchParams.has("page")) {
      setTimeout(() => {
        scrollToPage(currentPage);
      }, 100);
    }
