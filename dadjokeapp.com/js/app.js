const app               = angular.module('DadJokes', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  // Controls whether a user will see the login form or user list in the hamburger menu
  this.showLoginForm = true;
  // Controls whether a user will see the login error message
  this.loginFail = false;
  this.userLoggedIn = false;
  // Controles whether a user will see a message that their username is invalid
  this.invalidUsername = false;
  // Indicates whether a user will see their own or another user's created/favorite jokes in the user display modal
  this.targetMatchesLogged = false;
  this.internalCount = 0;
  this.externalCount = 0;
  this.currentJoke = {};
  this.loggedUser = {};
  this.allUsers = [];
  this.targetUser = {};


  // USER METHODS
  // Check an attempted username against the usernames of the current users
  this.checkUniqueUser = function(username){
    for (let i = 0; i < this.allUsers.length; i++) {
      if (username === this.allUsers[i].username) {
        this.invalidUsername = true;
        return false;
      }
    }
    return true;
  };

  // Check an attempted password to make sure it matches the password criteria
  this.checkPassword = function(password) {
    // The password must be at least 8 characters
    if (this.newUser.password.length > 7) {
      this.validPassword.min = true;
      this.validPassword.criteria++;
    }
    // The password can be at most 20 characters
    if (this.newUser.password.length < 21) {
      this.validPassword.max = true;
      this.validPassword.criteria++;
    }
    for (let i = 0; i < password.length; i++) {
      // The password must have at least one digit
      if (!this.validPassword.digit) {
        if (password.charCodeAt(i) > 47 && password.charCodeAt(i) < 58) {
          this.validPassword.digit = true;
          this.validPassword.criteria++;
        }
      }
      // The password must have at least one capital letter
      if (!this.validPassword.capital) {
        if (password.charCodeAt(i) > 64 && password.charCodeAt(i) < 91) {
          this.validPassword.capital = true;
          this.validPassword.criteria++;
        }
      }
      // The password may not contain spaces
      if (password.charCodeAt(i) === 32) {
          this.validPassword.spaces = false;
          this.validPassword.criteria--;
      }
    }
    // Update this.passwordFail to indicate "true" for the criteria the password fails
    this.passwordFail.min = !this.validPassword.min
    this.passwordFail.max = !this.validPassword.max
    this.passwordFail.digit = !this.validPassword.digit
    this.passwordFail.spaces = !this.validPassword.spaces
    this.passwordFail.capital = !this.validPassword.capital
    if (this.validPassword.criteria === 5) {
      return true;
    }
    return false;
  };

  // Create a user
  this.createUser = function(){
    if (this.checkPassword(this.newUser.password) === true && this.newUser.password === this.newUser.password2 && this.checkUniqueUser(this.newUser.username) === true) {

      $('#createUserModal').modal('hide');
      this.invalidUsername = false;
      this.validPassword = {
        min: false,
        max: false,
        digit: false,
        capital: false,
        spaces: true,
        criteria: 1
      };
      this.passwordFail = {
        min: false,
        max: false,
        digit: false,
        capital: false,
        spaces: false
      };
      $http({
        method: 'POST',
        url: '/session',
        data: this.newUser
      }).then(function(response){
        controller.newUser = {};
        controller.loggedUser = response.data;
        controller.userLoggedIn = response.data.logged;
        controller.getAllUsers();
      }, function(error){
        console.log(error, 'error from this.createUser');
      })
    } else {
      this.checkUniqueUser(this.newUser.username);
    }
  };

  // Get all users
  this.getAllUsers = function(){
    $http({
      method: 'GET',
      url: 'session'
    }).then(function(response){
      controller.allUsers = response.data;
    }, function(error){
      console.log(error, 'error from this.getAllUsers');
    })
  };

  // Delete a user
  this.deleteUser = function(id){
    $http({
      method: 'DELETE',
      url: 'session/' + id
    }).then(function(response){
      controller.getAllUsers();
    }, function(error){
      console.log(error, 'error from this.deleteUser');
    })
  };

  // Log in a user
  this.login = function(){
    this.showLoginForm = false;
    $http({
      method: 'POST',
      url: 'session/login',
      data: this.loginInfo,
    }).then(function(response){
      if (response.status === 200) {
        controller.closeHamburger();
        controller.loginInfo = {};
        controller.userLoggedIn = response.data.logged;
        controller.loggedUser = response.data;
      }
    }, function(error){
      // 401 - incorrect password
      // 404 - user not found
      controller.loginFail = true;
    })
  };

  // Logout a user
  this.logout = function(){
    $http({
      method: 'GET',
      url: 'session/logout',
    }).then(function(response){
      controller.userLoggedIn = false;
    }, function(error){
      console.log(error, 'error from this.logout');
    })
  };

  // Criteria necessary for a valid password
  this.validPassword = {
    min: false,
    max: false,
    digit: false,
    capital: false,
    spaces: true,
    criteria: 1
  };
  // Criteria failed by an attempted password
  this.passwordFail = {
    min: false,
    max: false,
    digit: false,
    capital: false,
    spaces: false
  };

  //Get a specific user (UNUSED)
  this.getUser = function(id){
    $http({
      method: 'GET',
      url: 'session/' + id
    }).then(function(response){
      console.log(response.data, 'response from this.getUser');
    }, function(error){
      console.log(error, 'error from this.getUser')
    })
  };


  // JOKE METHODS
  // Get a random joke from my API
  this.getRandomInternal = function(){
    $http({
      method: 'GET',
      url: '/jokes/random'
    }).then(function(response){
      // Set the current joke as the response
      controller.currentJoke = response.data;
      // The api_id key of a joke is used for a common id system to put on a joke before getting a Mongo ID on the backend.
      controller.currentJoke.api_id = response.data.id;
      // As a default, set the "favorite" toggle to false
      $('.toggle').prop("checked",false);
      if (controller.userLoggedIn) {
      // If a user is logged in, check the current joke against their favorites to determine whether the toggle needs to be switched
      $('.toggle').prop('checked', controller.checkJokeAgainstUsersFavorites(controller.currentJoke.api_id));
      }
    }, function(error){
      console.log(error, 'error from this.getRandomJoke');
    })
  };

  // Get a count of all the jokes in my API
  this.getInternalCount = function(){
    $http({
      method: 'GET',
      url: 'jokes/count'
    }).then(function(response){
      controller.internalCount = parseInt(response.data);
    }, function(error){
      console.log(error, 'error from this.getInternalCount');
    })
  }

  // Get a random joke from the dad joke API
  this.getRandomExternal = function(){
    $http({
      method: 'GET',
      url: 'https://icanhazdadjoke.com/',
      headers: { 'Accept':'application/json'}
    }).then(function(response){
      controller.currentJoke = response.data;
      // the api_id key of a joke is used for a common id system to put on a joke before getting a Mongo ID on the backend.
      controller.currentJoke.api_id = response.data.id;
      if (controller.userLoggedIn) {
      // If a user is logged in, check the current joke against their favorites to determine whether the toggle needs to be switched
      $('.toggle').prop('checked', controller.checkJokeAgainstUsersFavorites(controller.currentJoke.api_id));
      }
    }, function(error){
      console.log(error, 'error from this.getRandomExternal')
    })
  };

  // Get a count of all the jokes in the dad jokes API
  this.getExternalCount = function(){
    $http({
      method: 'GET',
      url: 'https://icanhazdadjoke.com/search',
      headers: {'Accept':'application/json'}
    }).then(
      function(response){
        controller.externalCount = response.data.total_jokes;
      }, function (error){
        console.log(error);
      })
  };

  // Get a random joke from one of the two APIs
  this.getRandomJoke = function(){
    // If the user is logged in, get a random joke
    if (this.userLoggedIn) {
      this.closeHamburger();
      // Generate a random value from 0 - 1
      // If the value is less than or equal to the ratio of the internal count to the total count (internal + external), get a random internal joke
      // Else, get an external joke
      if (Math.random() <= ( (this.internalCount) / (this.internalCount + this.externalCount) ) ) {
        this.getRandomInternal();
      } else {
        this.getRandomExternal();
      }
    } else {
      // If the user is not logged in, prompt them to log in
      this.openHamburger();
    }
  };

  // Create a joke
  this.createJoke = function(){
    $http({
      method: 'POST',
      url: '/jokes/' + this.loggedUser._id,
      data: {
        joke: this.createJokeText,
        api_id: this.generateRandomKey(),
        username: this.loggedUser.username
      }
    }).then(
      function(response){
        // Reset the joke text to empty the "create joke" form
        controller.createJokeText = '';
        // Update the current user to include their newly-created joke
        controller.loggedUser = response.data;
        controller.loggedUser.logged = true;
        // Since the current user will be the displayed user, update the target user
        controller.targetUser = response.data;
      }, function(error){
        console.log(error, 'error from this.createJoke');
      }
    )
  };

  this.editJoke = function(){
    $http({
      method: 'PUT',
      url: '/jokes/' + this.jokeToEdit._id,
      data: this.jokeToEdit
    }).then(function(response){
      // Reset the jokeToEdit object
      controller.jokeToEdit = {};
      controller.getAllUsers();
      //Update the loggedUser based on the response
      controller.loggedUser = response.data;
      controller.loggedUser.logged = true;
      // Since the targetUser is the only one that will be displayed when editing a joke, update the targetUser to match the response
      controller.targetUser = response.data;
    }, function(error){
      console.log(error, 'error from this.editJoke');
    })
  };

  // Delete a joke
  this.deleteJoke = function(id){
    $http({
      method: 'DELETE',
      url: '/jokes/' + id
    }).then(function(response){
      controller.loggedUser = response.data,
      controller.loggedUser.logged = true;
      controller.targetUser = controller.loggedUser;
    }, function(error){
      console.log(error, 'error from this.deleteJoke');
    })
  };

  // This function will either favorite or unfavorite a joke, based on whether or not it exists in the user's favorite jokes
  this.favorite = function(joke){
    // Since this method receives the joke object that could be passed in either from a user's display modal or from a joke currently displayed on the main screen, this.targetJoke is defined here (it doesn't have a key in the controller) and will be used in both
    this.targetJoke = joke
    if (!this.loggedUser.logged) {
      // If the user is not logged in, prompt the user to log in
      this.openHamburger();
    } else {
      // If the joke is not in the array, pass the joke id into the addJokeToFavorites method
      // Else, pass the joke id into the removeJokeFromFavorites method
      if (this.checkJokeAgainstUsersFavorites(this.targetJoke.api_id)) {
        this.removeJokeFromFavorites();
      } else {
        this.addJokeToFavorites();
      }
    }
  };

  // Add a joke to a user's favorite jokes array
  this.addJokeToFavorites = function(){
    // Push the joke into their favorite jokes array, then update the user
    this.loggedUser.favoriteJokes.push(this.targetJoke);
    $http({
      url: 'session/edit/' + this.loggedUser._id,
      method: 'PUT',
      data: this.loggedUser
    }).then(function(response){
      controller.getAllUsers();
      controller.loggedUser = response.data;
      controller.loggedUser.logged = true;
    }, function(error){
      console.log(error, 'error from this.addJokeToFavorites');
    })
  };

  // Remove a joke from a user's favorite jokes array
  this.removeJokeFromFavorites = function(){

    for (let i = 0; i < this.loggedUser.favoriteJokes.length; i++) {
      if (this.targetJoke.api_id === this.loggedUser.favoriteJokes[i].api_id) {
        this.loggedUser.favoriteJokes.splice(i,1);
        this.targetUser.favoriteJokes.splice(i,1);
        i--;
      }
    };
      $http({
        url: 'session/edit/' + this.loggedUser._id,
        method: 'PUT',
        data: this.loggedUser
      }).then(function(response){
        controller.getAllUsers();
        controller.loggedUser = response.data;
        controller.loggedUser.logged = true;
      }, function(error){
        console.log(error, 'error from trying to remove joke from user favorites')
      });
  };

  // Check a joke's id against the jokes in the logged user's favorite jokes array
  this.checkJokeAgainstUsersFavorites = function(id){
    // The provided joke id will be checked against all jokes in the current user's favorite jokes.  If the id matches the id of a joke in the user's favorites, the method will return 'true,' otherwise, it will return 'false'
    for (let i = 0; i < this.loggedUser.favoriteJokes.length; i++) {
      if (id === this.loggedUser.favoriteJokes[i].api_id) {
        return true;
      }
    }
    return false;
  };

  // Generate a random, 11-digit key to assign when a user creates a joke
  this.generateRandomKey = function(){
    let string = '';
    while (string.length < 11) {
      let number = Math.floor(Math.random() * 75 + 48);
      if ( !(57 < number && number < 65) && !(90 < number && number < 97) ) {
        string += String.fromCharCode(number);
      }
    }
    return string;
  };

  // Get a particular joke (UNUSED)
  this.getJoke = function(id){
    $http({
      method: 'GET',
      url: '/jokes/' + id
    }).then(function(response){
      console.log(response.data, 'response from this.getJoke');
    }, function(error){
      console.log(error, 'error from this.getJoke');
    })
  };

  //Search API for dad jokes based on search term (UNUSED)
  this.searchJokes = function(word){
    $http({
      method: 'GET',
      url: 'https://icanhazdadjoke.com/search?term=' + word,
      headers: { 'Accept':'application/json'}
    }).then(function(response){
      console.log(response.data, 'response from this.searchJokes');
    }, function(error){
      console.log(error, 'error from this.searchJokes');
    })
  };

  // Get all jokes from my API (UNUSED)
  this.getAllJokes = function(){
    $http({
      method: 'GET',
      url: '/jokes'
    }).then(
      function(response){
        console.log(response.data, 'response from this.getAllJokes');
      }, function(error){
        console.log(error, 'error from this.getAllJokes');
      })
  };


  // DISPLAY METHODS
  // Close the hamburger toggle
  this.closeHamburger = function(){
    const hamburger = $('#hamburger');
    if (hamburger.attr('aria-expanded') === 'true') {
      hamburger.click();
    }
  };

  // Expand the hamburger toggle
  this.openHamburger = function(){
    const hamburger = $('#hamburger');
    if (hamburger.attr('aria-expanded') === 'false') {
      hamburger.click();
    }
  };

  // Display a user on a modal
  this.displayUser = function(user) {
    this.closeHamburger();
    // If the user id of the targeUser matches the loggedUser, the modal will display differently by using the this.targetMatchesLogged boolean
    if (user._id === this.loggedUser._id) {
      this.targetMatchesLogged = true;
    } else {
      this.targetMatchesLogged = false;
    }
    this.targetUser = user;
    // The 0.25 second wait is to let the modal start to render
    setTimeout(()=>{
      // Go through each joke in the targetUser's favorite jokes
      for (let i = 0; i < this.targetUser.favoriteJokes.length; i++) {
        // Check the targetUser's favorite jokes to see if they exist in the loggedUser's favorite jokes also - use the truthiness to update the toggle under the favorite joke
        $('#' + this.targetUser.favoriteJokes[i].api_id).prop('checked', this.checkJokeAgainstUsersFavorites(this.targetUser.favoriteJokes[i].api_id))
      }
      // Go through each joke in the targetUser's created jokes
      for (let i = 0; i < this.targetUser.createdJokes.length; i++) {
        // Check the targetUser's created jokes to see if they exist in the loggedUser's favorite jokes - use the truthiness to update the toggle under the created joke
        $('#' + this.targetUser.createdJokes[i].api_id).prop('checked', this.checkJokeAgainstUsersFavorites(this.targetUser.createdJokes[i].api_id))
      }
    }, 250);

  };

  this.getRandomExternal();
  this.getAllUsers();
  this.getInternalCount();
  this.getExternalCount();
}]);
