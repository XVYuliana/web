document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     TEXTO ESCRITO AL SCROLL
  ========================= */
  const textos = document.querySelectorAll(".escribir");
  let iniciado = false;

  function escribirTexto(elemento, velocidad = 35) {
    const texto = elemento.textContent.trim();
    elemento.textContent = "";
    elemento.style.visibility = "visible";

    let i = 0;

    return new Promise(resolve => {
      function escribir() {
        if (i < texto.length) {
          elemento.textContent += texto.charAt(i);
          i++;
          setTimeout(escribir, velocidad);
        } else {
          resolve();
        }
      }
      escribir();
    });
  }

  async function escribirEnOrden() {
    for (const texto of textos) {

      await escribirTexto(texto, 35);
      await esperar(250);

      const regla = texto.closest(".regla-item");
      const wrap = regla?.querySelector(".regla-imagen-wrap");

      if (wrap) {
        wrap.classList.remove("latido-oro");
        void wrap.offsetWidth; // forzar repaint
        wrap.classList.add("latido-oro");
      }

      await esperar(1200);
    }
  }

  function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🔥 OBSERVER CORREGIDO PARA MOBILE
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !iniciado) {
        iniciado = true;
        escribirEnOrden();
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.15,          // 👈 mucho más seguro en móvil
    rootMargin: "0px 0px -15% 0px"
  });

  const story = document.querySelector("#story");
  if (story) observer.observe(story);
/* =========================
   CONTROL DE AUDIO
========================= */
const audio = document.getElementById("audioXV");
const botones = document.querySelectorAll("#audioToggle, #audioToggleMobile");

audio.loop = true; // 🔁 repetir infinito

botones.forEach(btn => {
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(err => {
        console.log("Audio bloqueado por el navegador", err);
      });
      botones.forEach(b => b.textContent = "❚❚");
    } else {
      audio.pause();
      botones.forEach(b => b.textContent = "♪");
    }
  });
});
  /* =========================
     LIBRO INTERACTIVO
  ========================= */
  const libro = document.querySelector(".libro-xv");
  if (!libro) return;

  function activarClickLibro() {
    if (window.innerWidth <= 1024) {
      libro.onclick = () => libro.classList.toggle("abierto");
    } else {
      libro.onclick = null;
    }
  }

  activarClickLibro();
  window.addEventListener("resize", activarClickLibro);
  
/* ========================= CONTROL CARRUSEL ========================= */ 
const track = document.querySelector('.gallery-track');  
const btnLeft = document.querySelector('.gallery-btn.left'); 
const btnRight = document.querySelector('.gallery-btn.right'); 
const scrollAmount = 320; btnLeft.addEventListener('click', () => { track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); }); 
btnRight.addEventListener('click', () => { track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); }); 
/* ========================= Scroll CARRUSEL MOVIL ========================= */ 
const cards = document.querySelectorAll('.gallery-card'); 
const trackGallery = document.querySelector('.gallery-track'); 
function activarCentro() { const center = trackGallery.scrollLeft + trackGallery.offsetWidth / 2; cards.forEach(card => { const cardCenter = card.offsetLeft + card.offsetWidth / 2; card.classList.toggle( 'active', Math.abs(center - cardCenter) < card.offsetWidth / 2 ); }); } 
trackGallery.addEventListener('scroll', activarCentro); 
window.addEventListener('load', activarCentro);


/* =========================
   GIRASOLES ANIMADOS AL SCROLL
========================= */

const sunflowerSection = document.querySelector('.sunflower-section');

if (sunflowerSection) {
  const sunflowerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.sunflower').forEach(flower => {
          flower.classList.add('animate');
        });
        sunflowerObserver.disconnect(); // solo una vez
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px"
  });

  sunflowerObserver.observe(sunflowerSection);
}

/* =========================
   CONTADOR REGRESIVO
========================= */
  const countdownContainer = document.getElementById("countdown");
  if (!countdownContainer) return;

  const eventDate = new Date("2026-02-21T00:00:00").getTime();

  const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      clearInterval(countdown);
      countdownContainer.innerHTML = `
      <div class="gran-dia">
        ¡Hoy es el gran día!
      </div>
      `;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

  }, 1000);
/* =========================
   LOADER FORMS
========================= */
  const form = document.getElementById("rsvpForm");
  const boton = form.querySelector('button[type="submit"]');
  const respuesta = document.getElementById("respuesta");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Estado enviando
    boton.classList.add("enviando");
    respuesta.textContent = "Enviando confirmación...";

    // Simulación de envío (aquí luego conectas backend)
    setTimeout(() => {
      boton.classList.remove("enviando");
      boton.disabled = true;

      respuesta.textContent = "Asistencia confirmada";
    }, 2000);
  });
});

