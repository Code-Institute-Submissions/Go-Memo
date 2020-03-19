(function(){
    this.Game = function(){
        var unprops = {
            name: undefined,
            canvas: undefined,
            ctx: undefined,
            wTile:0,
            hTile:0,
            matches:0,
            vector:[],
            selectedTiles:{},
            selectedMatches:{},
            block:false,
            hidden: undefined,
            images: [],
            ready: false,
            grid: undefined,
            maxGrid: undefined,
            levelGrid: 2,
            score: 0,
            movements: 0,
            gameover: false,
            onChangename: () => {},
            onChanelevel: () => {},
            onChangemovements: () => {},
            onGameover: () => {},
        }
        var defaults = {
            canvasId: undefined,
            tilePadding: 10,
            timeoutCleaner: 1000,
            level: 1,
            maxSizeCanvas: 500,
        }
        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendDefaults(defaults, arguments[0]);
            this.options = extendDefaults(this.options, unprops);
        }
        //inicializer canvas
        this.options.canvas = document.getElementById(this.options.canvasId)
        this.options.ctx = this.options.canvas.getContext('2d')

        window.addEventListener("resize", () => resize.call(this));
        resize.call(this)

        //init
        reset.call(this)
        //events
        events.call(this)
    }

    //public functions
    Game.prototype.setName = function(name){
        this.options.name = name;
        this.options.onChangename(this.options.name)
        console.log(this.options)
    }

    Game.prototype.onChangename = function(callback){
        this.options.onChangename = callback;
    }

    Game.prototype.onGameover = function(callback){
        this.options.onGameover = callback;
    }

    Game.prototype.onChangemovements = function(callback){
        this.options.onChangemovements = callback;
        this.options.onChangemovements(this.options.movements)
    }

    Game.prototype.onChangelevel = function(callback){
        this.options.onChangelevel = callback;
        this.options.onChangelevel(this.options.level)
    }

    Game.prototype.setTheme = function(hiddenSrc, imagesSrc){
        const totalAssets = imagesSrc.length + 1;
        var assetHidden = new Image();
        assetHidden.src = hiddenSrc;
        imagesSrc.forEach((value, key) => {
            var assetImage = new Image();
            assetImage.src = value;
            assetImage.onload = (e) => {
                this.options.images.push(e.path[0])
                start.call(this, totalAssets)
            }
        })
        assetHidden.onload = (e) => {
            this.options.hidden = e.path[0]
            start.call(this, totalAssets)
        }
    }

    Game.prototype.restart = function(){
        this.options.level = 1;
        this.options.levelGrid = 2;
        this.options.movements = 0;
        this.options.gameover = false;
        reset.call(this)
        render.call(this)
        this.options.onChangemovements(this.options.movements)
        this.options.onChangelevel(this.options.level)
    }

    function start(totalAssets){
        if(totalAssets == this.options.images.length + 1){
            reset.call(this)
            render.call(this)
        }
    }

    //private functions

    function resize(){
        const margin = 20;
        var maxsize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
        maxsize -= margin*2;
        this.options.canvas.width = maxsize > this.options.maxSizeCanvas ? this.options.maxSizeCanvas : maxsize;
        this.options.canvas.height = maxsize > this.options.maxSizeCanvas ? this.options.maxSizeCanvas : maxsize;
        this.options.wTile = this.options.canvas.width / this.options.grid
        this.options.hTile = this.options.canvas.height / this.options.grid
        render.call(this)
    }

    function reset(){
        const sqrt = Math.floor(Math.sqrt(this.options.images.length * 2))
        const maxGrid = sqrt % 2 == 0 ? sqrt : sqrt - 1;
        this.options.gameover = false;
        this.options.maxGrid = maxGrid;
        this.options.grid = this.options.levelGrid > maxGrid ? maxGrid : this.options.levelGrid
        this.options.block = false;
        this.options.ready = true;
        this.options.selectedMatches = {};
        this.options.selectedTiles = {};
        this.options.vector = [];
        this.options.wTile = this.options.canvas.width / this.options.grid
        this.options.hTile = this.options.canvas.height / this.options.grid
        this.options.matches = (this.options.grid * this.options.grid)/2
        for(let i = 0; i < this.options.matches; i++){
            this.options.vector.push({img: this.options.images[i],value: i+1});
            this.options.vector.push({img: this.options.images[i],value: i+1});
        }
        this.options.vector = shuffle.call(this, this.options.vector)
    }

    function events(){
        this.options.canvas.addEventListener("mousedown", (event) => 
        { 
            if(this.options.block == false){
                let rect = this.options.canvas.getBoundingClientRect(); 
                let xClick = event.clientX - rect.left; 
                let yClick = event.clientY - rect.top; 
                for(let x = 0; x < this.options.grid; x++){
                    for(let y = 0; y < this.options.grid; y++){
                        if(
                            xClick > x*this.options.wTile &&
                            xClick < (x*this.options.wTile)+this.options.wTile &&
                            yClick > y*this.options.hTile &&
                            yClick < (y*this.options.hTile)+this.options.hTile 
                        ){
                            if(
                                this.options.selectedTiles.hasOwnProperty(x+"-"+y)||
                                this.options.selectedMatches.hasOwnProperty(x+"-"+y)
                            ){
                                console.log("already added")
                            }else{
                                const value = this.options.vector[getVectorPosition.call(this, x, y)]
                                this.options.selectedTiles[x+"-"+y] = value
                                if(Object.keys(this.options.selectedTiles).length == 2){
                                    this.options.block = true;
                                    this.options.movements += 1;
                                    this.options.onChangemovements(this.options.movements)
                                    const values = Object.values(this.options.selectedTiles);
                                    if(values[0].value==values[1].value){
                                        for (let [key, value] of Object.entries(this.options.selectedTiles)) {
                                            this.options.selectedMatches[key] = value;
                                            endgame.call(this)
                                        }
                                    }
                                    setTimeout(() => {
                                        this.options.selectedTiles = {};
                                        render.call(this);
                                        this.options.block = false;
                                    },this.options.timeoutCleaner);
                                }
                            }
                            
                        }
                    }
                }
                render.call(this)
            }
        }); 
    }

    function erase(){
        this.options.ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height);
    }

    function render(){
        erase.call(this)
        if(this.options.gameover){
            this.options.ctx.fillStyle = "#000000"
            this.options.ctx.font = "62px Arial";
            var text = "Game Over";
            var metrics = this.options.ctx.measureText(text);
            var textWidth = metrics.width;
            this.options.ctx.fillText(
                text,
                this.options.canvas.width / 2 - textWidth / 2,
                this.options.canvas.height / 2
            );
        }else{
            this.options.ctx.strokeStyle = "black"
            this.options.ctx.fillStyle = "#9575cd"
            this.options.ctx.lineWidth = 1
            for(let x = 0; x < this.options.grid; x++){
                for(let y = 0; y < this.options.grid; y++){
                    this.options.ctx.beginPath();
                    this.options.ctx.moveTo(x*this.options.wTile, y*this.options.hTile);
                    this.options.ctx.lineTo(x*this.options.wTile+this.options.wTile, y*this.options.hTile);
                    this.options.ctx.lineTo(x*this.options.wTile+this.options.wTile, y*this.options.hTile+this.options.hTile);
                    this.options.ctx.lineTo(x*this.options.wTile, y*this.options.hTile+this.options.hTile);
                    this.options.ctx.lineTo(x*this.options.wTile, y*this.options.hTile);
                    this.options.ctx.closePath();
                    this.options.ctx.fill()
                    this.options.ctx.stroke()                                     
                }
            }            
            for(let x = 0; x < this.options.grid; x++){
                for(let y = 0; y < this.options.grid; y++){
                    if(
                        this.options.selectedTiles.hasOwnProperty(x+"-"+y)||
                        this.options.selectedMatches.hasOwnProperty(x+"-"+y)
                    ){
                        let value = this.options.vector[getVectorPosition.call(this,x,y)]                    
                        this.options.ctx.drawImage(
                            value.img, 
                            x*this.options.wTile + this.options.tilePadding,
                            y*this.options.hTile + this.options.tilePadding,
                            this.options.wTile - this.options.tilePadding*2, 
                            this.options.hTile - this.options.tilePadding*2,
                        );                      
                    } else{
                        this.options.ctx.drawImage(
                            this.options.hidden, 
                            x*this.options.wTile + this.options.tilePadding,
                            y*this.options.hTile + this.options.tilePadding,
                            this.options.wTile - this.options.tilePadding*2, 
                            this.options.hTile - this.options.tilePadding*2,
                        );  
                    }             
                }
            }
        }        
    }

    function gameover(){
        var minMoves = 0;
        for(var i = 2; i <= this.options.maxGrid; i+=2){
            minMoves += (i*i)/2
        }
        this.options.gameover = true;
        this.options.score = Math.floor(minMoves / this.options.movements * 100);
        render.call(this)
        this.options.onGameover(this.options.score)
    }

    function endgame(){
        if(Object.keys(this.options.selectedMatches).length == this.options.matches*2){
            if(this.options.levelGrid == this.options.maxGrid){
                gameover.call(this);
            }else{
                this.options.level+=1;
                this.options.levelGrid+=2;
                this.options.onChangelevel(this.options.level)
                reset.call(this)
                render.call(this)
            }                        
        }
    }

    function getVectorPosition(x, y){
        return x + this.options.grid * y;
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function extendDefaults(source, properties){
        var property;
        for(property in properties){
            if(properties.hasOwnProperty(property)){
                source[property] = properties[property];
            }
        }
        return source;
    }
}());