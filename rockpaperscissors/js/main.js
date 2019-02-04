$(()=>{

  const stats = {
    rockStats: {
      wins: 0,
      losses: 0,
      ties: 0,
      winThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      lossThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      tieThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      }
    },
    paperStats: {
      wins: 0,
      losses: 0,
      ties: 0,
      winThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      lossThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      tieThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      }
    },
    scissorsStats: {
      wins: 0,
      losses: 0,
      ties: 0,
      winThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      lossThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      },
      tieThen: {
        rock: 0,
        paper: 0,
        scissors: 0
      }
    },
    previousResult: null,
    resultText: 'basic result text',
    previousPlay: null,
    playerChoice: null,
    computerChoice: null,
  }

  const playRound = {
    animate(){
      $('#startPlayer').remove();
      $('#startComputer').remove();
      const $playerSpace = $('#playerSpace');
      const $image = $('<img/>').attr('src','images/player_fist.png');
      $playerSpace.append($image);
      const $computerSpace = $('#computerSpace');
      const $image2 = $('<img/>').attr('src','images/computer_fist.png');
      $computerSpace.append($image2);
      $image.attr('id','startPlayer');
      $image2.attr('id','startComputer');
      setTimeout(function(){
        $image.attr('src',stats.playerChoice);
        $image2.attr('src',stats.computerChoice);
      }, 1800);
    },
    logic(){
      if (stats.previousPlay === null) {
        //If this is the first game, the compute will make a random play.
        let choice = Math.floor(Math.random() * 3);
        if (choice === 0) {
          stats.computerChoice = 'images/computer_rock.png';
        } else if (choice === 1) {
          stats.computerChoice = 'images/computer_paper.png';
        } else {
          stats.computerChoice = 'images/computer_scissors.png';
        }
        return choice;
      }
      let likely = '';
      if (stats.previousPlay === 'rock') {
        if (stats.previousResult === 'win') {
          likely = Object.keys(stats.rockStats.winThen).reduce((a,b)=>stats.rockStats.winThen[a] > stats.rockStats.winThen[b] ? a : b);
        } else if (stats.previousResult === 'loss') {
          likely = Object.keys(stats.rockStats.lossThen).reduce((a,b)=>stats.rockStats.lossThen[a] > stats.rockStats.lossThen[b] ? a : b);
        } else {
          likely = Object.keys(stats.rockStats.tieThen).reduce((a,b)=>stats.rockStats.tieThen[a] > stats.rockStats.tieThen[b] ? a : b);
        }
      } else if (stats.previousPlay === 'paper') {
        if (stats.previousResult === 'win') {
          likely = Object.keys(stats.paperStats.winThen).reduce((a,b)=>stats.paperStats.winThen[a] > stats.paperStats.winThen[b] ? a : b);
        } else if (stats.previousResult === 'loss') {
          likely = Object.keys(stats.paperStats.lossThen).reduce((a,b)=>stats.paperStats.lossThen[a] > stats.paperStats.lossThen[b] ? a : b);
        } else {
          likely = Object.keys(stats.paperStats.tieThen).reduce((a,b)=>stats.paperStats.tieThen[a] > stats.paperStats.tieThen[b] ? a : b);
        }
      } else {
        if (stats.previousResult === 'win') {
          likely = Object.keys(stats.scissorsStats.winThen).reduce((a,b)=>stats.scissorsStats.winThen[a] > stats.scissorsStats.winThen[b] ? a : b);
        } else if (stats.previousResult === 'loss') {
          likely = Object.keys(stats.scissorsStats.lossThen).reduce((a,b)=>stats.scissorsStats.lossThen[a] > stats.scissorsStats.lossThen[b] ? a : b);
        } else {
          likely = Object.keys(stats.scissorsStats.tieThen).reduce((a,b)=>stats.scissorsStats.tieThen[a] > stats.scissorsStats.tieThen[b] ? a : b);
        }
      }
      //Based on the player's most-likely play in the next turn, return a value to beat the most-likely play. Also, update the stats.computerChoice value to show the correct image on screen.
      if (likely === 'rock') {
        stats.computerChoice = 'images/computer_paper.png';
        return 1;
      } else if (likely === 'paper') {
        stats.computerChoice = 'images/computer_scissors.png';
        return 2;
      } else {
        stats.computerChoice = 'images/computer_rock.png';
        return 0;
      }
    },
    compare(player, computer){
      //This method takes in the player input ("player"), and the computer input from the playRound.logic() method.  It compares them to determine a winner, and then passes the player input & result (in the form of 'win,' 'loss', or 'tie') to the playRound.keepRecord() method.
      let result = null;
      if (player === computer) {
        result = "tie";
        if (player === 0 ) {
          stats.rockStats.ties += 1;
        } else if (player === 1) {
          stats.paperStats.ties += 1;
        } else {
          stats.scissorsStats.ties += 1;
        }
      } else if (player === 0 && computer === 1) {
        stats.rockStats.losses += 1;
        result = 'loss';
      } else if (player === 0 && computer === 2) {
        stats.rockStats.wins += 1;
        result = 'win';
      } else if (player === 1 && computer === 0) {
        stats.paperStats.wins += 1;
        result = 'win';
      } else if (player === 1 && computer === 2) {
        stats.paperStats.losses += 1;
        result = 'loss';
      } else if (player === 2 && computer === 0) {
        stats.scissorsStats.losses += 1;
        result = 'loss';
      } else {
        stats.scissorsStats.wins += 1;
        result = 'win';
      }
      if (result === 'tie') {
        stats.resultText = 'You Tied!';
      } else if (result === 'win') {
        stats.resultText = 'You Won!';
      } else {
        stats.resultText = 'You Lost!';
      }
      $('#result').remove();
      const $resultText = $('</p>').text(stats.resultText).attr('id','result');
      console.log($resultText,'result');
      $('#resultsModal').prepend($resultText);
      this.keepRecord(player, result);
    },
    keepRecord(player, result){
      //The 'play' variable will be stored in stats.previousPlay and used to track player tendencies
      let play = null;
      if (player === 0) {
        play = 'rock';
      } else if (player === 1) {
        play = 'paper';
      } else {
        play = 'scissors';
      }
      //If this is the first turn, there will be no previous result, so record the result of the first turn, then return out of the method.
      if (stats.previousResult === null) {
        stats.previousResult = result;
        stats.previousPlay = play;
        return;
      }
      //The app is going to base its logic off of what has just happened in the game (player W,L,T) as well as the last thing a player threw against the computer.
      //First, separate what the user played previously
      //Then, separate whether or not the player just won, lost, or tied
      //Then, record what they just played in order to learn the player's tendencies.
      if (stats.previousPlay === 'rock') {
        if (stats.previousResult === 'win') {
          if (play === 'rock') {
            stats.rockStats.winThen.rock += 1;
          } else if (play === 'paper') {
            stats.rockStats.winThen.paper += 1;
          } else {
            stats.rockStats.winThen.scissors += 1;
          }
        } else if (stats.previousResult === 'loss') {
          if (play === 'rock') {
            stats.rockStats.lossThen.rock += 1;
          } else if (play === 'paper') {
            stats.rockStats.lossThen.paper += 1;
          } else {
            stats.rockStats.lossThen.scissors += 1;
          }
        } else {
          if (play === 'rock') {
            stats.rockStats.tieThen.rock += 1;
          } else if (play === 'paper') {
            stats.rockStats.tieThen.paper += 1;
          } else {
            stats.rockStats.tieThen.scissors += 1;
          }
        }
      } else if (stats.previousPlay === 'paper') {
        if (stats.previousResult === 'win') {
          if (play === 'rock') {
            stats.paperStats.winThen.rock += 1;
          } else if (play === 'paper') {
            stats.paperStats.winThen.paper += 1;
          } else {
            stats.paperStats.winThen.scissors += 1;
          }
        } else if (stats.previousResult === 'loss') {
          if (play === 'rock') {
            stats.paperStats.lossThen.rock += 1;
          } else if (play === 'paper') {
            stats.paperStats.lossThen.paper += 1;
          } else {
            stats.paperStats.lossThen.scissors += 1;
          }
        } else {
          if (play === 'rock') {
            stats.paperStats.tieThen.rock += 1;
          } else if (play === 'paper') {
            stats.paperStats.tieThen.paper += 1;
          } else {
            stats.paperStats.tieThen.scissors += 1;
          }
        }
      } else {
        if (stats.previousResult === 'win') {
          if (play === 'rock') {
            stats.scissorsStats.winThen.rock += 1;
          } else if (play === 'paper') {
            stats.scissorsStats.winThen.paper += 1;
          } else {
            stats.scissorsStats.winThen.scissors += 1;
          }
        } else if (stats.previousResult === 'loss') {
          if (play === 'rock') {
            stats.scissorsStats.lossThen.rock += 1;
          } else if (play === 'paper') {
            stats.scissorsStats.lossThen.paper += 1;
          } else {
            stats.scissorsStats.lossThen.scissors += 1;
          }
        } else {
          if (play === 'rock') {
            stats.scissorsStats.tieThen.rock += 1;
          } else if (play === 'paper') {
            stats.scissorsStats.tieThen.paper += 1;
          } else {
            stats.scissorsStats.tieThen.scissors += 1;
          }
        }
      }
      stats.previousResult = result;
      stats.previousPlay = play;
    },
    renderStats(){
      $('#rockWins').text(stats.rockStats.wins);
      $('#paperWins').text(stats.paperStats.wins);
      $('#scissorsWins').text(stats.scissorsStats.wins);

      $('#rockLosses').text(stats.rockStats.losses);
      $('#paperLosses').text(stats.paperStats.losses);
      $('#scissorsLosses').text(stats.scissorsStats.losses);

      $('#rockTies').text(stats.rockStats.ties);
      $('#paperTies').text(stats.paperStats.ties);
      $('#scissorsTies').text(stats.scissorsStats.ties);

      $('#rockWinRock').text(stats.rockStats.winThen.rock);
      $('#rockLossRock').text(stats.rockStats.lossThen.rock);
      $('#rockTieRock').text(stats.rockStats.tieThen.rock);

      $('#rockWinPaper').text(stats.rockStats.winThen.paper);
      $('#rockLossPaper').text(stats.rockStats.lossThen.paper);
      $('#rockTiePaper').text(stats.rockStats.tieThen.paper);

      $('#rockWinScissors').text(stats.rockStats.winThen.scissors);
      $('#rockLossScissors').text(stats.rockStats.lossThen.scissors);
      $('#rockTieScissors').text(stats.rockStats.tieThen.scissors);

      $('#paperWinRock').text(stats.paperStats.winThen.rock);
      $('#paperLossRock').text(stats.paperStats.lossThen.rock);
      $('#paperTieRock').text(stats.paperStats.tieThen.rock);

      $('#paperWinPaper').text(stats.paperStats.winThen.paper);
      $('#paperLossPaper').text(stats.paperStats.lossThen.paper);
      $('#paperTiePaper').text(stats.paperStats.tieThen.paper);

      $('#paperWinScissors').text(stats.paperStats.winThen.scissors);
      $('#paperLossScissors').text(stats.paperStats.lossThen.scissors);
      $('#paperTieScissors').text(stats.paperStats.tieThen.scissors);

      $('#scissorsWinRock').text(stats.scissorsStats.winThen.rock);
      $('#scissorsLossRock').text(stats.scissorsStats.lossThen.rock);
      $('#scissorsTieRock').text(stats.scissorsStats.tieThen.rock);

      $('#scissorsWinPaper').text(stats.scissorsStats.winThen.paper);
      $('#scissorsLossPaper').text(stats.scissorsStats.lossThen.paper);
      $('#scissorsTiePaper').text(stats.scissorsStats.tieThen.paper);

      $('#scissorsWinScissors').text(stats.scissorsStats.winThen.scissors);
      $('#scissorsLossScissors').text(stats.scissorsStats.lossThen.scissors);
      $('#scissorsTieScissors').text(stats.scissorsStats.tieThen.scissors);
    }
  }

  const $rockButton = $('#rock');
  $rockButton.on('click', function(){
    $rockButton.attr('id','startButton');
    stats.playerChoice = 'images/player_rock.png';
    playRound.animate();
    playRound.compare(0, playRound.logic());
    playRound.renderStats();
    setTimeout(function(){
      $rockButton.removeAttr('id');
    }, 1800);
    setTimeout(function(){
      $('#resultsModal').css('display','block');
    }, 2800);
  })

  const $paperButton = $('#paper');
  $paperButton.on('click', function(){
    $paperButton.attr('id','startButton');
    stats.playerChoice = 'images/player_paper.png';
    playRound.animate();
    playRound.compare(1, playRound.logic());
    playRound.renderStats();
    setTimeout(function(){
      $paperButton.removeAttr('id');
    }, 1800);
    setTimeout(function(){
      $('#resultsModal').css('display','block');
    }, 2800);
  });

  const $scissorsButton = $('#scissors');
  $scissorsButton.on('click', function(){
    $scissorsButton.attr('id','startButton');
    stats.playerChoice = 'images/player_scissors.png';
    playRound.animate();
    playRound.compare(2, playRound.logic());
    playRound.renderStats();
    setTimeout(function(){
      $scissorsButton.removeAttr('id');
    }, 1800);
    setTimeout(function(){
      $('#resultsModal').css('display','block');
    }, 2800);
  });

  const $statButton = $('#statButton');
  $statButton.on('click', function(){
    $('#statModal').css('display','block');
  })

  const $closeStats = $('#closeStats');
  $closeStats.on('click', function(){
    $('.Modal').css('display','none');
  })

  const $closeResults = $('#closeResults');
  $closeResults.on('click', function(){
    $('#resultsModal').css('display','none');
  })

})
