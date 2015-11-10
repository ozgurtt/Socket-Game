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

  // set up physics world simulation
  this.world = new p2.World({
    gravity: [0, 0]
  });

  // speed params for ship
  this.speed = 100;
  this.turnSpeed = 2;

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
    this.ship = new p2.Body({
      mass: 1,
      angularVelocity: 0,
      damping: 0,
      angularDamping: 0,
      position: [Math.round(this._width / 2), Math.round(this._height / 2)]
    });
    this.shipShape = new p2.Rectangle(52, 69);
    this.ship.addShape(this.shipShape);
    this.world.addBody(this.ship);

    this.shipGraphics = new PIXI.Graphics();

    // draw the ships body (triangle)
    this.shipGraphics.beginFill(0x20d3fe); // give it a color
    this.shipGraphics.moveTo(0, 0); // origin point
    this.shipGraphics.lineTo(-26, 60); // draw a line from origin
    this.shipGraphics.lineTo(26, 60); // draw a line from origin
    this.shipGraphics.endFill();

    // add an engine
    this.shipGraphics.beginFill(0x1495d1);
    this.shipGraphics.drawRect(-15, 60, 30, 8);
    this.shipGraphics.endFill();    

    //attach ship to stage
    this.stage.addChild(this.shipGraphics);

    // setup event listeners for flight
    Mousetrap.bind('w', function(){
      this.shipGraphics.rotation = 0 * (Math.PI / 180); // radians, not degrees
      this.moveShip('n');
    }.bind(this));

    Mousetrap.bind('s', function(){
      this.shipGraphics.rotation = 180 * (Math.PI / 180); // radians, not degrees
      this.moveShip('s');
    }.bind(this));

    Mousetrap.bind('d', function(){
      this.shipGraphics.rotation = 90 * (Math.PI / 180); // radians, not degrees
      this.moveShip('e');
    }.bind(this));

    Mousetrap.bind('a', function(){
      this.shipGraphics.rotation = 270 * (Math.PI / 180); // radians, not degrees
      this.moveShip('w');
    }.bind(this));
  },

  moveShip: function (dir) {
    var speed = 30;

    //incrememt x/y of ship & dir
    switch (dir) {
      case 'n':
        this.shipGraphics.y -= speed;
        break;

      case 's':
        this.shipGraphics.y += speed;
        break;

      case 'e':
        this.shipGraphics.x += speed;
        break;

      case 'w':
        this.shipGraphics.x -= speed;
        break;
    }
  },

  updatePhysics: function(){
    // update graphics based on physics
    this.shipGraphics.x = this.ship.position[0];
    this.shipGraphics.y = this.ship.position[1];
    this.shipGraphics.rotation = this.ship.angle;

    // stop the physics forward, 60 frames per second
    this.world.step(1/60);
  },



  /**
   * Fires at the end of the gameloop to reset and redraw the canvas.
   */
  tick: function() {
    this.updatePhysics();

    // Render the stage for the current frame.
    this.renderer.render(this.stage);

    // Begin the next frame.
    requestAnimationFrame(this.tick.bind(this));
  }
};