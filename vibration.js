$.get("public/vibration.xyz", function(data) {

    let viewer = $3Dmol.createViewer("vibration");
    let set = {
        interval: 100,
    };
    viewer.addModelsAsFrames(data, "xyz");

    viewer.setBackgroundColor(0x000000);
    viewer.setStyle({}, {stick: {radius: 0.15}, sphere: {scale: 0.25}});

    viewer.zoomTo();
    viewer.zoom(1.8);

    viewer.animate({loop: 'forward', interval: set.interval}); // Start the animation

    viewer.render();
});

