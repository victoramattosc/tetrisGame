function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function toggleAudio() {
    var audio = document.getElementById("myAudio");
    var volumeIcon = document.getElementById("volume-icon");
  
    if (audio.paused) {
      audio.play();
      volumeIcon.className = "bi bi-volume-up-fill";
    } else {
      audio.pause();
      volumeIcon.className = "bi bi-volume-mute";
    }
  }
  
  // generate a new tetromino sequence
  // @see https://tetris.fandom.com/wiki/Random_Generator
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }
  
  // get the next tetromino in the sequence
  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }
  
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
  
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;
  
    return {
      name: name,      // name of the piece (L, O, etc.)
      matrix: matrix,  // the current rotation matrix
      row: row,        // current row (starts offscreen)
      col: col         // current col
    };
  }


  
  // rotate an NxN matrix 90deg
  // @see https://codereview.stackexchange.com/a/186834
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
  
    return result;
  }
  
  // check to see if the new matrix/row/col is valid
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            // collides with another piece
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }
  
    return true;
  }
  const score = document.querySelector(".score")
  var pont = 0;
  score.innerHTML = `Score:${pont}`

  // place the tetromino on the playfield
  function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
  
          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            return overGame();
          }
  
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }


    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0; ) {
      if (playfield[row].every(cell => !!cell)) {

        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r-1][c];
          }
        }
        pont += 10;
        score.innerHTML = `Score: ${pont}`
      }
      else {
        row--;
      }
    }

    tetromino = getNextTetromino();
  }

  var gameOver = false;
  var gameStart = false;

  function startGame(){
    gameStart = true;
      rAF = requestAnimationFrame(loop);

      const startGameButton = document.getElementById('gameStart');
      startGameButton.style.display = 'none';
  }

  // show the game over screen
  function overGame() {
    gameOver = true;
    cancelAnimationFrame(rAF);

    const gameOverText = document.getElementById('gameOver');
    gameOverText.style.display = 'block';
    
  }

  function restartGame() {
 // Reverta todas as alterações no jogo e redefina as variáveis

  // Reinicie as variáveis para os valores iniciais
  gameOver = false;
  pont = 0;

  // Limpe o campo de jogo
  for (let row = -2; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }

  // Reinicie a sequência de tetrominos
  tetrominoSequence.length = 0;

  // Oculte o texto de "Game Over"
  const gameOverText = document.getElementById('gameOver');
  gameOverText.style.display = 'none';

  // Reinicie o jogo chamando a função de inicialização do jogo novamente
  startGame();
  }


  
  
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];
  
  // keep track of what is in every cell of the game using a 2d array
  // tetris playfield is 10x20, with a few rows offscreen
  const playfield = [];
  
  // populate the empty state
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
  
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
  
  // how to draw each tetromino
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };
  
  // color of each tetromino
  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };
  
  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;  // keep track of the animation frame so we can cancel it


  
  // game loop
  function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
  
    // draw the playfield
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];
  
          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        }
      }
    }
  
    // draw the active tetromino
    if (tetromino) {
  
      // tetromino falls every 35 frames
      if (++count > 35) {
        tetromino.row++;
        count = 0;
  
        // place piece if it runs into anything
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
  
      context.fillStyle = colors[tetromino.name];
  
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
  
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }


  isPaused = false;

  function pauseGame() {
    if (!gameStart) {
      return; // Se o jogo não foi iniciado, sai da função sem fazer nada
    }
    if (gameOver){
      return; // Se perder o jogo sai da função sem fazer nada
    }
    
    var pauseIcon = document.getElementById("pause-icon");
    const gamePausedText = document.getElementById('gamePause');
  
    if (!isPaused) {
      cancelAnimationFrame(rAF);
      gamePausedText.style.display = 'block';
      pauseIcon.className = "bi bi-play-fill"; // Atualiza o ícone para o ícone de play
    } else {
      rAF = requestAnimationFrame(loop);
      gamePausedText.style.display = 'none'; // Oculta o texto "Game Paused!"
      pauseIcon.className = "bi bi-pause-fill"; // Atualiza o ícone para o ícone de pausa
      console.log('Jogo despausado!');
    }
  
    isPaused = !isPaused;
  }
  
  // listen to keyboard events to move the active tetromino and pause the game
  document.addEventListener('keydown', function (e) {
    if (gameOver) return;
  
    if (e.keyCode === 32) {
      e.preventDefault();
      pauseGame();
    }

      else{
  
    // left and right arrow keys (move)
    if (e.which === 37 || e.which === 39) {
      const col = e.which === 37
        ? tetromino.col - 1
        : tetromino.col + 1;
  
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
  
    // up arrow key (rotate)
    if (e.which === 38) {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }
  
    // down arrow key (drop)
    if(e.which === 40) {
      const row = tetromino.row + 1;
  
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
  
        placeTetromino();
        return;
      }
  
      tetromino.row = row;
    }
  }});



