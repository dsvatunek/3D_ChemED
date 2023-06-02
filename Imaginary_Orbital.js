$(document).ready(function() {
    var viewers = [];

    // Load molecule for each viewer
    $('.mol_container_virtual').each(function() {
        var viewerId = this.id;
        var file = $(this).data('file');
        var viewer = loadMolecule(viewerId, file);
        viewers.push(viewer);
    });

    // Enable rotation synchronization
    $('.mol_container_virtual').mousedown(function(event) {
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
