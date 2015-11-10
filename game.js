// Game Class - holds methods and objects for the game
var Game = function() {
  // Set the width and height of the scene.
  this._width = 1280;
  this._height = 720;

  // Setup the rendering surface.
  this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
  document.body.appendChild(this.renderer.view);

  // Create the main stage to draw on.
  this.stage = new PIXI.Stage();

  // Start running the game.
  this.build();
};

Game.prototype = {
  /**
   * Build the scene and begin animating.
   */
  build: function() {
    // Draw the star-field in the background.
    this.drawStars();

    // Setup the boundaries of the game's arena.
    this.setupBoundaries();

    // draw ship to scene
    this.createShip();

    // Begin the first frame.
    requestAnimationFrame(this.tick.bind(this));
  },

  /**
   * Draw the field of stars behind all of the action.
   */
  drawStars: function() {
    // Draw randomly positioned stars.
    for (var i=0; i<1500; i++) {
      // Generate random parameters for the stars.
      var x = Math.round(Math.random() * this._width);
      var y = Math.round(Math.random() * this._height);
      var rad = Math.ceil(Math.random() * 2);
      var alpha = Math.min(Math.random() + 0.25, 1);

      // Draw the star.
      var star  = new PIXI.Graphics();
      star.beginFill(0xFFFFFF, alpha);
      star.drawCircle(x, y, rad);
      star.endFill();

      // Attach the star to the stage.
      this.stage.addChild(star);
    }
  },

  /**
   * Draw the boundaries of the space arena.
   */
  setupBoundaries: function() {
    var walls = new PIXI.Graphics();
    walls.beginFill(0xFFFFFF, 0.5);
    walls.drawRect(0, 0, this._width, 10);
    walls.drawRect(this._width - 10, 10, 10, this._height - 20);
    walls.drawRect(0, this._height - 10, this._width, 10);
    walls.drawRect(0, 10, 10, this._height - 20);
    
    // Attach the walls to the stage.
    this.stage.addChild(walls);    
  },

  createShip: function () {
    // create new ship object
    this.ship = new PIXI.Graphics();

    // draw the ships body (triangle)
    this.ship.beginFill(0x20d3fe); // give it a color
    this.ship.moveTo(0, 0); // origin point
    this.ship.lineTo(-26, 60); // draw a line from origin
    this.ship.lineTo(26, 60); // draw a line from origin
    this.ship.endFill();

    // add an engine
    this.ship.beginFill(0x1495d1);
    this.ship.drawRect(-15, 60, 30, 8);
    this.ship.endFill();    

    // position the ship in middle of screen
    this.ship.x = Math.round(this._width / 2);
    this.ship.y = Math.round(this._height / 2);

    //attach ship to stage
    this.stage.addChild(this.ship);

    // setup event listeners for flight
    Mousetrap.bind('w', function(){
      this.ship.rotation = 0 * (Math.PI / 180); // radians, not degrees
      this.moveShip('n');
    }.bind(this));

    Mousetrap.bind('s', function(){
      this.ship.rotation = 180 * (Math.PI / 180); // radians, not degrees
      this.moveShip('s');
    }.bind(this));

    Mousetrap.bind('d', function(){
      this.ship.rotation = 90 * (Math.PI / 180); // radians, not degrees
      this.moveShip('e');
    }.bind(this));

    Mousetrap.bind('a', function(){
      this.ship.rotation = 270 * (Math.PI / 180); // radians, not degrees
      this.moveShip('w');
    }.bind(this));
  },

  moveShip: function (dir) {
    var speed = 30;

    //incrememt x/y of ship & dir
    switch (dir) {
      case 'n':
        this.ship.y -= speed;
        break;

      case 's':
        this.ship.y += speed;
        break;

      case 'e':
        this.ship.x += speed;
        break;

      case 'w':
        this.ship.x -= speed;
        break;
    }
  },



  /**
   * Fires at the end of the gameloop to reset and redraw the canvas.
   */
  tick: function() {
    // Render the stage for the current frame.
    this.renderer.render(this.stage);

    // Begin the next frame.
    requestAnimationFrame(this.tick.bind(this));
  }
};