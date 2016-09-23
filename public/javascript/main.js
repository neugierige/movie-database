(function(){

	// initializing variables that reference things in the HTML
	var textField = document.getElementById('text-field'),
			searchButton = document.getElementById('search-button'),
			showfavsButton = document.getElementById('show-favorites-button'),
			resultsList = document.getElementById('results-list'),
			movieTitle = document.getElementById('movie-title'),
			// addFavButton = document.getElementById('add-favorite-button'),
			movieDetailsList = document.getElementById('movie-details'),
			apiURLPrefix = 'https://www.omdbapi.com/?s=';

	var selectedMovie = {};

	// make sure buttons are found, if so 
	// add event listener, which will detect clicks from the user
	// and then perform the associated function
	if (searchButton, showfavsButton) {
		searchButton.addEventListener('click', doSearch);
		showfavsButton.addEventListener('click', getFavorites);	
		// addFavButton.addEventListener('click', addToFavorites);
	} else {
		console.log("button not found")
	}

	function doSearch(click_event) {
		// clears the results from previous search
		clearResultsList()
		searchFieldInput = textField.value;
		click_event.preventDefault();
		if (searchFieldInput === "") {
			// alert view that says "put enter a search term" 
		} else {
			fullRequestURL = apiURLPrefix + searchFieldInput
			apiRequest(fullRequestURL)
		}
	}

	function apiRequest(url) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.onreadystatechange = function() {
	        if (xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200) {
	           searchResults = JSON.parse(xmlHttpRequest.response)['Search'];
	          showResults(searchResults);
	        }
	    };
	    xmlHttpRequest.open("GET", url, true);
	    xmlHttpRequest.send();
	}

	function showResults(searchResults) {
		var elementForResult;
	    // if there are results at all...
	    if (searchResults) {

	    	// perform the following for each result
	      searchResults.forEach(function (movie) {
	      	elementForResult = document.createElement('li');

	        // adding the title to the list of results
	        elementForResult.innerHTML = movie['Title'] + " (" + movie['Year'] + ")";
	        elementForResult.setAttribute('class', 'results-list');
	        elementForResult.addEventListener('click', function() {
	        	getMovieDetails(movie);
	        });

	        // appending the html block to the results-list section
	        resultsList.appendChild(elementForResult);
	      });

	    // if there are no results
	    } else {
	      // NB: p is used here because it is styled differently than a li
	      elementForResult = document.createElement('p');
	      elementForResult.innerHTML = "Please try again";
	      resultsList.appendChild();
	    }
	}

	function getMovieDetails(movieObject) {
		// set properties on global object selectedMovie
		selectedMovie.title = movieObject.Title;
		selectedMovie.year = movieObject.Year;
		selectedMovie.imdbID = movieObject.imdbID;

		// display the title of the movie
		movieTitle.innerHTML = selectedMovie.title + ' (' + selectedMovie.year + ')';
		
		// clear previous result
		movieDetailsList.innerHTML = "";

		// TO DO: not displaying ALL movie data, but do another query with imbdID
		var xmlHttpRequest = new XMLHttpRequest;
		var fullURL = "http://www.omdbapi.com/?i=" + selectedMovie.imdbID + "&plot=short&r=json"

		xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200) {
          var jsonObject = JSON.parse(xmlHttpRequest.response);
          displayMovieDetails(jsonObject);
        }
    };
    xmlHttpRequest.open("GET", fullURL, true);
    xmlHttpRequest.send();
	}

	function displayMovieDetails(movieObject) {
		//create table row for each piece of data
		for (var key in movieObject) {
			// rows
			var movieDetailsRow = document.createElement('tr');
			movieDetailsList.appendChild(movieDetailsRow);
			// cells for key and value
			var movieDetailsKeyCell = document.createElement('td'),
				movieDetailsValueCell = document.createElement('td'),
				keyText = document.createTextNode(key),
				valueText = document.createTextNode(movieObject[key]);
			movieDetailsKeyCell.appendChild(keyText);
			movieDetailsValueCell.appendChild(valueText);
			movieDetailsRow.appendChild(movieDetailsKeyCell);
			movieDetailsRow.appendChild(movieDetailsValueCell);
		}
	}

	function addToFavorites(movieObject) {
		var xmlHttpRequest = new XMLHttpRequest

		xmlHttpRequest.onreadystatechange = function() {
	    	if (xmlHttpRequest.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
	        	var response = JSON.parse(xmlHttpRequest.responseText);
		        if (response.error == "duplicate") {
		          alert(title + " has already been added to your list of favorites!");
		        }
		    }
	    }

	    xmlHttpRequest.open("POST", '/favorites', true);
	    xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    var data = "&oid=" + movieObject.imdbID;
	    xmlHttpRequest.send(data);
	}


	function getFavorites() {
		var xmlHttpRequest = new XMLHttpRequest;
		xmlHttpRequest.onreadystatechange = function() {
	        if (xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200) {
	          var favoritedMovies = JSON.parse(xmlHttpRequest.response);
	          if (favoritedMovies) {
	          	console.log(favoritedMovies);
	          	showResults(favoritedMovies);	
	          } else {
	          	alert('Add some favorites!');
	          }
	          
	        }
	    };
	    xmlHttpRequest.open("GET", "/favorites", true);
	    xmlHttpRequest.send();
	}


	function clearResultsList() {
		resultsList.innerHTML = "";
	}

	// function showFavorites(favoritedMovies) {
	// 	if (favoritedMovies) {

	// 	}
	// }

	// function showResults(searchResults) {
	// 	var movieObject;
	//     // if there are results at all...
	//     if (searchResults) {

	//     	// perform the following for each result
	//       searchResults.forEach(function (movie) {
	//         movieObject = document.createElement('li');

	//         // adding the title to the list of results
	//         movieObject.innerHTML = movie['Title'] + " (" + movie['Year'] + ")";
	//         movieObject.setAttribute('class', 'results-list');
	//         movieObject.addEventListener('click', function() {
	//         	showMovieDetails(movie);
	//         });

	//         // appending the html block to the results-list section
	//         resultsList.appendChild(movieObject);

	//       });

	//     // if there are no results
	//     } else {
	//       // NB: p is used here because it is styled differently than a li
	//       movieObject = document.createElement('p');
	//       movieObject.innerHTML = "Please try again";
	//       resultsList.appendChild();
	//     }
	// }
















}());