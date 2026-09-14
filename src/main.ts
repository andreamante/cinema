interface Film {
  id: number;
  title: string;
  genre: string;
  duration: number;
  year: number;
  poster_url: string;
}

const container = document.getElementById("movies-container") as HTMLElement;

async function mostraFilm() {
  try {
    const response = await fetch("https://its-cinema.vercel.app/api/films");
    const films: Film[] = await response.json();

    container.innerHTML = "";

    for (const film of films) {
      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <img src="${film.poster_url}" alt="${film.title}">
        <h3>${film.title}</h3>
        <p>${film.genre} • ${film.duration} min</p>
        <a href="dettaglio.html?id=${film.id}">Scopri di più</a>
      `;

      container.appendChild(card);
    }
  } catch (error) {
    container.innerHTML = "<p>Errore nel caricamento dei film.</p>";
  }
}

mostraFilm();