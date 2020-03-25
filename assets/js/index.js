        const game = new Game({
            canvasId:"game"
        });
        // Game theme and game grid difined by quantity of images.
        game.setTheme(
            "./assets/images/humanmind/000-question.png",
            [
                "./assets/images/humanmind/001-idea.png",
                "./assets/images/humanmind/002-brain.png",
                "./assets/images/humanmind/003-problem.png",
                "./assets/images/humanmind/004-gear.png",
                "./assets/images/humanmind/005-guess.png",
                "./assets/images/humanmind/006-love.png",
                "./assets/images/humanmind/007-colour.png",
                "./assets/images/humanmind/008-approved.png",
                "./assets/images/humanmind/009-happy.png",
                "./assets/images/humanmind/010-worries.png",
                "./assets/images/humanmind/011-energy.png",
                "./assets/images/humanmind/012-share.png",
                "./assets/images/humanmind/013-observe.png",
                "./assets/images/humanmind/014-deny.png",
                "./assets/images/humanmind/015-sad.png",
                "./assets/images/humanmind/016-growth.png",
                "./assets/images/humanmind/007-thinking.png",
                "./assets/images/humanmind/008-read.png",
            ]
        );
        // player information / button functions
        game.onChangeName(function(newname){
            var nameElement = document.getElementById('player')
            nameElement.innerHTML = newname;
        });
        game.onChangeLevel(function(newlevel){
            var levelElement = document.getElementById('level')
            levelElement.innerHTML = "Level " + newlevel;
        });
        game.onChangeMovements(function(newmovement){
            var movementsElement = document.getElementById('movements')
            movementsElement.innerHTML = "Moves " + newmovement;
        });
        game.onGameOver(function(score){
            var gameElement = document.getElementById('game')
            var gameoptionsElement = document.getElementById('gameoptions')
            var gameoverElement = document.getElementById('gameover')
            var scoreElement = document.getElementById('score')
            gameElement.className = "d-none"
            gameoptionsElement.className = "d-block"
            gameoverElement.className = "memory-game d-block"
            scoreElement.innerHTML = "Score: " + score;
        });

        function restartGame(){
            var gameElement = document.getElementById('game')
            var gameoptionsElement = document.getElementById('gameoptions')
            var gameoverElement = document.getElementById('gameover')
            gameElement.className = "d-block"
            gameoptionsElement.className = "d-block"
            gameoverElement.className = "d-none"            
            game.restart();    
        };
        
        function startGame(){
            var gameoptionsElement = document.getElementById('gameoptions')
            var instructions = document.getElementById('instructions')
            var gameContainer = document.getElementById('gameContainer')
            var inputname = document.getElementById('inputname')
            var gameElement = document.getElementById('game')
            var gameoverElement = document.getElementById('gameover')
            gameElement.className = "d-block"
            gameoptionsElement.className = "d-block"
            instructions.className = "d-none"
            gameContainer.className = "d-block"
            gameoverElement.className = "d-none"
            game.setName(inputname.value);
            game.restart();
        };	
        
        function returnToMenu(){
            var gameoptionsElement = document.getElementById('gameoptions')
            var instructions = document.getElementById('instructions')
            var gameContainer = document.getElementById('gameContainer')
            gameoptionsElement.className = "d-none"
            instructions.className = "d-block"
            gameContainer.className = "d-none"
        };

        function givUp(){
            game.givUp();
        }