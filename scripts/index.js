
//Ejemplo solicitud https://api.themoviedb.org/3/movie/550?api_key=9ef25729616af857b530f9b1aea7392b
//https://api.themoviedb.org/3/discover/movie?api_key=9ef25729616af857b530f9b1aea7392b&with_genres=18&language=es
const baseURL = 'https://api.themoviedb.org/3/';
const key = '9ef25729616af857b530f9b1aea7392b';
const genUrl = '../generos.json';
let lang = 'es';
let page = 1;
let typesearch = "discover"
let url;
let optGen;
let seeMorAuto = false;

const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const selectOpt = document.querySelector('select');
const section = document.querySelector('section');
const tracingop = document.querySelector('#tracing');
const linkMore = document.createElement('a');
const divB = document.createElement('div');

let bodyScroll = document.body.scrollTop;
console.log('31 succes');
window.onscroll = function () {
    if (seeMorAuto === true) {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight * (98 / 100)) {
            page++;
            optGen;
            fetchResults();
            console.log('36 succes');
        }
    }
};


searchForm.addEventListener('submit', submitSerch);
linkMore.addEventListener('click', loadMore);
//callback reutilizable
function consultaJson(url, callback) {
    fetch(url).then(result => {
        if (!result.ok) {
            throw new Error('no se establecio conexion 42 failed');
        }
        else {
            return result.json();
        }
    }).then(json => {
        callback(json);
    }).catch(e => console.log(e.message));
}
//alcargar la pagina
window.onload = function () {
    consultaJson(genUrl, displaySelect);
    fetchResults();
    console.log('55 succes');
}
function displaySelect(json) {
    const genres = json.genres;
    if (genres.length === 0) {
        console.log('no se cargaron los datos /31');
    }
    else {
        // console.log(genres);
        for (let i = 0; i < genres.length; i++) {
            // console.log(genres[i]);
            const option = document.createElement('option');
            option.value = genres[i].id;
            option.textContent = genres[i].name;
            selectOpt.appendChild(option);
            // let options = selectOpt.options;
            // options[options.length] = new Option(genres[i].name,genres[i].id);
        }
    }
}
function submitSerch(e) {

    optGen = selectOpt.value;

    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    e.preventDefault();
    fetchResults();
}
function loadMore() {
    page++;
    optGen;
    seeMorAuto = true;
    fetchResults();
}
function fetchResults() {

    //https://api.themoviedb.org/3/discover/movie?api_key=9ef25729616af857b530f9b1aea7392b&with_genres=18&language=es
    url = baseURL + typesearch + '/movie?api_key=' + key
        + '&language=' + lang + '&page=' + page + '&sort_by=popularity.desc';
    if (optGen) {
        if (optGen !== 'ninguno') {
            let ad = '&with_genres=' + optGen
            url += ad
            console.log('97 succes' + url);
        }
    }
    console.log(url);

    consultaJson(url, displayResults);
}
function displayResults(json) {

    // while (section.firstChild) {
    //     section.removeChild(section.firstChild);
    // }
    const articles = json.results;

    if (articles.length === 0) {
        const para = document.createElement('p');
        para.textContent = "No results";
    } else {
        for (let i = 0; i < articles.length; i++) {
            const article = document.createElement('article');
            const heading = document.createElement('h2');
            const linkimg = document.createElement('a');
            const linkhdng = document.createElement('a');
            const image = document.createElement('img');
            const para1 = document.createElement('p');
            const divImage = document.createElement('div');
            const divContent = document.createElement('div');

            image.src = 'https://image.tmdb.org/t/p/w342/' + articles[i].poster_path;
            image.alt = articles[i].original_title;
            heading.textContent = articles[i].title;
            para1.textContent = articles[i].release_date;
            article.setAttribute('class', 'card-movie');

            divImage.setAttribute('class', 'img');
            linkimg.href = 'detailmovie' + articles[i].id;
            linkimg.appendChild(image);
            divImage.appendChild(linkimg)
            article.appendChild(divImage);

            divContent.setAttribute('class', 'content');
            divContent.appendChild(heading);
            divContent.appendChild(para1);
            article.appendChild(divContent);
            section.appendChild(article);
        }

        divB.setAttribute('class', 'more');
        linkMore.textContent = "Mostrar mas";
        divB.appendChild(linkMore);
        section.appendChild(divB);
    }
}

