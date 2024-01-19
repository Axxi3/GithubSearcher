const loader = document.getElementById("loader");
const cards = document.getElementsByClassName("card");
let currentPage = 1;
let reposPerPage = 10;

const fetchData = () => {
    const username = document.getElementById("UserName");
    const TopSec = document.getElementById("TopSec");

    if (username.value.length === 0) {
        alert("Please Type Username");
    } else {
        const name = username.value.split(" ").join("");
        const apiUrl = `https://api.github.com/users/${name}`;

        loader.style.display = 'block';

        fetch(apiUrl)
            .then((result) => result.json())
            .then((data) => {
                TopSec.innerHTML = `
                    <div class="left">
                        <img src="${data.avatar_url}" alt="">
                    </div>
                    <div class="right">
                        <h1>${data.login}</h1>
                        <p>${data.bio}</p>
                        <div class="location">
                            <img src="map.png" alt="">
                            <p>${data.location == null ? "No information available" : data.location}</p>
                        </div>
                        <p>Twitter: ${data.twitter == undefined ? "Not available" : data.twitter}</p>
                        <a href=${data.html_url}>${data.html_url}</a> <br/>
                        <input type="number" id="page" name="page" placeholder="Type the number of repo you want"> 
                <button onclick=changePagesNumber() class="Apply">Apply changes</button>
                    </div>
                `;

                loader.style.display = 'none';
                if(data.login !=undefined) { 
                    FetchRepos(data.repos_url, currentPage);
                } else { 
                    loader.style.display = 'none'; 
                    TopSec.innerHTML=`
                    <h1 class"notfound">No User FOUND</h1>
                    `
                     TopSec.innerHTML = '';
                     document.getElementById("Repos").innerHTML = '';
                     document.getElementById("PageContainer").innerHTML = '';
                 
                }
             
            });
    }
};

const FetchRepos = (apiUrl, page) => {
    const startIndex = (page - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;

    fetch(apiUrl)
        .then((result) => result.json())
        .then((data) => {
            let reposHTML = '';

            for (let index = startIndex; index < endIndex && index < data.length; index++) {
                reposHTML += `
                    <div class="card" style="width: 40%;">
                        <h2 class="card-title">${data[index].name}</h2>
                        <p class="card-text">${data[index].description != null ? data[index].description : "No Description Available"}</p>
                        <div class="languages" id="languages">  
                        <div id="Loader3" style="display: none;">Loading</div>
                        </div>
                        <a href="${data[index].html_url}">Link to Original Repo</a>
                    </div>`;
            }

            document.getElementById("Repos").innerHTML = reposHTML;

            FetchLanguages(data.slice(startIndex, endIndex).map(repo => repo.languages_url));    
            console.log("Calling Pages")
            addPages(data.length)
        });
};  




const addPages = (length) => {
    const Total = Math.ceil(length / reposPerPage); 
    console.log("This is total " + Total);
    let pages = "";
    
    for (let index = 1; index <= Total; index++) {
        pages += `
            <p class="Pages" onclick="changePage(${index})">${index}</p>
        `;
    }

    document.getElementById("PageContainer").innerHTML = pages;
};


const changePage = (newPage) => {
    currentPage = newPage;
    fetchData();
};



const FetchLanguages = (UrlArray) => {  
    document.getElementById("Loader3").style.display = 'block';
    for (let index = 0; index < UrlArray.length; index++) {
        let languageArray = "";

        fetch(UrlArray[index])
            .then((result) => result.json())
            .then((data) => {
                for (let language in data) {
                    languageArray += `<button type="button">${language}</button>`;
                }
                document.getElementById("Loader3").style.display = 'none';
                document.getElementsByClassName("languages")[index].innerHTML = languageArray;
            });
    }
};  
const changePagesNumber=()=>{   
    let value=document.getElementById("page").value  
    if(value<10){ 
        alert("Minimum 10")
    } else if(value>100){ 
        alert("Maximum 100")
    } else { 
        reposPerPage=value 
        fetchData()
    }
    
}

document.getElementsByClassName("UserSearch")[0].onclick = fetchData;  


