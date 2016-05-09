// This js file abstracts away the rendering aspects of three.js
// Unless you are interested, do not read into this file.

var Renderer = Renderer || {
    // internal variables
    _canvas     : undefined,
    _renderer   : undefined,
    _controls   : undefined,
    _camera     : undefined,
    _stats      : undefined,
    _scene      : undefined,
    _raycaster  : undefined,
    _width      : undefined,
    _height     : undefined,
    _aspect     : undefined,
};

Renderer.getDims = function() {
    var width  = window.innerWidth;
    var height = window.innerHeight;
    if (Gui.values.windowSize !== "full") {
        var parts = Gui.values.windowSize.split('x');
        width  = parseInt(parts[0]);
        height = parseInt(parts[1]);
    }
    Renderer._width  = width;
    Renderer._height = height;
    Renderer._aspect = width/height;
};

Renderer.create = function( scene, canvas ) {
    Renderer.getDims();

    // Canvas and rendering setup
    Renderer._canvas = canvas;
    Renderer._renderer = new THREE.WebGLRenderer( { canvas:canvas, antialias: true, preserveDrawingBuffer: true } );
    Renderer._renderer.setPixelRatio( window.devicePixelRatio );
    Renderer._renderer.setSize( Renderer._width, Renderer._height );
    Renderer._renderer.setClearColor( 0xe6ffff );//c5e1d7

    // Renderer._renderer.autoClear = false;
    window.addEventListener( "resize",    Renderer.onWindowResize, false );
    canvas.addEventListener( "mouseup",   Renderer.onMouseUp,      false );
    canvas.addEventListener( "mousedown", Renderer.onMouseDown,    false );

    document.body.appendChild( Renderer._renderer.domElement );

    // Create camera and setup controls
    Renderer._camera   = new THREE.PerspectiveCamera ( 55, Renderer._aspect, 0.01, 5000 );
    Renderer._controls = new THREE.TrackballControls ( Renderer._camera, Renderer._renderer.domElement );
    Renderer._camera.position.set( 300, 200, 400 );

    // Add rendering stats, so we know the performance
    var container = document.getElementById( "stats" );
    Renderer._stats = new Stats();
    Renderer._stats.domElement.style.position = "absolute";
    Renderer._stats.domElement.style.bottom   = "0px";
    Renderer._stats.domElement.style.right    = "0px";
    container.appendChild( Renderer._stats.domElement );

    // make sure renderer is aware of the scene it is rendering
    Renderer._scene = scene._scene;

    // create raycaster
    Renderer._mouse = new THREE.Vector2;
    Renderer._raycaster = new THREE.Raycaster();
};

Renderer.onWindowResize = function () {
    Renderer.getDims();

    Renderer._camera.aspect = Renderer._aspect;
    Renderer._camera.updateProjectionMatrix();

    Renderer._renderer.setSize( Renderer._width, Renderer._height );
};

Renderer.update = function () {

    ParticleEngine.step();

    Renderer._controls.update();
    Renderer._stats.update();

    Renderer._renderer.render( Renderer._scene, Renderer._camera );


    requestAnimationFrame( Renderer.update );
}

Renderer.snapShot = function () {
    // get the image data
    try {
        var dataURL = Renderer._renderer.domElement.toDataURL();
    }
    catch( err ) {
        alert('Sorry, your browser does not support capturing an image.');
        return;
    }

    // this will force downloading data as an image (rather than open in new window)
    var url = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    window.open( url );
}

// add event listener that will cause 'I' key to download image
// window.addEventListener( 'keyup', function( event ) {
//     // only respond to 'I' key
//     if ( event.which == 73 ) {
//         Renderer.snapShot();
//     }
// });

window.addEventListener( 'keyup', function( event ) {
    // only respond to 'a' key
    if ( event.which == 65 ) {
        ParticleEngine.reinitialize();
    }
});

var Key_j = false;
var Key_l = false;

var Key_i = false;
var Key_k = false;

var Key_u = false;
var Key_o = false;

window.addEventListener( 'keyup', function( event ) {
    // If a predator rey is released then stop moving in that direction
    if (event.which == 73)
        Key_i = false;
    if (event.which == 75)
        Key_k = false;
    if (event.which == 74)
        Key_j = false;
    if (event.which == 76)
        Key_l = false;
    if (event.which == 85)
        Key_u = false;
    if (event.which == 79)
        Key_o = false;

    if ( event.which == 83 ) {
        ParticleEngine.speedup();
        speedingUp += 0.3;
    }

    if ( event.which == 68)
        ParticleEngine.addFood();
});

// predator movement controls
window.addEventListener( 'keydown', function( event ) {

    // As long as key is down we want to move the predator
    if (event.which == 73)
        Key_i = true;
    if (event.which == 75)
        Key_k = true;
    if (event.which == 74)
        Key_j = true;
    if (event.which == 76)
        Key_l = true;
    if (event.which == 85)
        Key_u = true;
    if (event.which == 79)
        Key_o = true;   
});

