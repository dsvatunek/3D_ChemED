var widgets_virt = {};

$(document).ready(function() {
    $('.mol_container_virtual').each(function() {
        var viewerId = this.id;  // get id of div
        var file = $(this).data('file');  // get cube file name from data-file attribute
        loadMolecule_virt(viewerId, file);
    });
});

function loadMolecule_virt(viewerId, file) {
    $.get(file, function(data) {
        var viewer = $3Dmol.createViewer(viewerId);
        var m = viewer.addModel(data, "cube");
        viewer.addModel(data, "cube");
        viewer.setBackgroundColor(0xd3d3d3);
        viewer.setStyle({}, {stick: {radius: 0.15, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}, sphere: {scale: 0.25, colorscheme: {'prop': 'elem', map: {'F': '#00ffff'}}}});
        
        var volumeData = new $3Dmol.VolumeData(data, "cube");
        viewer.addIsosurface(volumeData, {isoval: -0.02, color: "red", alpha: 0.8, smoothness: 10});
        viewer.addIsosurface(volumeData, {isoval: 0.02, color: "yellow", alpha: 0.8, smoothness: 10});
                
        viewer.zoomTo();
        viewer.zoom(1.8);
        viewer.rotate(-45, {x: 0, y: 1, z: 0});      
        //viewer.rotate(90, {x: 1, y: 0, z: 0});      
        viewer.render();
        
        widgets_virt[viewerId] = viewer;
    });
}
