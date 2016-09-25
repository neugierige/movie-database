(function(){

// initializing variables that reference elements in the HTML
	var textField = document.getElementById('text-field'),
			searchButton = document.getElementById('search-button'),
			showfavsButton = document.getElementById('show-favorites-button'),
			leftHeader = document.getElementById('left-header'),
			resultsList = document.getElementById('results-list'),
			rightDiv = document.getElementsByClassName('right');
			movieTitle = document.getElementById('movie-title'),
			movieDetailsList = document.getElementById('movie-details'),
			apiURLPrefix = 'https://www.omdbapi.com/?s=';

	// a global variable for the movie that was most recently selected by user
	var selectedMovie = {};
	// a global variable to track if the selected movie is in the favorites list
	var isFavorited = false;
	var searchResults = [];

	// add event listeners that detect clicks from the user
	// and then perform the associated function
	searchButton.addEventListener('click', doSearch);
	showfavsButton.addEventListener('click', getFavorites);	

	// GENERIC function that handles GET requests
	function apiRequest(url, genericFn, parameter) {
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.onreadystatechange = function() {
	      if (xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200) {
	        var results;
	        if (parameter) {
	        	results = JSON.parse(xmlHttpRequest.response)[parameter];	
	        	if (parameter == 'Search') {
	        		leftHeader.innerHTML = 'Search Results';
	        		isFavorited = false;
	        	} else {
	        		leftHeader.innerHTML = 'Favorites';
	        		isFavorited = true;
	        	}
	        } else {
	        	results = JSON.parse(xmlHttpRequest.response);
	        }
	        genericFn(results);
	      }
	    };
	    xmlHttpRequest.open("GET", url, true);
	    xmlHttpRequest.send();
	}

	// GENERIC function that displays results in the left-side div
	function showResults(results) {
		clearResultsList();

    // if there are results at all...
    if (results) {
    	searchResults = results
			var elementForResult;
    	
    	// perform the following for each result
      results.forEach(function (movie) {
      	console.log('my movie is ' + movie['Title']);
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
      // elementForResult = document.createElement('p');
      // elementForResult.innerHTML = "Please try again.";
      // resultsList.appendChild(elementForResult);
    }
	}



	// gets & validates user's input, calls function to make http request
	function doSearch(clickEvent) {
		// clears the results from previous search
		clearResultsList()

		// cancels the event if it is cancelable
		clickEvent.preventDefault();
		
		searchFieldInput = textField.value;
		if (searchFieldInput === '') {
			alert('Please enter a search term!');
		} else {
			var fullRequestURL = apiURLPrefix + searchFieldInput
			apiRequest(fullRequestURL, showResults, 'Search')
		}
	}

	function checkFavorited(movieObject) {
		searchResults.forEach(function (movie) {
			if (movieObject.imdbID == movie['imdbID']) {
				return true;
			}
			return false; 
		});
	}

	// gets full details on a movie based on its unique imdbID
	function getMovieDetails(movieObject) {

		// set properties on global object selectedMovie
		selectedMovie.title = movieObject.Title;
		selectedMovie.year = movieObject.Year;
		selectedMovie.imdbID = movieObject.imdbID;

		// update the display
		movieTitle.innerHTML = selectedMovie.title + ' (' + selectedMovie.year + ')';
		movieDetailsList.innerHTML = "";

		// maybe create the favorite button??
		if (checkFavorited(movieObject) === false) {
			var addFavButton = document.createElement('button');
			addFavButton.appendChild(document.createTextNode('Save to Favorites'));
			addFavButton.addEventListener('click', function() {
				addToFavorites();
			});
			movieDetailsList.appendChild(addFavButton);
		} else {
			console.log('NOT adding the favorite button');
		}
		
		var fullURL = "https://www.omdbapi.com/?i=" + selectedMovie.imdbID + "&plot=short&r=json";
		apiRequest(fullURL, displayMovieDetails, null);
    
	}



	function displayMovieDetails(movieObject) {
		//create table row for each piece of data
		for (var key in movieObject) {
			
			// create and append row and cell elements 
			var movieDetailsRow = document.createElement('tr');
			movieDetailsList.appendChild(movieDetailsRow);
			var movieDetailsKeyCell = document.createElement('td'),
				movieDetailsValueCell = document.createElement('td'),
				keyText = document.createTextNode(key),
				valueText = document.createTextNode(movieObject[key]);

			// append the keys and values to the cells, but handle poster images differently
			movieDetailsKeyCell.appendChild(keyText);	
			if (key === 'Poster' && movieObject['Poster'] != 'N/A') {
				var moviePoster = document.createElement('img');
				moviePoster.setAttribute('src', movieObject['Poster']);
				moviePoster.setAttribute('width', '50%');
				movieDetailsValueCell.appendChild(moviePoster);
			} else {
				movieDetailsValueCell.appendChild(valueText);
			}

			// append the cells to the row
			movieDetailsRow.appendChild(movieDetailsKeyCell);
			movieDetailsRow.appendChild(movieDetailsValueCell);			
		}
	}

	function addToFavorites() {
		var xmlHttpRequest = new XMLHttpRequest;
    xmlHttpRequest.open('POST', '/favorites', true);
    xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data = "Title=" + selectedMovie.title + "&Year=" + selectedMovie.year + "&imdbID=" + selectedMovie.imdbID;
    xmlHttpRequest.send(data);
    alert(selectedMovie.title + ' has been added to favorites');
	}

	function getFavorites() {
		var url = '/favorites'
		apiRequest(url, showResults, 'favorites')
	}

	function clearResultsList() {
		resultsList.innerHTML = "";
	}















}());