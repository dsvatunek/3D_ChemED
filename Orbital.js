$(document).ready(function() {
    // Load molecule for each viewer
    $('.mol_container').each(function() {
        var viewerId = this.id;
        var file = $(this).data('file');
        var colorScheme = $(this).data('color-scheme');
        var viewer = loadMolecule(viewerId, file, colorScheme);
        $(this).data('viewer', viewer);  // Store the viewer instance in the DOM element for reference later
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
