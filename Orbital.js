$(document).ready(function() {
    var viewers = [];

    // Load molecule for each viewer
    $('.mol_container').each(function() {
        var viewerId = this.id;
        var file = $(this).data('file');
        var colorScheme = $(this).data('color-scheme');
        var viewer = loadMolecule(viewerId, file, colorScheme);
        viewers.push(viewer);
    });

    // Enable rotation and zoom synchronization
    var activeViewer = null;
    $('.mol_container').mousedown(function(event) {
        event.preventDefault();
        activeViewer = $(this).data('viewer');
        var last_x = event.clientX;
        var last_y = event.clientY;
        $(document).mousemove(function(event) {
            if (activeViewer) {
                var dx = event.clientX - last_x;
                var dy = event.clientY - last_y;
                last_x = event.clientX;
                last_y = event.clientY;
                rotateViewer(activeViewer, dy, dx);
            }
        }).mouseup(function() {
            $(document).off('mousemove');
            activeViewer = null;
        });
    });

    // Enable zoom synchronization
    $('.mol_container').on('wheel', function(event) {
        event.preventDefault();
        var delta = event.originalEvent.deltaY;
        if (activeViewer) {
            zoomViewer(activeViewer, delta);
        }
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
        viewer.zoom(1.8);
        viewer.rotate(-15, {x: 0, y: 0, z: 1});      
        viewer.render();
    });
    return viewer;
}

function rotateViewer(viewer, dy, dx) {
    viewer.rotate(1 * dy, {x: 1, y: 0});
    viewer.rotate(1 * dx, {x: 0, y: 1});
    viewer.render();
}

function zoomViewer(viewer, delta) {
    viewer.zoom(1 + (1 * delta));
    viewer.render();
}
