$(document).ready(function() {
    var viewers = [];
    var rotation = { dx: 0, dy: 0 };

    // Load molecule for each viewer
    $('.mol_container').each(function() {
        var viewerId = this.id;
        var file = $(this).data('file');
        var colorScheme = $(this).data('color-scheme');
        var viewer = loadMolecule(viewerId, file, colorScheme);
        viewers.push(viewer);
        $(this).data('viewer', viewer);  // Store the viewer instance in the DOM element for reference later
    });

    // Rotate all viewers based on stored rotation values
    function updateViewers() {
        viewers.forEach(function(viewer) {
            viewer.setRotation(rotation.dx, {x: 0, y: 1});
            viewer.setRotation(rotation.dy, {x: 1, y: 0});
            viewer.render();
        });
    }

    // Handle rotation on mousedown or touchstart event
    $('.mol_container').on('mousedown touchstart', function(event) {
        event.preventDefault();

        var startPos = event.type === 'mousedown' ? event : event.originalEvent.touches[0];
        var lastPos = { x: startPos.clientX, y: startPos.clientY };

        $(document).on('mousemove touchmove', function(event) {
            var currentPos = event.type === 'mousemove' ? event : event.originalEvent.touches[0];
            
            var dx = currentPos.clientX - lastPos.x;
            var dy = currentPos.clientY - lastPos.y;
            
            rotation.dx += dx;
            rotation.dy += dy;

            lastPos = { x: currentPos.clientX, y: currentPos.clientY };

            updateViewers();
        });

        $(document).on('mouseup touchend', function() {
            $(document).off('mousemove touchmove');
        });
    });

    // Handle zooming on wheel event
    $('.mol_container').on('wheel', function(event) {
        event.preventDefault();
        var delta = event.originalEvent.deltaY;
        zoomViewers(viewers, delta);
    });
});

function loadMolecule(viewerId, file, colorScheme) {
    var viewer = $3Dmol.createViewer(viewerId);
    $.get(file, function(data) {
        var m = viewer.addModel(data, "cube");
        viewer.addModel(data, "cube");
        viewer.setBackgroundColor(0xd3d3d3);
        viewer.setStyle({}, {stick: {radius: 0.15, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}, sphere: {scale: 0.25, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}});
        
        var volumeData = new $3Dmol.VolumeData(data, "cube");
        if (colorScheme === 'real') {
            viewer.addIsosurface(volumeData, {isoval: -0.02, color: "blue", alpha: 0.8, smoothness: 10});
            viewer.addIsosurface(volumeData, {isoval: 0.02, color: "green", alpha: 0.8, smoothness: 10});
        } else if (colorScheme === 'virtual') {
            viewer.addIsosurface(volumeData, {isoval: -0.02, color: "red", alpha: 0.8, smoothness: 10});
            viewer.addIsosurface(volumeData, {isoval: 0.02, color: "yellow", alpha: 0.8, smoothness: 10});
        } else {
            viewer.addIsosurface(volumeData, {isoval: -0.02, color: "blue", alpha: 0.8, smoothness: 10});
            viewer.addIsosurface(volumeData, {isoval: 0.02, color: "green", alpha: 0.8, smoothness: 10});
        }
        
        viewer.zoomTo();
        viewer.zoom(1.5);
        viewer.rotate(17, {x: 0, y: 0, z: 1});      
        viewer.render();
    });
    return viewer;
}

function rotateViewers(viewers, activeViewer, dy, dx) {
    viewers.forEach(function(viewer){
        if (viewer !== activeViewer) {
            viewer.rotate(1 * dy, {x: 1, y: 0});
            viewer.rotate(1 * dx, {x: 0, y: 1});
            viewer.render();
        }
    });
}

function zoomViewers(viewers, delta) {
    viewers.forEach(function(viewer){
        viewer.zoom(1 + (1 * delta));
        viewer.render();
    });
}