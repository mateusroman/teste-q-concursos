document.querySelector('button').addEventListener('click', function(){
    let nome = document.querySelector('input').value;
    ApiGitHub(nome);
});

ApiGitHub('mateusroman'); /* starts getting mateusroman github profile */

function ApiGitHub(profileName){
    fetch(`https://api.github.com/users/${profileName}`)
    .then(response => response.json())
    .then(data => {
        CarregarProfile(data);
    }).catch(error => console.error(error))
}


function CarregarProfile(data) {
    var apiStructure = new GitHubApiUtils().selectStructureFromApiReturn(data);
    var domStructure = new DomApiStructure();

    domStructure.gitavatar.src = apiStructure.urlAvatar;
    domStructure.linktogitprofile.href = apiStructure.urlPerfil;
    domStructure.nome.innerText = apiStructure.nome;
    domStructure.repositorios.innerText = apiStructure.quantidadeRepositorios;
    domStructure.seguidores.innerText = apiStructure.quantidadeSeguidores;
    domStructure.seguindo.innerText = apiStructure.quantidadeSeguidos;

    obterRepositorios(apiStructure.urlRepositorios)
}

function obterRepositorios(urlRepositorios) {
    fetch(`${urlRepositorios}`)
    .then(response => response.json())
    .then(data => {
        let repos = "<h2>REPOSITÓRIOS</h2>";

        data.map((repositorio) => {  
            let urlFormatada = `<div><a href="${repositorio.html_url}" target="_blank">${repositorio.name}</a></div>`
            repos += urlFormatada;
        });

        elementOfDom('.gitrepoinfo').innerHTML = repos;
        
        return repos;
    })
    .catch(error => console.error(error))
}

class GitHubApiStructure {
    urlRepositorios;
    urlPerfil;
    urlAvatar;
    quantidadeSeguidores;
    quantidadeSeguidos;
    quantidadeRepositorios;
    nome;
}

class GitHubApiUtils {
    selectStructureFromApiReturn = (data) => {
        const apiStructure = new GitHubApiStructure();
        apiStructure.urlRepositorios = data.repos_url;
        apiStructure.urlPerfil = data.html_url;
        apiStructure.urlAvatar = data.avatar_url;
        apiStructure.quantidadeSeguidores = data.followers;
        apiStructure.quantidadeSeguidos = data.following;
        apiStructure.quantidadeRepositorios = data.public_repos;
        apiStructure.nome = data.login;
        return apiStructure;
    }
}

class DomApiStructure {
    constructor(){
        this.gitavatar = elementOfDom('#gitavatar');
        this.linktogitprofile = elementOfDom('#linktogitprofile');
        this.nome = elementOfDom('#nome');
        this.repositorios = elementOfDom('#repositorios');
        this.seguidores = elementOfDom('#seguidores');
        this.seguindo = elementOfDom('#seguindo');
    }    
}

let elementOfDom = (nome) => {
    return document.querySelector(nome);
}