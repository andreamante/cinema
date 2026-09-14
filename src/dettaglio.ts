interface FilmDetail {
  id: number;
  title: string;
  genre: string;
  duration: number;
  year: number;
  director: string;
  description: string;
  poster_url: string;
  rating: string;
}

interface Hall {
  id: number;
  name: string;
  capacity: number;
}

interface Screening {
  id: number;
  starts_at: string;
  hall: Hall;
  available_seats: number;
}

const containerDetail = document.getElementById("film-detail-container") as HTMLElement;
const screeningsContainer = document.getElementById("screenings-container") as HTMLElement;

const bookingModal = document.getElementById("booking-modal") as HTMLElement;
const closeModalBtn = document.getElementById("close-modal-btn") as HTMLButtonElement;
const bookingForm = document.getElementById("booking-form") as HTMLFormElement;
const selectedScreeningInput = document.getElementById("selected-screening-id") as HTMLInputElement;
const inputNome = document.getElementById("input-nome") as HTMLInputElement;
const inputCognome = document.getElementById("input-cognome") as HTMLInputElement;
const inputEmail = document.getElementById("input-email") as HTMLInputElement;
const bookingMessage = document.getElementById("booking-message") as HTMLElement;

const urlParams = new URLSearchParams(window.location.search);
const filmId = urlParams.get("id");

async function caricaDettaglioFilm() {
  if (!filmId) {
    containerDetail.innerHTML = "<p>Nessun film selezionato.</p>";
    return;
  }

  try {
    const response = await fetch(`https://its-cinema.vercel.app/api/films/${filmId}`);
    const film: FilmDetail = await response.json();

    containerDetail.innerHTML = `
      <div class="movie-detail-box">
        <img src="${film.poster_url}" alt="${film.title}" class="detail-poster">
        <div class="detail-info">
          <h2>${film.title}</h2>
          <p><strong>Genere:</strong> ${film.genre}</p>
          <p><strong>Durata:</strong> ${film.duration} min</p>
          <p><strong>Anno:</strong> ${film.year}</p>
          <p><strong>Regista:</strong> ${film.director}</p>
          <p><strong>Classificazione:</strong> ${film.rating}</p>
          <p class="description"><strong>Trama:</strong> ${film.description}</p>
        </div>
      </div>
    `;
  } catch (error) {
    containerDetail.innerHTML = "<p>Errore nel caricamento del dettaglio film.</p>";
  }
}

async function caricaSpettacoli() {
  if (!filmId) return;

  try {
    const response = await fetch(`https://its-cinema.vercel.app/api/films/${filmId}/screenings`);
    const screenings: Screening[] = await response.json();

    screeningsContainer.innerHTML = "";

    if (screenings.length === 0) {
      screeningsContainer.innerHTML = "<p>Nessun orario disponibile per questo film.</p>";
      return;
    }

    for (const item of screenings) {
      const box = document.createElement("div");
      box.className = "screening-item";

      const dataOggetto = new Date(item.starts_at);
      const orarioFormattato = dataOggetto.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });

      const nomeSala = item.hall ? item.hall.name : "N/D";

      box.innerHTML = `
        <p>
          <strong>Orario:</strong> ${orarioFormattato} | 
          <strong>Sala:</strong> ${nomeSala} | 
          <strong>Posti liberi:</strong> ${item.available_seats}
        </p>
        <small style="color: #d4a359;">Clicca per prenotare</small>
      `;

      box.addEventListener("click", function () {
        apriModalePrenotazione(item.id);
      });

      screeningsContainer.appendChild(box);
    }
  } catch (error) {
    screeningsContainer.innerHTML = "<p>Errore nel caricamento degli orari.</p>";
  }
}

function apriModalePrenotazione(screeningId: number) {
  selectedScreeningInput.value = screeningId.toString();
  bookingMessage.textContent = "";
  bookingModal.style.display = "flex";
}

function chiudiModale() {
  bookingModal.style.display = "none";
  bookingForm.reset();
}

async function gestisciPrenotazione(e: Event) {
  e.preventDefault();

  const screeningId = Number(selectedScreeningInput.value);
  const nome = inputNome.value.trim();
  const cognome = inputCognome.value.trim();
  const email = inputEmail.value.trim();

  bookingMessage.style.color = "#ffffff";
  bookingMessage.textContent = "Invio prenotazione in corso...";

  const endpointURL = `https://its-cinema.vercel.app/api/screenings/${screeningId}/bookings`;

  const payload = {
    first_name: nome,
    last_name: cognome,
    email: email
  };

  console.log("Invio richiesta a:", endpointURL);
  console.log("Payload inviato:", payload);

  try {
    const response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("Stato risposta HTTP:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Risposta API:", data);
      
      bookingMessage.style.color = "#4CAF50";
      bookingMessage.textContent = "Prenotazione effettuata con successo!";
      setTimeout(function () {
        chiudiModale();
        caricaSpettacoli();
      }, 1500);
    } else {
      const errorText = await response.text();
      console.error("Errore API (testo):", errorText);
      
      bookingMessage.style.color = "#f44336";
      bookingMessage.textContent = `Errore ${response.status}: verificare i dati inseriti.`;
    }
  } catch (error) {
    console.error("Errore Fetch:", error);
    bookingMessage.style.color = "#f44336";
    bookingMessage.textContent = "Errore di connessione al server.";
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", chiudiModale);
}

if (bookingForm) {
  bookingForm.addEventListener("submit", gestisciPrenotazione);
}

caricaDettaglioFilm();
caricaSpettacoli();