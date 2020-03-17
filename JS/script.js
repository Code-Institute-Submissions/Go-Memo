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
        }
        var defaults = {
            canvasId: undefined,
            tilePadding: 10,
            timeoutCleaner: 1000,
            levelGrid: 2
        }
        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendDefaults(defaults, arguments[0]);
            this.options = extendDefaults(this.options, unprops);
        }
        //inicializer canvas
        this.options.canvas = document.getElementById(this.options.canvasId)
        this.options.ctx = this.options.canvas.getContext('2d')

        //init
        reset.call(this)
        //events
        events.call(this)
    }

    //public functions
    Game.prototype.setName = function(name){
        this.options.name = name;
        console.log(this.options)
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

    function start(totalAssets){
        if(totalAssets == this.options.images.length + 1){
            reset.call(this)
            render.call(this)
        }
    }

    //private functions

    function reset(){
        const sqrt = Math.floor(Math.sqrt(this.options.images.length * 2))
        const maxGrid = sqrt % 2 == 0 ? sqrt : sqrt - 1;
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
                                    const values = Object.values(this.options.selectedTiles);
                                    if(values[0].value==values[1].value){
                                        for (let [key, value] of Object.entries(this.options.selectedTiles)) {
                                            this.options.selectedMatches[key] = value;
                                            endgame.call(this)
                                        }
                                    }
                                    this.options.block = true;
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
        
        this.options.ctx.strokeStyle = "black"
        this.options.ctx.fillStyle = "#9575cd"
        this.options.ctx.lineWidth = 1
        for(let x = 0; x < this.options.grid; x++){
            for(let y = 0; y < this.options.grid; y++){
                this.options.ctx.rect(
                    x*this.options.wTile, 
                    y*this.options.hTile, 
                    this.options.wTile, 
                    this.options.hTile
                )
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

    function endgame(){
        console.log("endgame called")
        if(Object.keys(this.options.selectedMatches).length == this.options.matches*2){
            window.alert('You Won!');
            this.options.levelGrid+=2;
            reset.call(this)
            render.call(this)
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