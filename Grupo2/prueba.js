        // ============ DATOS DE ANIMES ============
        const animes = [
            {
                id: 1,
                titulo: "One Piece",
                generos: ["Aventura", "Acción", "Comedia", "Shonen"],
                personajes: ["Luffy", "Zoro", "Nami", "Sanji"],
                episodios: 1000,
                temporadas: 20,
                imagen: "🏴‍☠️",
                descripcion: "El rey de los piratas"
            },
            {
                id: 2,
                titulo: "Naruto",
                generos: ["Acción", "Aventura", "Shonen", "Ninjas"],
                personajes: ["Naruto", "Sasuke", "Sakura", "Kakashi"],
                episodios: 720,
                temporadas: 9,
                imagen: "🍜",
                descripcion: "El ninja más famoso"
            },
            {
                id: 3,
                titulo: "Attack on Titan",
                generos: ["Acción", "Drama", "Fantasía oscura", "Misterio"],
                personajes: ["Eren", "Mikasa", "Armin", "Levi"],
                episodios: 87,
                temporadas: 4,
                imagen: "⚔️",
                descripcion: "La humanidad contra los titanes"
            },
            {
                id: 4,
                titulo: "Dragon Ball Z",
                generos: ["Acción", "Artes marciales", "Shonen", "Súper poderes"],
                personajes: ["Goku", "Vegeta", "Gohan", "Piccolo"],
                episodios: 291,
                temporadas: 9,
                imagen: "🐉",
                descripcion: "Las bolas de dragón legendarias"
            },
            {
                id: 5,
                titulo: "Demon Slayer",
                generos: ["Acción", "Fantasía", "Histórico", "Shonen"],
                personajes: ["Tanjiro", "Nezuko", "Zenitsu", "Inosuke"],
                episodios: 55,
                temporadas: 3,
                imagen: "⚔️",
                descripcion: "Cazadores de demonios"
            },
            {
                id: 6,
                titulo: "My Hero Academia",
                generos: ["Acción", "Superhéroes", "Shonen", "Escuela"],
                personajes: ["Deku", "Bakugo", "Todoroki", "All Might"],
                episodios: 138,
                temporadas: 6,
                imagen: "💥",
                descripcion: "El futuro de los héroes"
            }
        ];

        // Estado actual
        let animesFiltrados = [...animes];
        let swiper = null;

        // ============ 1. SWIPER - CARRUSEL ============
        function inicializarCarrusel() {
            const destacados = animes.slice(0, 4); // Primeros 4 animes como destacados
            
            const wrapper = document.querySelector('.swiper-wrapper');
            wrapper.innerHTML = destacados.map(anime => `
                <div class="swiper-slide">
                    <div style="font-size: 5rem; margin-bottom: 20px;">${anime.imagen}</div>
                    <h3>${anime.titulo}</h3>
                    <p>${anime.descripcion}</p>
                    <div style="margin-top: 15px;">
                        ${anime.generos.slice(0, 3).map(g => `<span class="tag" style="background: rgba(255,255,255,0.2); color: white; margin: 0 3px;">${g}</span>`).join('')}
                    </div>
                </div>
            `).join('');

            swiper = new Swiper(".mySwiper", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                autoplay: { delay: 3000, disableOnInteraction: false }
            });
        }

        // ============ 2. FUSE.JS - BÚSQUEDA INTELIGENTE ============
        const fuseOptions = {
            keys: [
                { name: "titulo", weight: 0.7 },
                { name: "generos", weight: 0.2 },
                { name: "personajes", weight: 0.1 }
            ],
            threshold: 0.4, // TOLERA ERRORES (0 = perfecto, 1 = cualquiera)
            includeScore: true,
            ignoreLocation: true,
            minMatchCharLength: 2
        };

        const fuse = new Fuse(animes, fuseOptions);

        function buscarAnimes(termino) {
            if (!termino || termino.length < 2) {
                animesFiltrados = [...animes];
                document.getElementById('resultados-count').innerHTML = '';
            } else {
                const resultados = fuse.search(termino);
                animesFiltrados = resultados.map(r => r.item);
                document.getElementById('resultados-count').innerHTML = 
                    `📊 ${resultados.length} resultados encontrados`;
            }
            
            renderizarGrid();
            animarCards();
        }

        // ============ 3. RENDERIZAR GRID ============
        function renderizarGrid() {
            const grid = document.getElementById('animes-grid');
            
            if (animesFiltrados.length === 0) {
                grid.innerHTML = '<div class="no-resultados">😕 No encontramos animes que coincidan con tu búsqueda</div>';
                return;
            }

            grid.innerHTML = animesFiltrados.map(anime => `
                <div class="card" data-id="${anime.id}">
                    <div style="font-size: 4rem; text-align: center; margin-bottom: 10px;">${anime.imagen}</div>
                    <h3>${anime.titulo}</h3>
                    <p>📺 ${anime.episodios} episodios • ${anime.temporadas} temp.</p>
                    <p>👥 ${anime.personajes.slice(0, 3).join(', ')}...</p>
                    <div class="generos">
                        ${anime.generos.map(g => `<span class="tag">${g}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        // ============ 4. ANIME.JS - ANIMACIONES ============
        function animarCards() {
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                
                anime({
                    targets: cards,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    rotateX: [15, 0],
                    delay: anime.stagger(100, {start: 200}),
                    duration: 800,
                    easing: 'easeOutElastic(1, .5)'
                });

                // Añadir clase visible
                cards.forEach(card => card.classList.add('visible'));
            }, 100);
        }

        // Animaciones hover con Anime.js
        function inicializarHoverEffects() {
            document.addEventListener('mouseover', (e) => {
                const card = e.target.closest('.card');
                if (card) {
                    anime({
                        targets: card,
                        scale: 1.02,
                        translateY: -10,
                        boxShadow: '0 20px 30px rgba(102, 126, 234, 0.3)',
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });

            document.addEventListener('mouseout', (e) => {
                const card = e.target.closest('.card');
                if (card) {
                    anime({
                        targets: card,
                        scale: 1,
                        translateY: 0,
                        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }

        // ============ INICIALIZACIÓN ============
        document.addEventListener('DOMContentLoaded', () => {
            inicializarCarrusel();
            renderizarGrid();
            inicializarHoverEffects();
            
            // Animación inicial
            animarCards();

            // Event listener para búsqueda
            const inputBusqueda = document.getElementById('buscador');
            inputBusqueda.addEventListener('input', (e) => {
                buscarAnimes(e.target.value);
            });

            // Animación de entrada del buscador
            anime({
                targets: '#buscador',
                scale: [0.95, 1],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutElastic'
            });
        });
