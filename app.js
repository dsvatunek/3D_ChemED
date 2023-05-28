let container, camera, scene, renderer, controls, pointLight;
let models = ['public/suzanne_1.glb', 'public/suzanne_2.glb']; //add your 3d model files here
let currentModel = null;
let loader = new THREE.GLTFLoader();

init();
animate();

function init() {
    container = document.getElementById('container');

    // Create Perspective camera
    perspectiveCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    perspectiveCamera.position.z = 2;
    
    // Create Orthographic camera
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 3;
    orthographicCamera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000);
    
    // Use perspective camera initially
    camera = perspectiveCamera;
    
    // Add event listener for window resize
    window.addEventListener('resize', function() {
        const aspect = container.clientWidth / container.clientHeight;
    
        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();
    
        orthographicCamera.left = frustumSize * aspect / - 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.updateProjectionMatrix();
    
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Create scene
    scene = new THREE.Scene();

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
	controlsPerspective = new THREE.TrackballControls(perspectiveCamera, renderer.domElement);
	controlsOrthographic = new THREE.TrackballControls(orthographicCamera, renderer.domElement);
    
    let light = new THREE.AmbientLight(0xffffff,0.5); // soft white light
    scene.add(light);
    
    // Create a point light
    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5); // Position the light
    // Add the light to the scene
    scene.add(pointLight);
    scene.add(camera);

    // Create controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    // Load initial model
    loadModel(models[0]);

    // Handle slider change
    document.getElementById('model-slider').addEventListener('input', function(e) {
        let modelIndex = e.target.value;
        loadModel(models[modelIndex]);
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Update both controls
    controlsPerspective.update();
    controlsOrthographic.update();

    // Make the light follow the camera
    pointLight.position.copy(camera.position);

    renderer.render(scene, camera);
}


function loadModel(model) {
    if (currentModel) {
        // Remove previous model
        scene.remove(currentModel);
    }

    loader.load(model, function(gltf) {
        currentModel = gltf.scene;
        currentModel.scale.set(0.8, 0.8, 0.8);
        scene.add(currentModel);
    }, undefined, function(error) {
        console.error(error);
    });
}

function onWindowResize() {
    const aspect = container.clientWidth / container.clientHeight;
    
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();
    
    orthographicCamera.left = frustumSize * aspect / - 2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.updateProjectionMatrix();
    
    renderer.setSize(container.clientWidth, container.clientHeight);
}


const cameraToggle = document.getElementById('camera-toggle');

cameraToggle.addEventListener('change', function() {
    // Dispose of the old controls
    controls.dispose();

    if (this.checked) {
        // Switch to orthographic camera
        camera = orthographicCamera;
        // Update orthographic camera's position to match perspective camera
        camera.position.copy(perspectiveCamera.position);
        // Also copy rotation
        camera.rotation.copy(perspectiveCamera.rotation);

    } else {
        // Switch back to perspective camera
        camera = perspectiveCamera;
        // Update perspective camera's position to match orthographic camera
        camera.position.copy(orthographicCamera.position);
        // Also copy rotation
        camera.rotation.copy(orthographicCamera.rotation);
		
    }

    // Update controls to new camera
	controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.5; // Increase rotation speed
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
});

// Get the necessary elements
const slider = document.getElementById("model-slider");
const dynamicText = document.getElementById("dynamic-text");

// Define the text values based on the slider positions
const textOptions = [
    "Suzanne shiny",
    "Suzanne rough",
    // Add more text options for other slider positions
];

// Function to update the text based on the slider position
function updateText() {
    const sliderValue = parseInt(slider.value);
    dynamicText.textContent = textOptions[sliderValue];
}

// Listen for changes in the slider value
slider.addEventListener("input", updateText);

// Initial text update
updateText();