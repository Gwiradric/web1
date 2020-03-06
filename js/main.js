document.addEventListener("DOMContentLoaded", initPage);

function initPage() {
  "use strict";

  //BEGIN OF THE BEHAVIOR FOR THE TABLE OF allMovies.html-------------------------------------------------

  let allMovies = []; //this array will contain all the movies of the table 

  //this array only contains extra movies the user can add with the button "Add 3 Rows"
  let extraMovies = [
    { "rankingPos": "50", "name": "Pokemon", "rating": "1", "downloadsAmount": "55000" },
    { "rankingPos": "1", "name": "Naruto", "rating": "5", "downloadsAmount": "999999" },
    { "rankingPos": "61", "name": "Matilda", "rating": "1.1", "downloadsAmount": "3" }];

  let id; //id used by the edit button
  let moviesTable = document.querySelector("#tableBody"); //table of html
  let headMoviesTable = moviesTable.innerHTML; //this variable will save the head of the table
  let url = "http://web-unicen.herokuapp.com/api/groups/24/tpe"; //servidor url

  async function getInfoServer() {
    try {
      let recibido = await fetch(url); //getting the info from servidor
      let json = await recibido.json();//casting to json

      allMovies = [];
      if (json.tpe.length > 0) {
        for (let i = 0; i < json.tpe.length; i++) { //setting the id's of each movie
          json.tpe[i].thing.id = json.tpe[i]._id;
          allMovies.push(json.tpe[i].thing);
        }
        showMovies(allMovies);
      }
    }
    catch (t) {
      console.log(t);
    }
  }

  async function sendInfoServer(newMovie) {
    //this function is responsible for saving the information on the server
    let data = {
      "thing": {
        "rankingPos": newMovie.rankingPos,
        "name": newMovie.name,
        "rating": newMovie.rating,
        "downloadsAmount": newMovie.downloadsAmount,
      }
    };
    try {
      await fetch(url, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(data),
      });
      getInfoServer();
    }
    catch (t) {
      console.log(t);
    }
  }

  async function editInfoServer(movie, id) {
    //this function is responsible for editing the information on the server
    let data = {
      "thing": {
        "rankingPos": movie.rankingPos,
        "name": movie.name,
        "rating": movie.rating,
        "downloadsAmount": movie.downloadsAmount,
      }
    };
    try {
      await fetch(url + "/" + id, {
        "method": "PUT",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(data),
      });
      getInfoServer();
    }
    catch (t) {
      console.log(t);
    }
  }

  async function deleteInfoServer(id) {
    //this function is responsible for editing the information on the server
    try {
      await fetch(url + "/" + id, {
        "method": "DELETE",
      });
      getInfoServer();
    }
    catch (t) {
      console.log(t);
    }
  }

  function createDeleteButton(id) {
    //this function creates a new delete button and adds the event when the button is clicked
    let button = document.createElement("button");
    button.textContent = "Delete";
    button.addEventListener("click", function () {
      deleteInfoServer(id);
    })
    return button;
  }

  function createEditButton(movie) {
    //this function creates a new edit button and adds the event when the button is clicked
    let button = document.createElement("button");
    button.textContent = "Edit";
    button.classList.add("editButton");
    button.addEventListener("click", function () {
      stopLoop();

      let actionTitle = document.querySelector("#actionTitle");
      actionTitle.innerHTML = "Edit " + movie.name;

      let addButton = document.querySelector("#addRowBtn");
      let saveChangesButton = document.querySelector("#saveChangesRowBtn");

      addButton.disabled = true;
      saveChangesButton.disabled = false;

      id = movie.id;

      document.querySelector("#movieRanking").value = movie.rankingPos;
      document.querySelector("#movieName").value = movie.name;
      document.querySelector("#movieRating").value = movie.rating;
      document.querySelector("#movieDownloads").value = movie.downloadsAmount;

      let addRowsBtn = document.querySelector("#addRowsBtn");
      addRowsBtn.disabled = true;
      let delBtn = document.querySelector("#delBtn");
      delBtn.disabled = true;
      disableOrEnableEditButtons();
    });

    return button;
  }

  function disableOrEnableEditButtons() {
    //this function disables all edit buttons
    let editButtons = document.querySelectorAll(".editButton");
    for (let i = 0; i < editButtons.length; i++) {
      editButtons[i].disabled = true;
    }
  }

  let saveChangesButton = document.querySelector("#saveChangesRowBtn");
  saveChangesButton.addEventListener("click", function () {

    event.preventDefault();

    let data = {
      "rankingPos": document.querySelector("#movieRanking").value,
      "name": document.querySelector("#movieName").value,
      "rating": document.querySelector("#movieRating").value,
      "downloadsAmount": document.querySelector("#movieDownloads").value,
    }

    editInfoServer(data, id);

    let addButton = document.querySelector("#addRowBtn");
    let editButton = document.querySelector("#saveChangesRowBtn");

    editButton.disabled = true;
    addButton.disabled = false;

    let actionTitle = document.querySelector("#actionTitle");
    actionTitle.innerHTML = "Add Movie";

    document.querySelector("#form").reset();

    disableOrEnableEditButtons();
    let addRowsBtn = document.querySelector("#addRowsBtn");
    addRowsBtn.disabled = false;
    let delBtn = document.querySelector("#delBtn");
    delBtn.disabled = false;

    startLoop();
  });

  function modifyDOM(movie) {
    //this functions creates a new row of elements in the table
    let row = document.createElement("tr");

    let nodeRanking = document.createElement("td");
    nodeRanking.textContent = movie.rankingPos;

    let nodeName = document.createElement("td");
    nodeName.textContent = movie.name;

    let nodeRating = document.createElement("td");
    nodeRating.textContent = movie.rating;

    let nodeDownloads = document.createElement("td");
    nodeDownloads.textContent = movie.downloadsAmount;

    let delButton = createDeleteButton(movie.id);
    delButton.classList.add("btn", "btn-info", "btn-sm", "col-sm-6");
    let editButton = createEditButton(movie);
    editButton.classList.add("btn", "btn-info", "btn-sm", "col-sm-6");

    let nodeOptions = document.createElement("td");

    nodeOptions.appendChild(delButton);
    nodeOptions.appendChild(editButton);

    row.appendChild(nodeRanking);
    row.appendChild(nodeName);
    row.appendChild(nodeRating);
    row.appendChild(nodeDownloads);
    row.appendChild(nodeOptions);

    if (movie.downloadsAmount >= 500000)
      row.classList.add("bg-warning");
    moviesTable.appendChild(row);
  }

  function showMovies(arrMovies) {
    //this function show the movies in the web page
    moviesTable.innerHTML = headMoviesTable; //recovering the head of the table
    for (let i = 0; i < arrMovies.length; i++) {
      modifyDOM(arrMovies[i]);
    }
  }

  let clearBtn = document.getElementById("clearBtn"); //this function clear the filter
  clearBtn.addEventListener("click", function () {
    showMovies(allMovies);
    startLoop();
  });

  let inputBtn = document.getElementById("sendBtn");
  inputBtn.addEventListener("click", filter);

  function filter() {
    //this function searches the table according to a data entered

    stopLoop();

    let value = document.getElementById("filterInput").value;
    moviesTable.innerHTML = headMoviesTable;
    for (let i = 0; i < allMovies.length; i++) {
      let name = allMovies[i].name;
      if (name.includes(value)) {
        modifyDOM(allMovies[i]);
      }
    }

  }

  function addThreeRows() {
    //this functions added a three new rows in the table
    stopLoop();

    for (let i = 0; i < extraMovies.length; i++) {
      sendInfoServer(extraMovies[i]);
    }

    startLoop();
  }

  //Setting the button that deletes all rows of the table
  let delBtn = document.querySelector("#delBtn");
  delBtn.addEventListener("click", function () {
    stopLoop();

    for (let i = 0; i < allMovies.length; i++) {
      deleteInfoServer(allMovies[i].id);
    }

    moviesTable.innerHTML = headMoviesTable; //recovering the head of the table
    allMovies = []; //restarting the arrMovies

    startLoop();
  });

  //Setting the button that add three rows in the table
  let addRowsBtn = document.querySelector("#addRowsBtn");
  addRowsBtn.addEventListener("click", addThreeRows);

  //Setting the button that add a single row
  let addRowBtn = document.querySelector("#addRowBtn"); //getting the button from the html
  addRowBtn.addEventListener("click", function () {
    stopLoop();

    event.preventDefault();

    let newMovie = {
      "rankingPos": document.querySelector("#movieRanking").value,
      "name": document.querySelector("#movieName").value,
      "rating": document.querySelector("#movieRating").value,
      "downloadsAmount": document.querySelector("#movieDownloads").value,
    };

    //if all the fields were completed correcly
    if (validMovieName(newMovie))
      if (validMovieRanking(newMovie))
        if (validMovieRating(newMovie))
          if (validMovieDownloads(newMovie)) {
            sendInfoServer(newMovie);
            document.querySelector("#form").reset();
          }

    startLoop();
  });

  //functions that validate each attribute of the movie
  function validMovieName(movie) {
    let name = movie.name;
    if (name === "") {
      alert("Please insert a movie name!");
      return false;
    }
    if (name.length < MIN_NAME_LENGHT || name.length > MAX_NAME_LENGHT) {
      alert(
        "The name lenght of the movie must be between" +
        MIN_NAME_LENGHT +
        " to " +
        MAX_NAME_LENGHT +
        "!"
      );
      return false;
    }
    return true;
  }

  function validMovieRating(movie) {
    let rating = movie.rating;
    if (rating === "") {
      alert("Please insert a rating value!");
      return false;
    }
    if (rating < MIN_STARTS_RATING || rating > MAX_STARTS_RATING) {
      alert(
        "The rating value must be between " +
        MIN_STARTS_RATING +
        " to " +
        MAX_STARTS_RATING +
        " stars!"
      );
      return false;
    }
    return true;
  }

  function validMovieRanking(movie) {
    let ranking = movie.rankingPos;
    if (ranking === "") {
      alert("Please insert a ranking value!");
      return false;
    }
    if (ranking < MIN_RANKING_POS || ranking > MAX_RANKING_POS) {
      alert(
        "The ranking value must be between " +
        MIN_RANKING_POS +
        " to " +
        MAX_RANKING_POS +
        "!"
      );
      return false;
    }
    return true;
  }


  function validMovieDownloads(movie) {
    let downloads = movie.downloadsAmount;
    if (downloads === "") {
      alert("Please insert a donwload value!");
      return false;
    }
    if (downloads < MIN_DOWNLOADS_AMOUNT || downloads > MAX_DOWNLOADS_AMOUNT) {
      alert(
        "The donwload value must be between " +
        MIN_DOWNLOADS_AMOUNT +
        " to " +
        MAX_DOWNLOADS_AMOUNT +
        "!"
      );
      return false;
    }
    return true;
  }


  //constant values used to validate a movie
  const MIN_NAME_LENGHT = 3;
  const MAX_NAME_LENGHT = 20;
  const MIN_STARTS_RATING = 0;
  const MAX_STARTS_RATING = 5;
  const MIN_RANKING_POS = 0;
  const MAX_RANKING_POS = 100;
  const MIN_DOWNLOADS_AMOUNT = 1;
  const MAX_DOWNLOADS_AMOUNT = 9999999;

  //END OF THE BEHAVIOR FOR THE TABLE OF allMovies.html-------------------------------------------------

  //BEGIN OF BEHAVIOR OF BUTTON UP----------------------------------------------------------------------

  let topBtn = document.querySelector("#topBtn"); //gettin the buttop up

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
      topBtn.style.display = "block"; //show button
    else
      topBtn.style.display = "none"; //hide button
  }

  // When the user clicks on the button, scroll to the top of the document
  topBtn.addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  //END OF THE BEHAVIOR OF BUTTOP UP--------------------------------------------------------------------

  let keepGoing = true;

  function myLoop() {
    //this fuction is a loop for auto update

    getInfoServer();

    if (keepGoing) {
      setTimeout(myLoop, 5000);
    }
  }

  function startLoop() {
    //this function start the loop
    keepGoing = true;
    myLoop();
  }

  function stopLoop() {
    //this function stop the loop
    keepGoing = false;
  }

  startLoop();


}


