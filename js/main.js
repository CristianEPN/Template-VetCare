console.log('JS cargado');

/* =====================================================
   CARGA DE PARTIALS (TOPBAR / NAVBAR / FOOTER)
===================================================== */
function loadPartial(id, file, callback) {
  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = html;
        if (callback) callback();
      }
    })
    .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartial('topbar', 'parts/topbar.html');

  loadPartial('navbar', 'parts/navbar.html', () => {
    initNavbar();
    setActiveMenu();
    window.dispatchEvent(new Event('resize'));
    if(document.getElementById('contenedor-modal')){
        loadPartial('contenedor-modal', 'citaModal.html');
    }
  });

  loadPartial('footer', 'parts/footer.html');

  initHero();
  initStatsCounters();
  initBackToTop();
});

/* =====================================================
   NAVBAR (búsqueda, toggler, etc.)
===================================================== */
function setActiveMenu() {
  // Obtiene el nombre del archivo actual (ej: index.html, services.html)
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  // Recorre todos los links del navbar
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');

    // Limpieza previa
    link.classList.remove('active');

    // Comparación exacta
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}


function initNavbar() {
  const btn = document.querySelector("#btn-search");
  const input = document.querySelector("#search");
  const contenedor = document.querySelector("#contenedor-botones");

  if (btn && input && contenedor) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const esMovil = window.innerWidth <= 768;

      if (input.style.display === "none" || input.style.display === "") {
        input.style.display = "inline-block";
        input.focus();

        if (esMovil) {
          contenedor.classList.remove("flex-row");
          contenedor.classList.add("flex-column", "align-items-center");
        }
      } else {
        if (input.value.trim() !== "") {
          buscar(input.value);
        }

        input.value = "";
        input.style.display = "none";
        contenedor.classList.remove("flex-column");
        contenedor.classList.add("flex-row", "align-items-center");
      }
    });
  }

  const navbarToggler = document.querySelector(".navbar-toggler");
  const btnClose = document.querySelector(".btn-close");

  if (navbarToggler && btnClose) {
    navbarToggler.addEventListener("click", () => {
      navbarToggler.classList.add("d-none");
      btnClose.classList.remove("d-none");
    });

    btnClose.addEventListener("click", () => {
      btnClose.classList.add("d-none");
      navbarToggler.classList.remove("d-none");
      document.querySelector(".navbar-collapse")?.classList.remove("show");
    });
  }
}

function buscar(texto) {
  console.log("Buscando:", texto);
}

/* =====================================================
   MENÚ ACTIVO
===================================================== */
function setActiveMenu() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* =====================================================
   HERO CAROUSEL
===================================================== */
function initHero() {
  const carousel = document.querySelector('#vetcareCarousel');
  const title = document.getElementById('heroTitle');
  const subtitle = document.getElementById('heroSubtitle');

  if (!carousel || !title || !subtitle || !window.bootstrap) return;

  carousel.addEventListener('slid.bs.carousel', (e) => {
    const activeSlide = e.relatedTarget;
    if (!activeSlide) return;

    title.innerHTML =
      activeSlide.dataset.title.replace(" ", "<br><span>") + "</span>";
    subtitle.textContent = activeSlide.dataset.subtitle || "";
  });

  new bootstrap.Carousel(carousel, {
    interval: 9000,
    pause: false,
    ride: 'carousel'
  });
}

/* =====================================================
   CONTADORES ANIMADOS
===================================================== */
function initStatsCounters() {
  const statsSection = document.querySelector('.stats-section');
  const counters = document.querySelectorAll('.stat-number');

  if (!statsSection || counters.length === 0) return;

  function animateCounters() {
    counters.forEach(counter => {
      const numberEl = counter.querySelector('.number');
      if (!numberEl) return;

      const target = parseInt(counter.dataset.target, 10);
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 120));

      function update() {
        current += increment;
        if (current < target) {
          numberEl.textContent = current;
          requestAnimationFrame(update);
        } else {
          numberEl.textContent = target;
        }
      }
      update();
    });
  }

  function resetCounters() {
    counters.forEach(counter => {
      const numberEl = counter.querySelector('.number');
      if (numberEl) numberEl.textContent = 0;
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      } else {
        resetCounters();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/* =====================================================
   GALERÍA MODAL (NOSOTROS)
===================================================== */
let currentImages = [];
let currentIndex = 0;

function viewImage(element) {
  const allImgs = document.querySelectorAll('.img-hover-effect[data-full]');
  currentImages = Array.from(allImgs).map(img => img.dataset.full);

  const clickedSrc = element.dataset.full;
  currentIndex = currentImages.indexOf(clickedSrc);
  updateModalImage();
}

function updateModalImage() {
  const modalImg = document.getElementById('imgFull');
  if (modalImg) modalImg.src = currentImages[currentIndex];
}

function navigateGallery(direction) {
  currentIndex += direction;
  if (currentIndex >= currentImages.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = currentImages.length - 1;
  updateModalImage();
}

/* =====================================================
   FOOTER – BOLETÍN
===================================================== */
function mostrarFormulario() {
  document.getElementById('btnAbrirRegistro')?.classList.add('d-none');
  document.getElementById('grupoRegistro')?.classList.remove('d-none');
  document.getElementById('novedades')?.focus();
}

function enviarSuscripcion() {
  const emailInput = document.getElementById('novedades');
  if (!emailInput) return;

  const email = emailInput.value;

  if (!email || !email.includes('@')) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, ingresa un correo válido.',
      confirmButtonColor: '#00BAE9'
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: '¡Suscripción exitosa!',
    text: `Hemos recibido tu correo: ${email}`,
    confirmButtonColor: '#00BAE9',
    timer: 8000
  });

  emailInput.value = '';
}

/* =====================================================
   BOTON "BACK TO TOP"
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.querySelector('.back-to-top');

  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

/* =====================================================
   PLANES == Capturar Selección de Plan
===================================================== */
const params = new URLSearchParams(window.location.search);
const plan = params.get("plan");

const planInput = document.getElementById("planSeleccionado");

if (plan && planInput) {
    const planes = {
      basico: "Plan Básico",
      standard: "Plan Standard",
      premium: "Plan Premium"
    };

    planInput.value = planes[plan] || "Plan no especificado";
}