const movies = document.querySelector(".movies")
const preview = document.querySelector(".btn-prev")
const next = document.querySelector(".btn-next")
const input = document.querySelector(".input")



let filmesEncontrados = []
let filmesTemporarios = []
let indiceAtual = 0
let indiceFinal = 5

// dados do highlight
const highlightVideo = document.querySelector(".highlight__video")
const highlightTitle = document.querySelector(".highlight__title")
const highlightRating = document.querySelector(".highlight__rating")
const highlightGenres = document.querySelector(".highlight__genres")
const highlightLaunch = document.querySelector(".highlight__launch")
const highlightDescription = document.querySelector(".highlight__description")
const highlightVideoLink = document.querySelector(".highlight__video-link")

let filmesDoDia = []
let videoDoDia = []

// dados do modal


const modal = document.querySelector(".modal")
const modalTitle = document.querySelector(".modal__title")
const modalImg = document.querySelector(".modal__img")
const modalDescription = document.querySelector(".modal__description")
const modalAverage = document.querySelector(".modal__average")
let modalId = []

const btnTheme = document.querySelector(".btn-theme")
const light = "./assets/light-mode.svg"
const dark = "./assets/dark-mode.svg"

function baixarFilmes() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false")
        .then(response => response.json())
        .then(({ results }) => {
            filmesEncontrados = results;
            popularDados(indiceAtual, indiceFinal)
        })

}

function popularDados(indiceAtual, indiceFinal) {
    filmesTemporarios = filmesEncontrados.slice(indiceAtual, indiceFinal)

    filmesTemporarios.forEach((filme, index) => {

        const divMovie = document.createElement("div")
        divMovie.classList.add("movie")
        divMovie.id = ("clear")

        const url = filme.poster_path
        divMovie.style.backgroundImage = `url(${url})`

        const div = document.createElement("div")
        div.classList.add("movie__info")


        const spanTitle = document.createElement("span")
        spanTitle.classList.add("movie__title")
        spanTitle.textContent = filme.title

        const span = document.createElement("span")
        span.classList.add("movie__rating")
        span.textContent = filme.vote_average

        const img = document.createElement("img")
        img.src = "./assets/estrela.svg"

        divMovie.addEventListener("click", (event) => {
            modal.classList.remove("hidden")
            modalId = filme.id
            buscarDadosModal()
        })

        span.append(img)
        div.append(spanTitle, span)
        divMovie.append(div)
        movies.append(divMovie)

    })

}


function apagar() {
    const clear = document.querySelectorAll("#clear")
    clear.forEach((element) => {
        element.remove()

    })

}

function proximaPagina() {
    next.addEventListener("click", (event) => {

        apagar()

        indiceAtual += 5
        indiceFinal += 5

        if (indiceFinal > filmesEncontrados.length) {
            indiceAtual = 0
            indiceFinal = 5
        }

        popularDados(indiceAtual, indiceFinal)

    })
}

function paginaAnterior() {
    preview.addEventListener("click", (event) => {

        apagar()

        indiceAtual -= 5
        indiceFinal -= 5

        if (indiceAtual < filmesTemporarios.length - 6) {
            indiceAtual = 15
            indiceFinal = 20
        }

        popularDados(indiceAtual, indiceFinal)

    })
}

function listaFilmes() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=" + input.value)
        .then(response => response.json())
        .then(({ results }) => {
            filmesEncontrados = results;
            popularDados(indiceAtual, indiceFinal)
        })


}

function buscarFilmes() {
    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter" && input.value === "") location.reload()
        if (event.key !== "Enter" || input.value === "") return
        listaFilmes()
        apagar()

        input.value = ""
    })
}

function buscarFilmesDoDia() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR")
        .then(response => response.json())
        .then((response) => {
            filmesDoDia = response

            popularFilmesDoDia()
            buscarVideoDoDia()
        })
}

function buscarVideoDoDia() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")
        .then(response => response.json())
        .then((response) => {
            videoDoDia = response.results
            highlightVideoLink.href = "https://www.youtube.com/watch?v=" + `${videoDoDia[0].key}`
        })
}

function popularFilmesDoDia() {

    const url = filmesDoDia.backdrop_path
    highlightVideo.style.backgroundImage = `url(${url})`

    highlightTitle.textContent = filmesDoDia.title

    highlightRating.textContent = filmesDoDia.vote_average.toFixed(1)

    highlightGenres.textContent = `${filmesDoDia.genres[0].name}` + ", " + `${filmesDoDia.genres[1].name}` + ", " + `${filmesDoDia.genres[2].name}`

    highlightLaunch.textContent = new Date(filmesDoDia.release_date).toLocaleDateString("pt-br", { year: "numeric", month: "long", day: "numeric" })

    highlightDescription.textContent = filmesDoDia.overview

}

function buscarDadosModal() {

    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/" + `${modalId}` + "?language=pt-BR")
        .then(response => response.json())
        .then((response) => {

            modalTitle.textContent = response.title

            modalImg.src = response.backdrop_path

            modalDescription.textContent = response.overview

            modalAverage.textContent = response.vote_average

            const spanGenre = document.createElement("span")
            spanGenre.classList.add("modal__genre")
            spanGenre.textContent = response.genres[0].name

            const primarySpanGenre = document.createElement("span")
            primarySpanGenre.classList.add("modal__genre")
            primarySpanGenre.textContent = response.genres[1].name

            const secondSpanGenre = document.createElement("span")
            secondSpanGenre.classList.add("modal__genre")
            secondSpanGenre.textContent = response.genres[2].name


            const divGenres = document.querySelector(".modal__genres")

            divGenres.append(spanGenre, primarySpanGenre, secondSpanGenre)
        })
}

modal.addEventListener("click", (event) => {
    modal.classList.add("hidden")
})

btnTheme.addEventListener("click", (event) => {
    btnTheme.src = btnTheme.src === dark ? light : dark

})


baixarFilmes()
buscarFilmes()
proximaPagina()
paginaAnterior()
buscarFilmesDoDia()

