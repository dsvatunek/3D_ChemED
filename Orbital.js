$(document).ready(function() {
    var viewers = [];

    // Load molecule for each viewer
    $('.mol_container').each(function() {
        var viewerId = this.id;
        var file = $(this).data('file');
        var viewer = loadMolecule(viewerId, file);
        viewers.push(viewer);
    });

    // Enable rotation synchronization
    $('.mol_container').mousedown(function(event) {
        event.preventDefault();
        var last_x = event.clientX;
        var last_y = event.clientY;
        $(document).mousemove(function(event) {
            var dx = event.clientX - last_x;
            var dy = event.clientY - last_y;
            last_x = event.clientX;
            last_y = event.clientY;
            rotateViewers(viewers, 0.1 * dy, 0.1 * dx);
        }).mouseup(function() {
            $(document).off('mousemove');
        });
    });
});

function loadMolecule(viewerId, file) {
    var viewer = $3Dmol.createViewer(viewerId);
    $.get(file, function(data) {
        var m = viewer.addModel(data, "cube");
        viewer.addModel(data, "cube");
        viewer.setBackgroundColor(0xd3d3d3);
        viewer.setStyle({}, {stick: {radius: 0.15, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}, sphere: {scale: 0.25, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}});
        
        var volumeData = new $3Dmol.VolumeData(data, "cube");
        viewer.addIsosurface(volumeData, {isoval: -0.02, color: "blue", alpha: 0.8, smoothness: 10});
        viewer.addIsosurface(volumeData, {isoval: 0.02, color: "green", alpha: 0.8, smoothness: 10});
                
        viewer.zoomTo();
        viewer.zoom(1.8);
        viewer.rotate(-45, {x: 0, y: 1, z: 0});      
        viewer.render();
    });
    return viewer;
}

function rotateViewers(viewers, dy, dx) {
    viewers.forEach(function(viewer) {
        viewer.rotate(0.1 * dy, {x: 1, y: 0});
        viewer.rotate(0.1 * dx, {x: 0, y: 1});
        viewer.render();
    });
}
