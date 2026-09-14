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

      box.innerHTML = `<p><strong>Orario:</strong> ${orarioFormattato} | <strong>Sala:</strong> ${nomeSala} | <strong>Posti liberi:</strong> ${item.available_seats}</p>`;
      screeningsContainer.appendChild(box);
    }
  } catch (error) {
    screeningsContainer.innerHTML = "<p>Errore nel caricamento degli orari.</p>";
  }
}

caricaDettaglioFilm();
caricaSpettacoli();