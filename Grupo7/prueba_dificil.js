        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import GUI from 'lil-gui';

        // ============ 1. ESCENA, CÁMARA, RENDERIZADOR ============
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050510);
        
        // Estrellas de fondo
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const starPositions = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 200;
            starPositions[i+1] = (Math.random() - 0.5) * 200;
            starPositions[i+2] = (Math.random() - 0.5) * 200;
        }
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(4, 2, 6);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // ============ 2. CONTROLES ORBIT ============
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.target.set(0, 0.5, 0);
        controls.maxPolarAngle = Math.PI / 2;
        controls.minDistance = 3;
        controls.maxDistance = 15;

        // ============ 3. LUCES ============
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);

        // Luz principal
        const mainLight = new THREE.DirectionalLight(0xffeedd, 1);
        mainLight.position.set(2, 3, 4);
        mainLight.castShadow = true;
        mainLight.receiveShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        // Luces de relleno
        const fillLight1 = new THREE.PointLight(0x4466aa, 0.5);
        fillLight1.position.set(-3, 1, 2);
        scene.add(fillLight1);

        const fillLight2 = new THREE.PointLight(0xaa4466, 0.3);
        fillLight2.position.set(2, 0, 5);
        scene.add(fillLight2);

        // Luz trasera
        const backLight = new THREE.PointLight(0x6644aa, 0.2);
        backLight.position.set(0, 1, -5);
        scene.add(backLight);

        // Suelo reflectante
        const gridHelper = new THREE.GridHelper(15, 20, 0xff6b6b, 0x333344);
        gridHelper.position.y = -0.5;
        scene.add(gridHelper);

        // ============ 4. CONSTRUIR GUITARRA CON GEOMETRÍAS BÁSICAS ============
        // Como no tenemos modelo GLTF, construimos una guitarra estilizada
        
        const guitarra = new THREE.Group();

        // --- CUERPO (principal) ---
        const cuerpoGeo = new THREE.BoxGeometry(2.2, 0.4, 1.2);
        const cuerpoMat = new THREE.MeshStandardMaterial({ 
            color: 0xc41e3a, 
            roughness: 0.4, 
            metalness: 0.3,
            emissive: new THREE.Color(0x331111),
            emissiveIntensity: 0.1
        });
        const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat);
        cuerpo.castShadow = true;
        cuerpo.receiveShadow = true;
        cuerpo.position.y = 0.2;
        guitarra.add(cuerpo);

        // Redondear bordes con detalles
        const cuerpoDetalleGeo = new THREE.BoxGeometry(2.15, 0.35, 1.15);
        const cuerpoDetalleMat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.1 });
        const cuerpoDetalle = new THREE.Mesh(cuerpoDetalleGeo, cuerpoDetalleMat);
        cuerpoDetalle.position.y = 0.2;
        guitarra.add(cuerpoDetalle);

        // --- MÁSTIL ---
        const mastilGeo = new THREE.BoxGeometry(0.25, 0.25, 3.5);
        const mastilMat = new THREE.MeshStandardMaterial({ 
            color: 0x8b5a2b, 
            roughness: 0.7, 
            metalness: 0.1 
        });
        const mastil = new THREE.Mesh(mastilGeo, mastilMat);
        mastil.castShadow = true;
        mastil.receiveShadow = true;
        mastil.position.set(0, 0.4, -1.2);
        mastil.rotation.x = 0.1;
        guitarra.add(mastil);

        // --- DIASTEMAS (trastes) ---
        for (let i = 0; i < 22; i++) {
            const trasteGeo = new THREE.BoxGeometry(0.3, 0.05, 0.05);
            const trasteMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 });
            const traste = new THREE.Mesh(trasteGeo, trasteMat);
            traste.castShadow = true;
            traste.receiveShadow = true;
            traste.position.set(0, 0.55, -1.2 + i * 0.15);
            guitarra.add(traste);
        }

        // --- PALA (cabezal) ---
        const palaGeo = new THREE.BoxGeometry(0.4, 0.2, 0.8);
        const palaMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
        const pala = new THREE.Mesh(palaGeo, palaMat);
        pala.castShadow = true;
        pala.receiveShadow = true;
        pala.position.set(0, 0.45, -2.9);
        pala.rotation.x = -0.2;
        guitarra.add(pala);

        // Clavijeros
        for (let i = 0; i < 6; i++) {
            const clavijaGeo = new THREE.SphereGeometry(0.08);
            const clavijaMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.7 });
            const clavija = new THREE.Mesh(clavijaGeo, clavijaMat);
            clavija.castShadow = true;
            clavija.receiveShadow = true;
            clavija.position.set(-0.15 + i * 0.1, 0.55, -3.2);
            guitarra.add(clavija);
        }

        // --- PASTILLAS (humbuckers) ---
        const pastilla1Geo = new THREE.BoxGeometry(0.8, 0.1, 0.3);
        const pastillaMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.6 });
        const pastilla1 = new THREE.Mesh(pastilla1Geo, pastillaMat);
        pastilla1.castShadow = true;
        pastilla1.receiveShadow = true;
        pastilla1.position.set(0, 0.45, 0.4);
        guitarra.add(pastilla1);

        const pastilla2 = pastilla1.clone();
        pastilla2.position.set(0, 0.45, -0.3);
        guitarra.add(pastilla2);

        // --- PUENTE ---
        const puenteGeo = new THREE.BoxGeometry(0.9, 0.1, 0.2);
        const puenteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
        const puente = new THREE.Mesh(puenteGeo, puenteMat);
        puente.castShadow = true;
        puente.receiveShadow = true;
        puente.position.set(0, 0.35, 0.8);
        guitarra.add(puente);

        // --- CUERDAS (decorativas) ---
        for (let i = 0; i < 6; i++) {
            const cuerdaGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.5);
            const cuerdaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.1, metalness: 0.9 });
            const cuerda = new THREE.Mesh(cuerdaGeo, cuerdaMat);
            cuerda.castShadow = true;
            cuerda.receiveShadow = true;
            cuerda.position.set(-0.5 + i * 0.2, 0.7, -0.6);
            cuerda.rotation.z = 0.1;
            cuerda.rotation.x = 0.2;
            guitarra.add(cuerda);
        }

        // --- PERILLAS (volumen, tono) ---
        const perillaGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1);
        const perillaMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });
        
        const perilla1 = new THREE.Mesh(perillaGeo, perillaMat);
        perilla1.castShadow = true;
        perilla1.receiveShadow = true;
        perilla1.position.set(0.6, 0.45, 0.6);
        perilla1.rotation.x = Math.PI / 2;
        guitarra.add(perilla1);
        
        const perilla2 = perilla1.clone();
        perilla2.position.set(0.6, 0.45, 0.2);
        guitarra.add(perilla2);

        scene.add(guitarra);

        // Guardar referencias para el GUI
        const piezas = {
            cuerpo: cuerpo,
            mastil: mastil,
            pastillas: [pastilla1, pastilla2]
        };

        // ============ 5. LIL-GUI - PANEL DE CONTROLES ============
        const gui = new GUI({ container: document.getElementById('gui'), title: false });
        
        // Estados
        const params = {
            // Colores
            colorCuerpo: '#c41e3a',
            colorMastil: '#8b5a2b',
            colorPastillas: '#333333',
            // Materiales
            metalness: 0.3,
            roughness: 0.4,
            // Auto-rotación
            autoRotate: true,
            // Piezas (toggle)
            mostrarPastillas: true
        };

        // Carpeta: COLORES
        const coloresFolder = gui.addFolder('🎨 Colores');
        coloresFolder.open();
        
        coloresFolder.addColor(params, 'colorCuerpo').name('Cuerpo').onChange(val => {
            piezas.cuerpo.material.color.set(val);
        });
        
        coloresFolder.addColor(params, 'colorMastil').name('Mástil').onChange(val => {
            piezas.mastil.material.color.set(val);
        });
        
        coloresFolder.addColor(params, 'colorPastillas').name('Pastillas').onChange(val => {
            piezas.pastillas.forEach(p => p.material.color.set(val));
        });

        // Carpeta: MATERIAL
        const materialFolder = gui.addFolder('✨ Acabado');
        materialFolder.open();
        
        materialFolder.add(params, 'metalness', 0, 1, 0.01).name('Metal').onChange(val => {
            piezas.cuerpo.material.metalness = val;
        });
        
        materialFolder.add(params, 'roughness', 0, 1, 0.01).name('Rugosidad').onChange(val => {
            piezas.cuerpo.material.roughness = val;
        });

        // Carpeta: CONTROLES
        const controlesFolder = gui.addFolder('🖱️ Vista');
        controlesFolder.open();
        
        controlesFolder.add(params, 'autoRotate').name('Rotación automática').onChange(val => {
            controls.autoRotate = val;
        });
        
        controlesFolder.add(controls, 'autoRotateSpeed', 0.5, 3).name('Velocidad rotación');

        // Carpeta: PIEZAS
        const piezasFolder = gui.addFolder('🧩 Piezas');
        piezasFolder.open();
        
        piezasFolder.add(params, 'mostrarPastillas').name('Mostrar pastillas').onChange(val => {
            piezas.pastillas.forEach(p => p.visible = val);
        });

        // ============ 6. ANIMACIÓN ============
        function animate() {
            requestAnimationFrame(animate);
            
            controls.update();
            
            renderer.render(scene, camera);
        }
        
        animate();

        // ============ 7. RESPONSIVE ============
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Pequeña animación inicial
        setTimeout(() => {
            controls.autoRotate = true;
        }, 1000);
