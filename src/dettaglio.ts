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

const containerDetail = document.getElementById("film-detail-container") as HTMLElement;

// Recuperiamo l'ID del film dall'URL (es: dettaglio.html?id=2)
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

caricaDettaglioFilm();