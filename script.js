class WebcamFilters {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentFilter = 'none';
        this.faceMesh = null;
        this.camera = null;
        this.isInitialized = false;
        this.photos = [];
        this.currentFacingMode = 'user'; // 'user' for front camera, 'environment' for back
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.startCameraBtn = document.getElementById('startCamera');
        this.filterGrid = document.getElementById('filterGrid');
        this.actionButtons = document.getElementById('actionButtons');
        this.captureBtn = document.getElementById('capturePhoto');
        this.toggleCameraBtn = document.getElementById('toggleCamera');
        this.photoGallery = document.getElementById('photoGallery');
        this.photosGrid = document.getElementById('photos');
        this.loading = document.getElementById('loading');
    }

    setupEventListeners() {
        this.startCameraBtn.addEventListener('click', () => this.initializeCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.toggleCameraBtn.addEventListener('click', () => this.toggleCamera());
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.setFilter(filter);
                this.updateFilterButtons(e.currentTarget);
            });
        });
    }

    async initializeCamera() {
        try {
            this.showLoading(true);
            this.startCameraBtn.style.display = 'none';
            
            // Initialize MediaPipe Face Mesh
            await this.initializeFaceMesh();
            
            // Start camera
            await this.startCamera();
            
            this.filterGrid.style.display = 'grid';
            this.actionButtons.style.display = 'block';
            this.isInitialized = true;
            
            this.showLoading(false);
            
            // Add camera active animation
            document.querySelector('.camera-container').classList.add('camera-active');
            
        } catch (error) {
            console.error('Error initializing camera:', error);
            alert('Error accessing camera. Please make sure you have granted camera permissions.');
            this.showLoading(false);
            this.startCameraBtn.style.display = 'block';
        }
    }

    async initializeFaceMesh() {
        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults((results) => this.onFaceDetection(results));
    }

    async startCamera() {
        const constraints = {
            video: {
                facingMode: this.currentFacingMode,
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = stream;
        
        return new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                
                this.camera = new Camera(this.video, {
                    onFrame: async () => {
                        await this.faceMesh.send({ image: this.video });
                    },
                    width: 640,
                    height: 480
                });
                
                this.camera.start();
                resolve();
            };
        });
    }

    async toggleCamera() {
        if (!this.isInitialized) return;
        
        // Stop current camera
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        // Toggle facing mode
        this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Restart camera with new facing mode
        try {
            await this.startCamera();
        } catch (error) {
            console.error('Error toggling camera:', error);
            // Fallback to original facing mode
            this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
            await this.startCamera();
        }
    }

    onFaceDetection(results) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw video frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            this.applyFilter(landmarks);
        }
    }

    applyFilter(landmarks) {
        switch (this.currentFilter) {
            case 'sunglasses':
                this.drawSunglasses(landmarks);
                break;
            case 'mustache':
                this.drawMustache(landmarks);
                break;
            case 'dogears':
                this.drawDogEars(landmarks);
                break;
            case 'crown':
                this.drawCrown(landmarks);
                break;
            case 'heart-eyes':
                this.drawHeartEyes(landmarks);
                break;
            case 'rainbow':
                this.drawRainbow(landmarks);
                break;
            case 'party':
                this.drawPartyHat(landmarks);
                break;
            case 'cowboy':
                this.drawCowboyHat(landmarks);
                break;
            case 'cigar':
                this.drawCigar(landmarks);
                break;
            case 'beret':
                this.drawBeret(landmarks);
                break;
            case 'viking':
                this.drawVikingHelmet(landmarks);
                break;
            case 'pirate':
                this.drawPirateHat(landmarks);
                break;
            case 'crazy-face':
                this.drawCrazyFace(landmarks);
                break;
            case 'hijab':
                this.drawHijab(landmarks);
                break;
            case 'pilot':
                this.drawPilotMask(landmarks);
                break;
            case 'angry':
                this.drawAngryFace(landmarks);
                break;
            case 'army':
                this.drawArmyGear(landmarks);
                break;
            case 'medieval':
                this.drawMedievalKnight(landmarks);
                break;
            case 'alien':
                this.drawAlienInvasion(landmarks);
                break;
            case 'zombie':
                this.drawZombieOutbreak(landmarks);
                break;
            case 'cyborg':
                this.drawCyborgFuture(landmarks);
                break;
            case 'disco':
                this.drawDiscoFever(landmarks);
                break;
            case 'mime':
                this.drawMimePerformance(landmarks);
                break;
            case 'dragon':
                this.drawDragonLord(landmarks);
                break;
            case 'magician':
                this.drawMagicShow(landmarks);
                break;
            case 'underwater':
                this.drawUnderwaterDiver(landmarks);
                break;
            case 'rockstar':
                this.drawRockStar(landmarks);
                break;
            case 'chef':
                this.drawChefMaster(landmarks);
                break;
            case 'realistic-beard':
                this.drawRealisticBeard(landmarks);
                break;
            case 'makeup-glam':
                this.drawMakeupGlam(landmarks);
                break;
            case 'battle-scars':
                this.drawBattleScars(landmarks);
                break;
            case 'aging-time':
                this.drawAgingEffect(landmarks);
                break;
            case 'face-tattoos':
                this.drawFaceTattoos(landmarks);
                break;
            case 'snow-effect':
                this.drawSnowEffect(landmarks);
                break;
            case 'golden-hour':
                this.drawGoldenHour(landmarks);
                break;
            case 'cyberpunk-neon':
                this.drawCyberpunkNeon(landmarks);
                break;
            case 'vintage-film':
                this.drawVintageFilm(landmarks);
                break;
            case 'rain-glass':
                this.drawRainGlass(landmarks);
                break;
        }
    }

    drawSunglasses(landmarks) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const glassesWidth = eyeDistance * 1.5;
        const glassesHeight = eyeDistance * 0.6;
        
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        
        // Left lens
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y, glassesWidth * 0.25, glassesHeight * 0.4, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right lens
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x, rightEye.y, glassesWidth * 0.25, glassesHeight * 0.4, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Bridge
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x + glassesWidth * 0.25, leftEye.y);
        this.ctx.lineTo(rightEye.x - glassesWidth * 0.25, rightEye.y);
        this.ctx.stroke();
    }

    drawMustache(landmarks) {
        const nose = this.getLandmarkPoint(landmarks, 2);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        
        const mustacheY = nose.y + (mouth.y - nose.y) * 0.3;
        const mustacheWidth = Math.abs(this.getLandmarkPoint(landmarks, 61).x - this.getLandmarkPoint(landmarks, 291).x) * 1.2;
        
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.ellipse(nose.x, mustacheY, mustacheWidth * 0.5, mustacheWidth * 0.15, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Add mustache curves
        this.ctx.beginPath();
        this.ctx.ellipse(nose.x - mustacheWidth * 0.3, mustacheY - mustacheWidth * 0.05, mustacheWidth * 0.2, mustacheWidth * 0.1, -0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(nose.x + mustacheWidth * 0.3, mustacheY - mustacheWidth * 0.05, mustacheWidth * 0.2, mustacheWidth * 0.1, 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawDogEars(landmarks) {
        const leftEar = this.getLandmarkPoint(landmarks, 127);
        const rightEar = this.getLandmarkPoint(landmarks, 356);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        const earSize = Math.abs(rightEar.x - leftEar.x) * 0.4;
        
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        // Left ear
        this.ctx.beginPath();
        this.ctx.ellipse(leftEar.x - earSize * 0.5, forehead.y - earSize * 0.3, earSize * 0.6, earSize * 0.8, -0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right ear
        this.ctx.beginPath();
        this.ctx.ellipse(rightEar.x + earSize * 0.5, forehead.y - earSize * 0.3, earSize * 0.6, earSize * 0.8, 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Inner ears
        this.ctx.fillStyle = '#FFB6C1';
        this.ctx.beginPath();
        this.ctx.ellipse(leftEar.x - earSize * 0.5, forehead.y - earSize * 0.2, earSize * 0.3, earSize * 0.4, -0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(rightEar.x + earSize * 0.5, forehead.y - earSize * 0.2, earSize * 0.3, earSize * 0.4, 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawCrown(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const crownWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.2;
        const crownHeight = crownWidth * 0.4;
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 3;
        
        // Crown base
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - crownWidth * 0.5, forehead.y - crownHeight * 0.8, crownWidth, crownHeight * 0.3);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Crown points
        const points = 5;
        for (let i = 0; i < points; i++) {
            const x = forehead.x - crownWidth * 0.5 + (crownWidth / points) * (i + 0.5);
            const height = i % 2 === 0 ? crownHeight * 0.6 : crownHeight * 0.4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x - crownWidth / points * 0.4, forehead.y - crownHeight * 0.5);
            this.ctx.lineTo(x, forehead.y - height);
            this.ctx.lineTo(x + crownWidth / points * 0.4, forehead.y - crownHeight * 0.5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Gems
        this.ctx.fillStyle = '#FF0000';
        for (let i = 0; i < 3; i++) {
            const x = forehead.x - crownWidth * 0.3 + (crownWidth * 0.6 / 2) * i;
            this.ctx.beginPath();
            this.ctx.arc(x, forehead.y - crownHeight * 0.65, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawHeartEyes(landmarks) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        
        const heartSize = Math.abs(rightEye.x - leftEye.x) * 0.15;
        
        this.ctx.fillStyle = '#FF69B4';
        
        // Left heart eye
        this.drawHeart(leftEye.x, leftEye.y, heartSize);
        
        // Right heart eye
        this.drawHeart(rightEye.x, rightEye.y, heartSize);
    }

    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size * 0.3);
        this.ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
        this.ctx.bezierCurveTo(x - size * 0.5, y + size * 0.7, x, y + size * 1.2, x, y + size * 1.2);
        this.ctx.bezierCurveTo(x, y + size * 1.2, x + size * 0.5, y + size * 0.7, x + size * 0.5, y + size * 0.3);
        this.ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
        this.ctx.fill();
    }

    drawRainbow(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const rainbowWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.3;
        const rainbowHeight = rainbowWidth * 0.3;
        
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        
        this.ctx.lineWidth = 8;
        
        for (let i = 0; i < colors.length; i++) {
            this.ctx.strokeStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.arc(forehead.x, forehead.y + rainbowHeight * 0.5, rainbowWidth * 0.5 - i * 8, Math.PI, 0);
            this.ctx.stroke();
        }
    }

    drawPartyHat(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const hatWidth = Math.abs(rightTemple.x - leftTemple.x) * 0.8;
        const hatHeight = hatWidth * 1.2;
        
        // Hat body
        this.ctx.fillStyle = '#FF69B4';
        this.ctx.strokeStyle = '#FF1493';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - hatWidth * 0.5, forehead.y);
        this.ctx.lineTo(forehead.x + hatWidth * 0.5, forehead.y);
        this.ctx.lineTo(forehead.x, forehead.y - hatHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Polka dots
        this.ctx.fillStyle = '#FFFF00';
        for (let i = 0; i < 6; i++) {
            const x = forehead.x - hatWidth * 0.3 + Math.random() * hatWidth * 0.6;
            const y = forehead.y - Math.random() * hatHeight * 0.8;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Pom pom
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, forehead.y - hatHeight, 12, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawCowboyHat(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const hatWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.4;
        const hatHeight = hatWidth * 0.6;
        const brimWidth = hatWidth * 1.6;
        
        // Hat brim
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - hatHeight * 0.2, brimWidth * 0.5, brimWidth * 0.15, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Hat crown
        this.ctx.fillStyle = '#A0522D';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - hatHeight * 0.5, hatWidth * 0.4, hatHeight * 0.4, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Hat band
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - hatWidth * 0.4, forehead.y - hatHeight * 0.3, hatWidth * 0.8, hatHeight * 0.1);
        this.ctx.fill();
        
        // Hat buckle
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - hatWidth * 0.05, forehead.y - hatHeight * 0.28, hatWidth * 0.1, hatHeight * 0.06);
        this.ctx.fill();
    }

    drawCigar(landmarks) {
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const leftMouth = this.getLandmarkPoint(landmarks, 61);
        const rightMouth = this.getLandmarkPoint(landmarks, 291);
        
        const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
        const cigarLength = mouthWidth * 1.5;
        const cigarThickness = mouthWidth * 0.15;
        
        // Cigar body
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.rect(mouth.x + mouthWidth * 0.3, mouth.y - cigarThickness * 0.5, cigarLength, cigarThickness);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cigar bands
        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 2; i++) {
            const x = mouth.x + mouthWidth * 0.3 + cigarLength * (0.3 + i * 0.3);
            this.ctx.beginPath();
            this.ctx.rect(x, mouth.y - cigarThickness * 0.5, cigarLength * 0.1, cigarThickness);
            this.ctx.fill();
        }
        
        // Cigar tip (lit end)
        this.ctx.fillStyle = '#FF4500';
        this.ctx.beginPath();
        this.ctx.arc(mouth.x + mouthWidth * 0.3 + cigarLength, mouth.y, cigarThickness * 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Smoke
        this.ctx.strokeStyle = '#D3D3D3';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            const startX = mouth.x + mouthWidth * 0.3 + cigarLength + 10;
            const startY = mouth.y + (i - 1) * 5;
            this.ctx.moveTo(startX, startY);
            this.ctx.quadraticCurveTo(startX + 20 + i * 10, startY - 20, startX + 40 + i * 15, startY - 40);
            this.ctx.stroke();
        }
    }

    drawBeret(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const beretWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.3;
        const beretHeight = beretWidth * 0.4;
        
        // Beret main body
        this.ctx.fillStyle = '#8B0000';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - beretHeight * 0.5, beretWidth * 0.6, beretHeight * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Beret band
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - beretHeight * 0.1, beretWidth * 0.45, beretHeight * 0.15, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Beret stem (little thing on top)
        this.ctx.fillStyle = '#8B0000';
        this.ctx.beginPath();
        this.ctx.arc(forehead.x + beretWidth * 0.2, forehead.y - beretHeight * 0.8, 6, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawVikingHelmet(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const helmetWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.2;
        const helmetHeight = helmetWidth * 0.8;
        
        // Helmet main body
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, forehead.y - helmetHeight * 0.3, helmetWidth * 0.5, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet nose guard
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - helmetWidth * 0.05, forehead.y - helmetHeight * 0.2, helmetWidth * 0.1, helmetHeight * 0.4);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Viking horns
        this.ctx.fillStyle = '#F5DEB3';
        this.ctx.strokeStyle = '#D2B48C';
        this.ctx.lineWidth = 2;
        
        // Left horn
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - helmetWidth * 0.35, forehead.y - helmetHeight * 0.4);
        this.ctx.quadraticCurveTo(forehead.x - helmetWidth * 0.5, forehead.y - helmetHeight * 0.8, forehead.x - helmetWidth * 0.4, forehead.y - helmetHeight * 1.1);
        this.ctx.quadraticCurveTo(forehead.x - helmetWidth * 0.3, forehead.y - helmetHeight * 0.9, forehead.x - helmetWidth * 0.25, forehead.y - helmetHeight * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right horn
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x + helmetWidth * 0.35, forehead.y - helmetHeight * 0.4);
        this.ctx.quadraticCurveTo(forehead.x + helmetWidth * 0.5, forehead.y - helmetHeight * 0.8, forehead.x + helmetWidth * 0.4, forehead.y - helmetHeight * 1.1);
        this.ctx.quadraticCurveTo(forehead.x + helmetWidth * 0.3, forehead.y - helmetHeight * 0.9, forehead.x + helmetWidth * 0.25, forehead.y - helmetHeight * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawPirateHat(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        const hatWidth = Math.abs(rightTemple.x - leftTemple.x) * 1.1;
        const hatHeight = hatWidth * 0.8;
        
        // Pirate hat main body (tricorn style)
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - hatWidth * 0.5, forehead.y);
        this.ctx.quadraticCurveTo(forehead.x - hatWidth * 0.3, forehead.y - hatHeight * 0.6, forehead.x, forehead.y - hatHeight * 0.8);
        this.ctx.quadraticCurveTo(forehead.x + hatWidth * 0.3, forehead.y - hatHeight * 0.6, forehead.x + hatWidth * 0.5, forehead.y);
        this.ctx.quadraticCurveTo(forehead.x, forehead.y + hatHeight * 0.1, forehead.x - hatWidth * 0.5, forehead.y);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Skull and crossbones
        this.ctx.fillStyle = '#FFFFFF';
        
        // Skull
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, forehead.y - hatHeight * 0.4, hatWidth * 0.08, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Eye sockets
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(forehead.x - hatWidth * 0.03, forehead.y - hatHeight * 0.45, hatWidth * 0.015, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(forehead.x + hatWidth * 0.03, forehead.y - hatHeight * 0.45, hatWidth * 0.015, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Crossbones
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        // First bone
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - hatWidth * 0.06, forehead.y - hatHeight * 0.25);
        this.ctx.lineTo(forehead.x + hatWidth * 0.06, forehead.y - hatHeight * 0.35);
        this.ctx.stroke();
        
        // Second bone
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - hatWidth * 0.06, forehead.y - hatHeight * 0.35);
        this.ctx.lineTo(forehead.x + hatWidth * 0.06, forehead.y - hatHeight * 0.25);
        this.ctx.stroke();
        
        // Bone ends
        this.ctx.fillStyle = '#FFFFFF';
        const boneEndPositions = [
            {x: forehead.x - hatWidth * 0.06, y: forehead.y - hatHeight * 0.25},
            {x: forehead.x + hatWidth * 0.06, y: forehead.y - hatHeight * 0.35},
            {x: forehead.x - hatWidth * 0.06, y: forehead.y - hatHeight * 0.35},
            {x: forehead.x + hatWidth * 0.06, y: forehead.y - hatHeight * 0.25}
        ];
        
        boneEndPositions.forEach(pos => {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, hatWidth * 0.01, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Eye patch
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const patchSize = eyeDistance * 0.4;
        
        // Eye patch main body (over left eye)
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y, patchSize * 0.8, patchSize * 0.6, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Eye patch strap
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        // Strap going around the head
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x - patchSize * 0.8, leftEye.y);
        this.ctx.quadraticCurveTo(leftEye.x - patchSize * 1.5, leftEye.y - patchSize * 0.3, leftEye.x - patchSize * 2, leftEye.y - patchSize * 0.1);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x + patchSize * 0.8, leftEye.y);
        this.ctx.quadraticCurveTo(leftEye.x + patchSize * 1.5, leftEye.y - patchSize * 0.3, leftEye.x + patchSize * 2, leftEye.y - patchSize * 0.1);
        this.ctx.stroke();
        
        // Eye patch highlight for 3D effect
        this.ctx.fillStyle = '#333333';
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x - patchSize * 0.2, leftEye.y - patchSize * 0.2, patchSize * 0.3, patchSize * 0.2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawCrazyFace(landmarks) {
        // Get the current video frame data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Create a new image data for the distorted version
        const distortedImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const distortedData = distortedImageData.data;
        
        // Get key face landmarks
        const nose = this.getLandmarkPoint(landmarks, 1);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const chin = this.getLandmarkPoint(landmarks, 175);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        // Calculate face center and dimensions
        const faceCenter = {
            x: (leftEye.x + rightEye.x) / 2,
            y: (forehead.y + chin.y) / 2
        };
        
        const faceWidth = Math.abs(rightEye.x - leftEye.x) * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Animation time for dynamic effects - MUCH FASTER AND CRAZIER!
        const time = Date.now() * 0.008; // Increased speed!
        const crazyTime = Date.now() * 0.015; // Even faster for some effects!
        
        // Apply EXTREME crazy distortions
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let sourceX = x;
                let sourceY = y;
                
                // Calculate distance from face center
                const dx = x - faceCenter.x;
                const dy = y - faceCenter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                
                // Only apply distortions within face area
                if (distance < faceWidth * 1.2) { // Expanded area!
                    
                    // 1. MEGA SWIRL effect around nose - MUCH STRONGER!
                    const noseDx = x - nose.x;
                    const noseDy = y - nose.y;
                    const noseDistance = Math.sqrt(noseDx * noseDx + noseDy * noseDy);
                    if (noseDistance < faceWidth * 0.4) {
                        const swirlStrength = (1 - noseDistance / (faceWidth * 0.4)) * 2.5; // MUCH STRONGER!
                        const swirlAngle = angle + swirlStrength * Math.sin(crazyTime * 4) * Math.cos(time * 3);
                        sourceX = nose.x + Math.cos(swirlAngle) * noseDistance * (1 + Math.sin(time * 6) * 0.5);
                        sourceY = nose.y + Math.sin(swirlAngle) * noseDistance * (1 + Math.cos(time * 5) * 0.5);
                    }
                    
                    // 2. EXTREME bulge effect around eyes - PULSATING MADNESS!
                    const leftEyeDist = Math.sqrt((x - leftEye.x) ** 2 + (y - leftEye.y) ** 2);
                    const rightEyeDist = Math.sqrt((x - rightEye.x) ** 2 + (y - rightEye.y) ** 2);
                    
                    if (leftEyeDist < faceWidth * 0.25) {
                        const bulgeStrength = (1 - leftEyeDist / (faceWidth * 0.25)) * 50 * Math.sin(crazyTime * 8) * Math.cos(time * 4);
                        const eyeAngle = Math.atan2(y - leftEye.y, x - leftEye.x);
                        sourceX += Math.cos(eyeAngle) * bulgeStrength;
                        sourceY += Math.sin(eyeAngle) * bulgeStrength;
                    }
                    
                    if (rightEyeDist < faceWidth * 0.25) {
                        const bulgeStrength = (1 - rightEyeDist / (faceWidth * 0.25)) * 50 * Math.sin(crazyTime * 8 + Math.PI) * Math.sin(time * 6);
                        const eyeAngle = Math.atan2(y - rightEye.y, x - rightEye.x);
                        sourceX += Math.cos(eyeAngle) * bulgeStrength;
                        sourceY += Math.sin(eyeAngle) * bulgeStrength;
                    }
                    
                    // 3. INSANE mouth stretch effect - ELASTIC MADNESS!
                    const mouthDist = Math.sqrt((x - mouth.x) ** 2 + (y - mouth.y) ** 2);
                    if (mouthDist < faceWidth * 0.3) {
                        const stretchStrength = (1 - mouthDist / (faceWidth * 0.3)) * 40 * Math.sin(crazyTime * 10);
                        sourceX += (x - mouth.x) * stretchStrength * 0.03 * Math.cos(time * 7);
                        sourceY += Math.sin(crazyTime * 12) * 25 * Math.cos(x * 0.05);
                    }
                    
                    // 4. CHAOTIC wave distortion - MULTIPLE WAVES!
                    const waveStrength = (1 - distance / (faceWidth * 1.2)) * 20;
                    sourceX += Math.sin(y * 0.03 + crazyTime * 5) * waveStrength * Math.cos(time * 3);
                    sourceY += Math.cos(x * 0.03 + crazyTime * 4) * waveStrength * Math.sin(time * 4);
                    sourceX += Math.sin(y * 0.01 + time * 8) * waveStrength * 0.5;
                    sourceY += Math.cos(x * 0.01 + time * 6) * waveStrength * 0.5;
                    
                    // 5. EXTREME pinch/expand effect - BREATHING FACE!
                    const centerEffect = Math.sin(crazyTime * 3) * 0.4 + Math.cos(time * 5) * 0.3;
                    const distortionFactor = 1 + centerEffect * (1 - distance / (faceWidth * 1.2));
                    sourceX = faceCenter.x + (sourceX - faceCenter.x) * distortionFactor;
                    sourceY = faceCenter.y + (sourceY - faceCenter.y) * distortionFactor;
                    
                    // 6. NEW! KALEIDOSCOPE effect!
                    const kaleidoAngle = Math.atan2(dy, dx);
                    const kaleidoRadius = distance;
                    const segments = 6;
                    const segmentAngle = (2 * Math.PI) / segments;
                    const normalizedAngle = ((kaleidoAngle % segmentAngle) + segmentAngle) % segmentAngle;
                    if (Math.sin(time * 4) > 0.5) {
                        const newAngle = normalizedAngle + Math.sin(crazyTime * 6) * 0.5;
                        sourceX = faceCenter.x + Math.cos(newAngle) * kaleidoRadius;
                        sourceY = faceCenter.y + Math.sin(newAngle) * kaleidoRadius;
                    }
                    
                    // 7. NEW! FRACTAL ZOOM effect!
                    if (Math.cos(time * 2) > 0.3) {
                        const fractalScale = 1 + Math.sin(crazyTime * 7) * 0.8;
                        const fractalX = faceCenter.x + (sourceX - faceCenter.x) * fractalScale;
                        const fractalY = faceCenter.y + (sourceY - faceCenter.y) * fractalScale;
                        sourceX = fractalX;
                        sourceY = fractalY;
                    }
                }
                
                // Ensure source coordinates are within bounds
                sourceX = Math.max(0, Math.min(this.canvas.width - 1, Math.round(sourceX)));
                sourceY = Math.max(0, Math.min(this.canvas.height - 1, Math.round(sourceY)));
                
                // Copy pixel data with COLOR MADNESS!
                const targetIndex = (y * this.canvas.width + x) * 4;
                const sourceIndex = (sourceY * this.canvas.width + sourceX) * 4;
                
                // CRAZY COLOR EFFECTS!
                const colorShift = Math.sin(crazyTime * 10 + x * 0.02 + y * 0.02) * 100;
                const redShift = Math.sin(time * 8 + distance * 0.01) * 50;
                const greenShift = Math.cos(time * 6 + angle) * 50;
                const blueShift = Math.sin(time * 12 + distance * 0.02) * 50;
                
                distortedData[targetIndex] = Math.max(0, Math.min(255, data[sourceIndex] + redShift + colorShift));         // Red
                distortedData[targetIndex + 1] = Math.max(0, Math.min(255, data[sourceIndex + 1] + greenShift - colorShift * 0.5)); // Green
                distortedData[targetIndex + 2] = Math.max(0, Math.min(255, data[sourceIndex + 2] + blueShift + colorShift * 0.3)); // Blue
                distortedData[targetIndex + 3] = data[sourceIndex + 3]; // Alpha
            }
        }
        
        // Apply the distorted image
        this.ctx.putImageData(distortedImageData, 0, 0);
        
        // Add EVEN MORE crazy visual effects on top
        this.addUltraCrazyEffects(landmarks, time, crazyTime);
    }
    
    addUltraCrazyEffects(landmarks, time, crazyTime) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const chin = this.getLandmarkPoint(landmarks, 175);
        
        // MEGA CRAZY spinning eyes - MUCH MORE INTENSE!
        this.ctx.strokeStyle = `hsl(${(crazyTime * 100) % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 5;
        
        for (let i = 0; i < 16; i++) { // DOUBLED the spirals!
            const angle = (crazyTime * 15 + i * Math.PI / 8);
            const radius = 25 + Math.sin(crazyTime * 8) * 15;
            const pulseRadius = radius * (1 + Math.sin(time * 12 + i) * 0.5);
            
            // Left eye MEGA spirals
            this.ctx.beginPath();
            this.ctx.moveTo(leftEye.x, leftEye.y);
            this.ctx.lineTo(
                leftEye.x + Math.cos(angle) * pulseRadius,
                leftEye.y + Math.sin(angle) * pulseRadius
            );
            this.ctx.stroke();
            
            // Right eye MEGA spirals
            this.ctx.beginPath();
            this.ctx.moveTo(rightEye.x, rightEye.y);
            this.ctx.lineTo(
                rightEye.x + Math.cos(-angle * 1.5) * pulseRadius,
                rightEye.y + Math.sin(-angle * 1.5) * pulseRadius
            );
            this.ctx.stroke();
        }
        
        // INSANE mouth effects - ELECTRIC CHAOS!
        this.ctx.strokeStyle = `hsl(${(time * 200) % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 12; i++) { // MORE mouth lines!
            const offset = Math.sin(crazyTime * 12 + i) * 40;
            const verticalOffset = Math.cos(time * 8 + i) * 30;
            this.ctx.beginPath();
            this.ctx.moveTo(mouth.x - 60 + i * 10, mouth.y);
            this.ctx.lineTo(mouth.x - 60 + i * 10 + offset, mouth.y + offset + verticalOffset);
            this.ctx.stroke();
        }
        
        // MEGA floating particles around face - PARTICLE STORM!
        for (let i = 0; i < 25; i++) { // MORE PARTICLES!
            const particleAngle = crazyTime * 5 + i * Math.PI / 12.5;
            const particleRadius = 100 + Math.sin(crazyTime * 6 + i) * 60;
            const particleX = nose.x + Math.cos(particleAngle) * particleRadius;
            const particleY = nose.y + Math.sin(particleAngle) * particleRadius;
            const particleSize = 5 + Math.sin(crazyTime * 15 + i) * 4;
            
            this.ctx.fillStyle = `hsl(${(crazyTime * 50 + i * 15) % 360}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, particleSize, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Add particle trails!
            this.ctx.strokeStyle = `hsl(${(crazyTime * 50 + i * 15) % 360}, 100%, 30%)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(particleX, particleY);
            this.ctx.lineTo(
                particleX - Math.cos(particleAngle) * 20,
                particleY - Math.sin(particleAngle) * 20
            );
            this.ctx.stroke();
        }
        
        // NEW! LIGHTNING BOLTS around face!
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = '#FFFF00';
        this.ctx.shadowBlur = 10;
        
        for (let i = 0; i < 8; i++) {
            if (Math.sin(crazyTime * 20 + i) > 0.7) {
                const startAngle = (i * Math.PI / 4) + Math.sin(time * 10) * 0.5;
                const startX = nose.x + Math.cos(startAngle) * 80;
                const startY = nose.y + Math.sin(startAngle) * 80;
                const endX = nose.x + Math.cos(startAngle) * 150;
                const endY = nose.y + Math.sin(startAngle) * 150;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                // Zigzag lightning effect
                for (let j = 0; j < 5; j++) {
                    const progress = j / 4;
                    const x = startX + (endX - startX) * progress + Math.sin(crazyTime * 30 + j) * 15;
                    const y = startY + (endY - startY) * progress + Math.cos(crazyTime * 25 + j) * 15;
                    this.ctx.lineTo(x, y);
                }
                this.ctx.stroke();
            }
        }
        this.ctx.shadowBlur = 0;
        
        // NEW! CRAZY GEOMETRIC SHAPES!
        this.ctx.strokeStyle = `hsl(${(time * 300) % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 3;
        
        // Rotating triangles around eyes
        for (let i = 0; i < 6; i++) {
            const triangleAngle = crazyTime * 8 + i * Math.PI / 3;
            const triangleSize = 20 + Math.sin(time * 10 + i) * 10;
            
            // Left eye triangles
            this.ctx.beginPath();
            for (let j = 0; j < 3; j++) {
                const pointAngle = triangleAngle + j * (2 * Math.PI / 3);
                const x = leftEye.x + Math.cos(pointAngle) * triangleSize;
                const y = leftEye.y + Math.sin(pointAngle) * triangleSize;
                if (j === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            
            // Right eye triangles
            this.ctx.beginPath();
            for (let j = 0; j < 3; j++) {
                const pointAngle = -triangleAngle + j * (2 * Math.PI / 3);
                const x = rightEye.x + Math.cos(pointAngle) * triangleSize;
                const y = rightEye.y + Math.sin(pointAngle) * triangleSize;
                if (j === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
        
        // NEW! PULSATING CIRCLES OF MADNESS!
        for (let i = 0; i < 5; i++) {
            const circleRadius = 30 + i * 20 + Math.sin(crazyTime * 6 + i) * 15;
            this.ctx.strokeStyle = `hsl(${(crazyTime * 80 + i * 72) % 360}, 100%, 50%)`;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(nose.x, nose.y, circleRadius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // ULTRA CRAZY text overlay - MULTIPLE TEXTS!
        const crazyTexts = ['DINGUE!', 'FOLIE!', 'MALADE!', 'OUFFF!'];
        
        for (let i = 0; i < crazyTexts.length; i++) {
            this.ctx.font = `bold ${20 + Math.sin(crazyTime * 8 + i) * 10}px Arial`;
            this.ctx.fillStyle = `hsl(${(crazyTime * 150 + i * 90) % 360}, 100%, 50%)`;
            this.ctx.strokeStyle = `hsl(${(crazyTime * 150 + i * 90 + 180) % 360}, 100%, 50%)`;
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'center';
            
            const textAngle = (crazyTime * 3 + i * Math.PI / 2);
            const textRadius = 120 + Math.sin(time * 5 + i) * 30;
            const textX = nose.x + Math.cos(textAngle) * textRadius;
            const textY = nose.y + Math.sin(textAngle) * textRadius;
            
            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.rotate(crazyTime * 5 + i);
            this.ctx.strokeText(crazyTexts[i], 0, 0);
            this.ctx.fillText(crazyTexts[i], 0, 0);
            this.ctx.restore();
        }
        
        // NEW! SCREEN SHAKE EFFECT!
        if (Math.sin(crazyTime * 20) > 0.8) {
            const shakeX = Math.sin(crazyTime * 50) * 5;
            const shakeY = Math.cos(crazyTime * 60) * 5;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
            // The shake effect is applied to subsequent drawings
            this.ctx.restore();
        }
        
        // NEW! RAINBOW TRAILS!
        this.ctx.strokeStyle = `hsl(${(crazyTime * 200) % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x, forehead.y);
            this.ctx.quadraticCurveTo(
                nose.x + Math.sin(crazyTime * 4 + i) * 50,
                nose.y + Math.cos(crazyTime * 3 + i) * 30,
                chin.x + Math.sin(crazyTime * 5 + i) * 40,
                chin.y
            );
            this.ctx.stroke();
        }
    }

    drawHijab(landmarks) {
        // Get key face landmarks for hijab positioning
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const chin = this.getLandmarkPoint(landmarks, 175);
        const jawLeft = this.getLandmarkPoint(landmarks, 172);
        const jawRight = this.getLandmarkPoint(landmarks, 397);
        
        // Calculate hijab dimensions based on face size
        const faceWidth = Math.abs(rightTemple.x - leftTemple.x);
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Hijab colors - elegant and common colors
        const hijabColor = '#2C5F41'; // Deep green
        const borderColor = '#1A4B33'; // Darker green for border
        const patternColor = '#4A7C59'; // Lighter green for pattern
        
        // Set drawing style
        this.ctx.fillStyle = hijabColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 2;
        
        // Draw hijab in sections to avoid covering the face
        
        // 1. TOP SECTION - Over the head/forehead area
        this.ctx.beginPath();
        this.ctx.moveTo(leftTemple.x - faceWidth * 0.4, forehead.y - faceHeight * 0.05);
        
        // Top curve over the head
        this.ctx.quadraticCurveTo(
            leftTemple.x - faceWidth * 0.2, 
            forehead.y - faceHeight * 0.8,
            forehead.x - faceWidth * 0.1, 
            forehead.y - faceHeight * 1.0
        );
        
        this.ctx.quadraticCurveTo(
            forehead.x, 
            forehead.y - faceHeight * 1.1,
            forehead.x + faceWidth * 0.1, 
            forehead.y - faceHeight * 1.0
        );
        
        this.ctx.quadraticCurveTo(
            rightTemple.x + faceWidth * 0.2, 
            forehead.y - faceHeight * 0.8,
            rightTemple.x + faceWidth * 0.4, 
            forehead.y - faceHeight * 0.05
        );
        
        // Connect to forehead area but don't cover face
        this.ctx.lineTo(rightTemple.x + faceWidth * 0.1, forehead.y - faceHeight * 0.1);
        this.ctx.quadraticCurveTo(
            forehead.x + faceWidth * 0.05, 
            forehead.y - faceHeight * 0.15,
            forehead.x, 
            forehead.y - faceHeight * 0.18
        );
        this.ctx.quadraticCurveTo(
            forehead.x - faceWidth * 0.05, 
            forehead.y - faceHeight * 0.15,
            leftTemple.x - faceWidth * 0.1, 
            leftTemple.y - faceHeight * 0.1
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // 2. LEFT SIDE SECTION
        this.ctx.beginPath();
        this.ctx.moveTo(leftTemple.x - faceWidth * 0.4, forehead.y - faceHeight * 0.05);
        this.ctx.lineTo(leftTemple.x - faceWidth * 0.1, forehead.y - faceHeight * 0.1);
        this.ctx.lineTo(leftCheek.x - faceWidth * 0.15, leftCheek.y + faceHeight * 0.1);
        this.ctx.lineTo(leftCheek.x - faceWidth * 0.25, leftCheek.y + faceHeight * 0.2);
        
        // Extend down to shoulder
        this.ctx.lineTo(leftCheek.x - faceWidth * 0.3, chin.y + faceHeight * 0.8);
        this.ctx.quadraticCurveTo(
            forehead.x - faceWidth * 0.5, 
            chin.y + faceHeight * 1.2,
            forehead.x - faceWidth * 0.2, 
            chin.y + faceHeight * 1.0
        );
        this.ctx.lineTo(jawLeft.x - faceWidth * 0.1, chin.y + faceHeight * 0.3);
        this.ctx.quadraticCurveTo(
            leftCheek.x - faceWidth * 0.05, 
            leftCheek.y + faceHeight * 0.15,
            leftTemple.x - faceWidth * 0.35, 
            leftTemple.y - faceHeight * 0.02
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // 3. RIGHT SIDE SECTION
        this.ctx.beginPath();
        this.ctx.moveTo(rightTemple.x + faceWidth * 0.4, forehead.y - faceHeight * 0.05);
        this.ctx.lineTo(rightTemple.x + faceWidth * 0.1, forehead.y - faceHeight * 0.1);
        this.ctx.lineTo(rightCheek.x + faceWidth * 0.15, rightCheek.y + faceHeight * 0.1);
        this.ctx.lineTo(rightCheek.x + faceWidth * 0.25, rightCheek.y + faceHeight * 0.2);
        
        // Extend down to shoulder
        this.ctx.lineTo(rightCheek.x + faceWidth * 0.3, chin.y + faceHeight * 0.8);
        this.ctx.quadraticCurveTo(
            forehead.x + faceWidth * 0.5, 
            chin.y + faceHeight * 1.2,
            forehead.x + faceWidth * 0.2, 
            chin.y + faceHeight * 1.0
        );
        this.ctx.lineTo(jawRight.x + faceWidth * 0.1, chin.y + faceHeight * 0.3);
        this.ctx.quadraticCurveTo(
            rightCheek.x + faceWidth * 0.05, 
            rightCheek.y + faceHeight * 0.15,
            rightTemple.x + faceWidth * 0.35, 
            rightTemple.y - faceHeight * 0.02
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // 4. BOTTOM SECTION - Under chin/neck area
        this.ctx.beginPath();
        this.ctx.moveTo(jawLeft.x - faceWidth * 0.1, chin.y + faceHeight * 0.3);
        this.ctx.lineTo(forehead.x - faceWidth * 0.2, chin.y + faceHeight * 1.0);
        this.ctx.quadraticCurveTo(
            forehead.x, 
            chin.y + faceHeight * 1.1,
            forehead.x + faceWidth * 0.2, 
            chin.y + faceHeight * 1.0
        );
        this.ctx.lineTo(jawRight.x + faceWidth * 0.1, chin.y + faceHeight * 0.3);
        this.ctx.quadraticCurveTo(
            forehead.x, 
            chin.y + faceHeight * 0.5,
            jawLeft.x - faceWidth * 0.1, 
            chin.y + faceHeight * 0.3
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Add subtle pattern/texture to the hijab (only on top section)
        this.ctx.strokeStyle = patternColor;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.4;
        
        // Delicate geometric pattern on the top section
        for (let i = 0; i < 5; i++) {
            const patternY = forehead.y - faceHeight * 0.9 + i * (faceHeight * 0.12);
            const patternWidth = faceWidth * (0.6 - i * 0.08);
            
            // Horizontal decorative lines
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x - patternWidth * 0.5, patternY);
            this.ctx.lineTo(forehead.x + patternWidth * 0.5, patternY);
            this.ctx.stroke();
            
            // Small decorative dots
            for (let j = -1; j <= 1; j++) {
                if (i % 2 === 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(
                        forehead.x + j * (patternWidth * 0.2), 
                        patternY - 6, 
                        1.5, 
                        0, 
                        2 * Math.PI
                    );
                    this.ctx.fill();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
        
        // Add decorative border around face opening
        this.ctx.strokeStyle = '#FFD700'; // Gold border
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(leftCheek.x - faceWidth * 0.15, leftCheek.y + faceHeight * 0.1);
        this.ctx.quadraticCurveTo(
            leftTemple.x - faceWidth * 0.05, 
            forehead.y - faceHeight * 0.05,
            forehead.x - faceWidth * 0.02, 
            forehead.y - faceHeight * 0.12
        );
        this.ctx.quadraticCurveTo(
            forehead.x, 
            forehead.y - faceHeight * 0.15,
            forehead.x + faceWidth * 0.02, 
            forehead.y - faceHeight * 0.12
        );
        this.ctx.quadraticCurveTo(
            rightTemple.x + faceWidth * 0.05, 
            forehead.y - faceHeight * 0.05,
            rightCheek.x + faceWidth * 0.15, 
            rightCheek.y + faceHeight * 0.1
        );
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
        
        // Add a small decorative pin
        this.ctx.fillStyle = '#FFD700'; // Gold color
        this.ctx.strokeStyle = '#B8860B'; // Darker gold
        this.ctx.lineWidth = 1;
        
        // Small decorative pin near the right temple
        const pinX = rightTemple.x + faceWidth * 0.08;
        const pinY = forehead.y - faceHeight * 0.08;
        
        this.ctx.beginPath();
        this.ctx.arc(pinX, pinY, 3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Small star pattern on the pin
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(pinX, pinY);
            this.ctx.lineTo(
                pinX + Math.cos(angle) * 2,
                pinY + Math.sin(angle) * 2
            );
            this.ctx.stroke();
        }
    }

    drawPilotMask(landmarks) {
        // First, draw the beautiful sky background everywhere
        this.drawFullSkyBackground();
        
        // Get key face landmarks for face boundary detection
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const chin = this.getLandmarkPoint(landmarks, 175);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        
        // Calculate face dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2.2; // A bit wider for natural look
        const faceHeight = Math.abs(chin.y - forehead.y) * 1.3; // A bit taller
        const faceCenterX = (leftEye.x + rightEye.x) / 2;
        const faceCenterY = (forehead.y + chin.y) / 2;
        
        // Create face cutout - draw the real video only in the face area
        this.drawFaceCutout(faceCenterX, faceCenterY, faceWidth, faceHeight);
        
        // Add subtle cockpit overlay elements
        this.drawCockpitOverlay();
        
        // Draw pilot helmet (adjusted to not cover face area)
        this.drawPilotHelmet(landmarks, faceWidth * 0.8, faceHeight * 0.8);
        
        // Draw aviation goggles
        this.drawAviationGoggles(landmarks, eyeDistance);
        
        // Draw oxygen mask (positioned below nose, smaller)
        this.drawOxygenMask(landmarks, faceWidth * 0.8);
        
        // Draw cockpit HUD elements
        this.drawCockpitHUD();
    }
    
    drawAviationBackground() {
        // Save current canvas state
        this.ctx.save();
        
        // Create sky gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at top
        gradient.addColorStop(0.7, '#B0E0E6'); // Lighter blue
        gradient.addColorStop(1, '#F0F8FF'); // Almost white at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw moving clouds
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 8; i++) {
            const cloudX = (this.canvas.width * 0.2 * i + time * 20 + i * 100) % (this.canvas.width + 200) - 100;
            const cloudY = this.canvas.height * 0.1 + Math.sin(time + i) * 20;
            
            // Draw fluffy cloud
            for (let j = 0; j < 5; j++) {
                const radius = 15 + j * 5 + Math.sin(time * 2 + i + j) * 3;
                const offsetX = j * 12 - 24;
                this.ctx.beginPath();
                this.ctx.arc(cloudX + offsetX, cloudY, radius, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Draw cockpit frame elements
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        
        // Top cockpit frame
        this.ctx.fillRect(0, 0, this.canvas.width, 40);
        
        // Side cockpit frames
        this.ctx.fillRect(0, 0, 60, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - 60, 0, 60, this.canvas.height);
        
        // Add cockpit window reflection
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(60, 40, this.canvas.width - 120, this.canvas.height * 0.3);
        
        this.ctx.restore();
    }
    
    drawPilotHelmet(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        // Helmet colors
        this.ctx.fillStyle = '#2F4F4F'; // Dark slate gray
        this.ctx.strokeStyle = '#1C1C1C';
        this.ctx.lineWidth = 2;
        
        // Main helmet shape
        this.ctx.beginPath();
        this.ctx.arc(
            forehead.x, 
            forehead.y - faceHeight * 0.3, 
            faceWidth * 0.65, 
            0.2 * Math.PI, 
            0.8 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet visor/peak
        this.ctx.fillStyle = '#1C1C1C';
        this.ctx.beginPath();
        this.ctx.ellipse(
            forehead.x, 
            forehead.y - faceHeight * 0.05, 
            faceWidth * 0.4, 
            faceHeight * 0.08, 
            0, 0, Math.PI
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet details and rivets
        this.ctx.fillStyle = '#708090';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + Math.PI / 6;
            const x = forehead.x + Math.cos(angle) * faceWidth * 0.5;
            const y = forehead.y - faceHeight * 0.3 + Math.sin(angle) * faceHeight * 0.25;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Helmet chin strap
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(leftTemple.x - faceWidth * 0.1, leftTemple.y + faceHeight * 0.3);
        this.ctx.quadraticCurveTo(
            forehead.x, 
            leftTemple.y + faceHeight * 0.5,
            rightTemple.x + faceWidth * 0.1, 
            rightTemple.y + faceHeight * 0.3
        );
        this.ctx.stroke();
    }
    
    drawAviationGoggles(landmarks, eyeDistance) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        
        const goggleSize = eyeDistance * 0.8;
        
        // Goggle frame
        this.ctx.fillStyle = '#8B4513'; // Brown leather
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        
        // Left goggle frame
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x, leftEye.y, goggleSize * 0.6, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right goggle frame
        this.ctx.beginPath();
        this.ctx.arc(rightEye.x, rightEye.y, goggleSize * 0.6, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Goggle lenses with reflection
        this.ctx.fillStyle = 'rgba(70, 130, 180, 0.8)'; // Steel blue with transparency
        
        // Left lens
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x, leftEye.y, goggleSize * 0.45, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right lens
        this.ctx.beginPath();
        this.ctx.arc(rightEye.x, rightEye.y, goggleSize * 0.45, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Lens reflections
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        // Left reflection
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x - goggleSize * 0.15, leftEye.y - goggleSize * 0.15, goggleSize * 0.15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right reflection
        this.ctx.beginPath();
        this.ctx.arc(rightEye.x - goggleSize * 0.15, rightEye.y - goggleSize * 0.15, goggleSize * 0.15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Nose bridge
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.rect(
            leftEye.x + goggleSize * 0.45, 
            leftEye.y - goggleSize * 0.1, 
            rightEye.x - leftEye.x - goggleSize * 0.9, 
            goggleSize * 0.2
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        // Goggle straps
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        // Left strap
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x - goggleSize * 0.6, leftEye.y);
        this.ctx.lineTo(leftEye.x - goggleSize * 1.2, leftEye.y);
        this.ctx.stroke();
        
        // Right strap
        this.ctx.beginPath();
        this.ctx.moveTo(rightEye.x + goggleSize * 0.6, rightEye.y);
        this.ctx.lineTo(rightEye.x + goggleSize * 1.2, rightEye.y);
        this.ctx.stroke();
    }
    
    drawOxygenMask(landmarks, faceWidth) {
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const leftMouth = this.getLandmarkPoint(landmarks, 61);
        const rightMouth = this.getLandmarkPoint(landmarks, 291);
        
        const maskWidth = Math.abs(rightMouth.x - leftMouth.x) * 1.4;
        const maskHeight = Math.abs(mouth.y - nose.y) * 1.8;
        
        // Oxygen mask body
        this.ctx.fillStyle = '#696969'; // Dim gray
        this.ctx.strokeStyle = '#2F2F2F';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(
            nose.x, 
            nose.y + maskHeight * 0.3, 
            maskWidth * 0.5, 
            maskHeight * 0.4, 
            0, 0, 2 * Math.PI
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        // Mask breathing holes
        this.ctx.fillStyle = '#2F2F2F';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const holeX = nose.x + Math.cos(angle) * maskWidth * 0.2;
            const holeY = nose.y + maskHeight * 0.3 + Math.sin(angle) * maskHeight * 0.15;
            
            this.ctx.beginPath();
            this.ctx.arc(holeX, holeY, 2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Oxygen tube
        this.ctx.strokeStyle = '#4F4F4F';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(nose.x + maskWidth * 0.3, nose.y + maskHeight * 0.4);
        this.ctx.quadraticCurveTo(
            nose.x + maskWidth * 0.8, 
            nose.y + maskHeight * 0.6,
            nose.x + maskWidth * 1.2, 
            nose.y + maskHeight * 0.3
        );
        this.ctx.stroke();
        
        // Mask straps
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        
        // Left strap
        this.ctx.beginPath();
        this.ctx.moveTo(leftMouth.x, mouth.y);
        this.ctx.lineTo(leftMouth.x - faceWidth * 0.3, mouth.y);
        this.ctx.stroke();
        
        // Right strap
        this.ctx.beginPath();
        this.ctx.moveTo(rightMouth.x, mouth.y);
        this.ctx.lineTo(rightMouth.x + faceWidth * 0.3, mouth.y);
        this.ctx.stroke();
    }
    
    drawCockpitHUD() {
        const time = Date.now() * 0.002;
        
        // HUD elements (Heads-Up Display)
        this.ctx.strokeStyle = '#00FF00'; // Green HUD color
        this.ctx.fillStyle = '#00FF00';
        this.ctx.lineWidth = 2;
        this.ctx.font = 'bold 14px monospace';
        
        // Altitude indicator (right side)
        this.ctx.beginPath();
        this.ctx.rect(this.canvas.width - 100, 50, 80, 150);
        this.ctx.stroke();
        
        this.ctx.fillText('ALT', this.canvas.width - 95, 70);
        this.ctx.fillText('10,000', this.canvas.width - 95, 90);
        this.ctx.fillText('FT', this.canvas.width - 95, 110);
        
        // Speed indicator (left side)
        this.ctx.beginPath();
        this.ctx.rect(20, 50, 80, 150);
        this.ctx.stroke();
        
        this.ctx.fillText('SPEED', 25, 70);
        this.ctx.fillText('350', 25, 90);
        this.ctx.fillText('KNOTS', 25, 110);
        
        // Artificial horizon (center)
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(Math.sin(time) * 0.1); // Subtle banking motion
        
        // Horizon line
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-100, 0);
        this.ctx.lineTo(100, 0);
        this.ctx.stroke();
        
        // Aircraft symbol
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-30, 0);
        this.ctx.lineTo(-10, 0);
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(30, 0);
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(0, 15);
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Compass heading (top)
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 16px monospace';
        
        this.ctx.beginPath();
        this.ctx.rect(centerX - 50, 60, 100, 30);
        this.ctx.stroke();
        
        const heading = Math.floor((time * 10) % 360);
        this.ctx.fillText(`HDG ${heading.toString().padStart(3, '0')}°`, centerX - 45, 80);
        
        // Engine parameters (bottom right)
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillText('ENG 1: OK', this.canvas.width - 100, this.canvas.height - 80);
        this.ctx.fillText('ENG 2: OK', this.canvas.width - 100, this.canvas.height - 65);
        this.ctx.fillText('FUEL: 75%', this.canvas.width - 100, this.canvas.height - 50);
        
        // Warning lights (animated)
        if (Math.sin(time * 5) > 0.5) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(30, this.canvas.height - 40, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = 'bold 10px monospace';
            this.ctx.fillText('ALERT', 45, this.canvas.height - 36);
        }
    }

    getLandmarkPoint(landmarks, index) {
        const point = landmarks[index];
        return {
            x: point.x * this.canvas.width,
            y: point.y * this.canvas.height
        };
    }

    setFilter(filterName) {
        this.currentFilter = filterName;
        
        // Add transition animation
        this.canvas.classList.add('filter-transition');
        setTimeout(() => {
            this.canvas.classList.remove('filter-transition');
        }, 300);
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    capturePhoto() {
        if (!this.isInitialized) return;
        
        // Create a temporary canvas to capture the current frame
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // Copy current canvas content
        tempCtx.drawImage(this.canvas, 0, 0);
        
        // Convert to blob and create photo
        tempCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toLocaleString();
            
            this.photos.push({
                url: url,
                timestamp: timestamp,
                filter: this.currentFilter
            });
            
            this.updatePhotoGallery();
            
            // Show success feedback
            this.showCaptureSuccess();
        }, 'image/png');
    }

    updatePhotoGallery() {
        if (this.photos.length === 0) {
            this.photoGallery.style.display = 'none';
            return;
        }
        
        this.photoGallery.style.display = 'block';
        this.photosGrid.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="Filtered photo with ${photo.filter} filter">
                <button class="download-btn" onclick="webcamFilters.downloadPhoto(${index})" title="Download photo">
                    💾
                </button>
            `;
            
            this.photosGrid.appendChild(photoItem);
        });
    }

    downloadPhoto(index) {
        const photo = this.photos[index];
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `filtered-selfie-${photo.filter}-${Date.now()}.png`;
        link.click();
    }

    showCaptureSuccess() {
        const button = this.captureBtn;
        const originalText = button.innerHTML;
        
        button.innerHTML = '✅ Captured!';
        button.style.background = 'linear-gradient(135deg, #00C851 0%, #007E33 100%)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }

    drawCockpitOverlay() {
        // Draw only cockpit frame elements around the edges without covering the face
        this.ctx.save();
        
        // Draw cockpit frame elements
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        
        // Top cockpit frame - thinner
        this.ctx.fillRect(0, 0, this.canvas.width, 30);
        
        // Side cockpit frames - narrower 
        this.ctx.fillRect(0, 0, 40, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - 40, 0, 40, this.canvas.height);
        
        // Bottom frame
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
        
        // Add some subtle cockpit details
        this.ctx.strokeStyle = '#888';
        this.ctx.lineWidth = 1;
        
        // Top frame details
        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width / 6) * (i + 1);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 5);
            this.ctx.lineTo(x, 25);
            this.ctx.stroke();
        }
        
        // Side frame rivets
        for (let i = 0; i < 8; i++) {
            const y = (this.canvas.height / 9) * (i + 1);
            // Left side
            this.ctx.fillStyle = '#666';
            this.ctx.beginPath();
            this.ctx.arc(20, y, 2, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Right side
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width - 20, y, 2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Add subtle sky effect in top corners only
        const gradient = this.ctx.createLinearGradient(0, 30, 0, this.canvas.height * 0.3);
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.1)'); // Light sky blue
        gradient.addColorStop(1, 'rgba(135, 206, 235, 0)'); // Transparent
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(40, 30, this.canvas.width - 80, this.canvas.height * 0.2);
        
        // Add subtle clouds in top area only
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        
        for (let i = 0; i < 3; i++) {
            const cloudX = (this.canvas.width * 0.3 * i + time * 15 + i * 100) % (this.canvas.width + 100) - 50;
            const cloudY = 50 + Math.sin(time + i) * 10;
            
            // Small clouds in top area only
            for (let j = 0; j < 3; j++) {
                const radius = 8 + j * 3;
                const offsetX = j * 8 - 8;
                this.ctx.beginPath();
                this.ctx.arc(cloudX + offsetX, cloudY, radius, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    drawFullSkyBackground() {
        // Save current canvas state
        this.ctx.save();
        
        // Create beautiful sky gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at top
        gradient.addColorStop(0.3, '#B0E0E6'); // Lighter blue
        gradient.addColorStop(0.7, '#E0F6FF'); // Even lighter
        gradient.addColorStop(1, '#F0F8FF'); // Almost white at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw beautiful moving clouds
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Multiple cloud layers for depth
        for (let layer = 0; layer < 3; layer++) {
            const layerSpeed = (layer + 1) * 10;
            const layerOpacity = 0.9 - layer * 0.2;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${layerOpacity})`;
            
            for (let i = 0; i < 6 + layer * 2; i++) {
                const cloudX = (this.canvas.width * 0.15 * i + time * layerSpeed + i * 80) % (this.canvas.width + 300) - 150;
                const cloudY = this.canvas.height * (0.1 + layer * 0.15) + Math.sin(time + i + layer) * 30;
                const cloudSize = 1 + layer * 0.3;
                
                // Draw fluffy cloud with multiple circles
                for (let j = 0; j < 6; j++) {
                    const radius = (12 + j * 4 + Math.sin(time * 2 + i + j + layer) * 3) * cloudSize;
                    const offsetX = j * 10 * cloudSize - 25;
                    const offsetY = Math.sin(j + time + layer) * 5;
                    this.ctx.beginPath();
                    this.ctx.arc(cloudX + offsetX, cloudY + offsetY, radius, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        }
        
        // Add some birds flying
        this.ctx.strokeStyle = 'rgba(50, 50, 50, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 4; i++) {
            const birdX = (this.canvas.width * 0.25 * i + time * 25 + i * 150) % (this.canvas.width + 200) - 100;
            const birdY = this.canvas.height * 0.2 + Math.sin(time * 3 + i) * 40;
            
            // Simple bird shape
            this.ctx.beginPath();
            this.ctx.moveTo(birdX - 8, birdY);
            this.ctx.quadraticCurveTo(birdX - 4, birdY - 4, birdX, birdY);
            this.ctx.quadraticCurveTo(birdX + 4, birdY - 4, birdX + 8, birdY);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawFaceCutout(centerX, centerY, faceWidth, faceHeight) {
        // Save the current state
        this.ctx.save();
        
        // Create an oval mask for the face area
        this.ctx.globalCompositeOperation = 'destination-out';
        
        // Clear the face area to show the original video
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, faceWidth * 0.5, faceHeight * 0.45, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Now draw the original video frame only in the face area
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, faceWidth * 0.5, faceHeight * 0.45, 0, 0, 2 * Math.PI);
        this.ctx.clip();
        
        // Draw the original video in the clipped area
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.restore();
        
        // Add a subtle border around the face cutout
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, faceWidth * 0.5, faceHeight * 0.45, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawAngryFace(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const leftEyebrow = this.getLandmarkPoint(landmarks, 70);
        const rightEyebrow = this.getLandmarkPoint(landmarks, 300);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        
        // Draw thick angry eyebrows
        this.drawAngryEyebrows(landmarks, eyeDistance);
        
        // Draw furrowed angry brow lines
        this.drawFurrowedBrow(landmarks, eyeDistance);
        
        // Draw angry steam from head
        this.drawAngrySteem(landmarks, faceWidth);
        
        // Draw angry mouth lines/gritted teeth effect
        this.drawAngryMouth(landmarks, eyeDistance);
        
        // Draw angry red cheeks/face flush
        this.drawAngryFlush(landmarks, faceWidth);
        
        // Draw angry vein on forehead
        this.drawAngryVein(landmarks, eyeDistance);
        
        // Draw angry fire effects
        this.drawAngryFire(landmarks, faceWidth);
    }
    
    drawAngryEyebrows(landmarks, eyeDistance) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const leftEyebrow = this.getLandmarkPoint(landmarks, 70);
        const rightEyebrow = this.getLandmarkPoint(landmarks, 300);
        
        const browThickness = eyeDistance * 0.15;
        const browLength = eyeDistance * 0.8;
        
        // Dark angry brown color
        this.ctx.fillStyle = '#2F1B14';
        this.ctx.strokeStyle = '#1A0F0A';
        this.ctx.lineWidth = 2;
        
        // Left angry eyebrow (angled downward toward center)
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x - browLength * 0.6, leftEyebrow.y - browThickness * 0.5);
        this.ctx.lineTo(leftEye.x + browLength * 0.2, leftEyebrow.y - browThickness * 2); // Angled down
        this.ctx.lineTo(leftEye.x + browLength * 0.3, leftEyebrow.y - browThickness * 1.5);
        this.ctx.lineTo(leftEye.x - browLength * 0.5, leftEyebrow.y + browThickness * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right angry eyebrow (angled downward toward center)
        this.ctx.beginPath();
        this.ctx.moveTo(rightEye.x + browLength * 0.6, rightEyebrow.y - browThickness * 0.5);
        this.ctx.lineTo(rightEye.x - browLength * 0.2, rightEyebrow.y - browThickness * 2); // Angled down
        this.ctx.lineTo(rightEye.x - browLength * 0.3, rightEyebrow.y - browThickness * 1.5);
        this.ctx.lineTo(rightEye.x + browLength * 0.5, rightEyebrow.y + browThickness * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Add extra angry brow hair details
        this.ctx.strokeStyle = '#2F1B14';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        // Left brow hair strokes
        for (let i = 0; i < 8; i++) {
            const hairX = leftEye.x - browLength * 0.5 + (browLength * 0.6 / 7) * i;
            const hairY1 = leftEyebrow.y - browThickness * 0.3;
            const hairY2 = leftEyebrow.y + browThickness * 0.3;
            const angleOffset = (i - 4) * 0.1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hairX, hairY1);
            this.ctx.lineTo(hairX + Math.sin(angleOffset) * 8, hairY2);
            this.ctx.stroke();
        }
        
        // Right brow hair strokes
        for (let i = 0; i < 8; i++) {
            const hairX = rightEye.x + browLength * 0.5 - (browLength * 0.6 / 7) * i;
            const hairY1 = rightEyebrow.y - browThickness * 0.3;
            const hairY2 = rightEyebrow.y + browThickness * 0.3;
            const angleOffset = (i - 4) * -0.1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hairX, hairY1);
            this.ctx.lineTo(hairX + Math.sin(angleOffset) * 8, hairY2);
            this.ctx.stroke();
        }
    }
    
    drawFurrowedBrow(landmarks, eyeDistance) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        
        // Dark lines for furrowed brow
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        
        // Center frown line (deepest)
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x, forehead.y - eyeDistance * 0.1);
        this.ctx.lineTo(forehead.x, forehead.y + eyeDistance * 0.3);
        this.ctx.stroke();
        
        // Left frown line
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - eyeDistance * 0.15, forehead.y);
        this.ctx.lineTo(forehead.x - eyeDistance * 0.1, forehead.y + eyeDistance * 0.25);
        this.ctx.stroke();
        
        // Right frown line
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x + eyeDistance * 0.15, forehead.y);
        this.ctx.lineTo(forehead.x + eyeDistance * 0.1, forehead.y + eyeDistance * 0.25);
        this.ctx.stroke();
        
        // Additional wrinkle lines
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#A0522D';
        
        for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * eyeDistance * 0.2;
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x + offset - eyeDistance * 0.1, forehead.y - eyeDistance * 0.05);
            this.ctx.lineTo(forehead.x + offset + eyeDistance * 0.1, forehead.y + eyeDistance * 0.15);
            this.ctx.stroke();
        }
    }
    
    drawAngrySteem(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.005;
        
        // Draw animated steam coming from head
        this.ctx.strokeStyle = '#DCDCDC';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        
        // Multiple steam lines
        for (let i = 0; i < 6; i++) {
            const steamX = forehead.x + (i - 2.5) * (faceWidth * 0.1);
            const steamStartY = forehead.y - faceWidth * 0.3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(steamX, steamStartY);
            
            // Wavy steam effect
            for (let j = 1; j <= 8; j++) {
                const waveX = steamX + Math.sin(time + i + j * 0.5) * (j * 2);
                const waveY = steamStartY - j * 8;
                this.ctx.lineTo(waveX, waveY);
            }
            this.ctx.stroke();
        }
        
        // Add steam puffs
        this.ctx.fillStyle = 'rgba(220, 220, 220, 0.6)';
        for (let i = 0; i < 4; i++) {
            const puffX = forehead.x + (i - 1.5) * (faceWidth * 0.15) + Math.sin(time + i) * 5;
            const puffY = forehead.y - faceWidth * 0.4 - Math.sin(time * 2 + i) * 10;
            const puffSize = 8 + Math.sin(time * 3 + i) * 3;
            
            this.ctx.beginPath();
            this.ctx.arc(puffX, puffY, puffSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawAngryMouth(landmarks, eyeDistance) {
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const leftMouth = this.getLandmarkPoint(landmarks, 61);
        const rightMouth = this.getLandmarkPoint(landmarks, 291);
        
        // Angry gritted teeth lines
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        // Downward mouth lines (angry frown)
        this.ctx.beginPath();
        this.ctx.moveTo(leftMouth.x, leftMouth.y);
        this.ctx.quadraticCurveTo(mouth.x, mouth.y + eyeDistance * 0.2, rightMouth.x, rightMouth.y);
        this.ctx.stroke();
        
        // Gritted teeth lines
        const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
        for (let i = 0; i < 6; i++) {
            const teethX = leftMouth.x + (mouthWidth / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(teethX, mouth.y - 5);
            this.ctx.lineTo(teethX, mouth.y + 5);
            this.ctx.stroke();
        }
        
        // Angry mouth corner lines
        this.ctx.lineWidth = 4;
        
        // Left corner
        this.ctx.beginPath();
        this.ctx.moveTo(leftMouth.x - eyeDistance * 0.1, leftMouth.y - eyeDistance * 0.05);
        this.ctx.lineTo(leftMouth.x, leftMouth.y + eyeDistance * 0.05);
        this.ctx.stroke();
        
        // Right corner
        this.ctx.beginPath();
        this.ctx.moveTo(rightMouth.x + eyeDistance * 0.1, rightMouth.y - eyeDistance * 0.05);
        this.ctx.lineTo(rightMouth.x, rightMouth.y + eyeDistance * 0.05);
        this.ctx.stroke();
    }
    
    drawAngryFlush(landmarks, faceWidth) {
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        
        // Red angry flush on cheeks
        this.ctx.fillStyle = 'rgba(255, 69, 69, 0.6)';
        
        // Left cheek flush
        this.ctx.beginPath();
        this.ctx.ellipse(leftCheek.x - faceWidth * 0.1, leftCheek.y, faceWidth * 0.15, faceWidth * 0.1, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right cheek flush
        this.ctx.beginPath();
        this.ctx.ellipse(rightCheek.x + faceWidth * 0.1, rightCheek.y, faceWidth * 0.15, faceWidth * 0.1, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Additional angry red around eyes
        this.ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        
        // Left eye area
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y, faceWidth * 0.12, faceWidth * 0.08, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right eye area
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x, rightEye.y, faceWidth * 0.12, faceWidth * 0.08, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawAngryVein(landmarks, eyeDistance) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.01;
        
        // Pulsating angry vein on forehead
        const veinIntensity = Math.sin(time * 3) * 0.5 + 1;
        this.ctx.strokeStyle = `rgba(139, 0, 0, ${0.7 * veinIntensity})`;
        this.ctx.lineWidth = 4 * veinIntensity;
        this.ctx.lineCap = 'round';
        
        // Main vein line
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - eyeDistance * 0.2, forehead.y - eyeDistance * 0.15);
        this.ctx.quadraticCurveTo(
            forehead.x - eyeDistance * 0.05, 
            forehead.y - eyeDistance * 0.25,
            forehead.x + eyeDistance * 0.1, 
            forehead.y - eyeDistance * 0.1
        );
        this.ctx.stroke();
        
        // Branch veins
        this.ctx.lineWidth = 2 * veinIntensity;
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - eyeDistance * 0.1, forehead.y - eyeDistance * 0.2);
        this.ctx.lineTo(forehead.x - eyeDistance * 0.15, forehead.y - eyeDistance * 0.3);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x + eyeDistance * 0.05, forehead.y - eyeDistance * 0.15);
        this.ctx.lineTo(forehead.x + eyeDistance * 0.1, forehead.y - eyeDistance * 0.25);
        this.ctx.stroke();
    }
    
    drawAngryFire(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.008;
        
        // Animated fire around the head for extreme anger
        const fireColors = ['#FF4500', '#FF6347', '#FF8C00', '#FFD700'];
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12 + time;
            const radius = faceWidth * 0.6 + Math.sin(time * 4 + i) * 10;
            const fireX = forehead.x + Math.cos(angle) * radius;
            const fireY = forehead.y + Math.sin(angle) * radius * 0.8;
            
            const colorIndex = Math.floor(Math.sin(time * 2 + i) * 2 + 2) % fireColors.length;
            this.ctx.fillStyle = fireColors[colorIndex];
            
            // Flame shape
            const flameHeight = 15 + Math.sin(time * 6 + i) * 8;
            const flameWidth = 8 + Math.sin(time * 4 + i) * 4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(fireX, fireY);
            this.ctx.quadraticCurveTo(fireX - flameWidth, fireY - flameHeight * 0.6, fireX, fireY - flameHeight);
            this.ctx.quadraticCurveTo(fireX + flameWidth, fireY - flameHeight * 0.6, fireX, fireY);
            this.ctx.fill();
        }
        
        // Add angry sparks
        this.ctx.fillStyle = '#FFFF00';
        for (let i = 0; i < 8; i++) {
            const sparkX = forehead.x + Math.sin(time * 5 + i) * faceWidth * 0.8;
            const sparkY = forehead.y + Math.cos(time * 4 + i) * faceWidth * 0.6;
            const sparkSize = 2 + Math.sin(time * 8 + i) * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(sparkX, sparkY, sparkSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawArmyGear(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const chin = this.getLandmarkPoint(landmarks, 175);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Draw combat helmet
        this.drawCombatHelmet(landmarks, faceWidth, faceHeight);
        
        // Draw camouflage face paint
        this.drawCamoFacePaint(landmarks, faceWidth, faceHeight);
        
        // Draw dog tags
        this.drawDogTags(landmarks, faceWidth);
        
        // Draw military uniform collar
        this.drawMilitaryCollar(landmarks, faceWidth, faceHeight);
        
        // Draw military rank insignia
        this.drawMilitaryRank(landmarks, faceWidth);
        
        // Draw tactical gear
        this.drawTacticalGear(landmarks, faceWidth);
    }
    
    drawCombatHelmet(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        // Army green helmet colors
        this.ctx.fillStyle = '#4F5D2F'; // Army green
        this.ctx.strokeStyle = '#3C4A25';
        this.ctx.lineWidth = 3;
        
        // Main helmet shape (covers most of head)
        this.ctx.beginPath();
        this.ctx.arc(
            forehead.x, 
            forehead.y - faceHeight * 0.2, 
            faceWidth * 0.75, 
            0.1 * Math.PI, 
            0.9 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet rim/edge
        this.ctx.fillStyle = '#3C4A25';
        this.ctx.beginPath();
        this.ctx.ellipse(
            forehead.x, 
            forehead.y + faceHeight * 0.02, 
            faceWidth * 0.55, 
            faceHeight * 0.08, 
            0, 0, Math.PI
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet camouflage pattern
        this.ctx.fillStyle = '#2F3B1F';
        for (let i = 0; i < 12; i++) {
            const cameX = forehead.x + (Math.random() - 0.5) * faceWidth * 1.2;
            const cameY = forehead.y - faceHeight * 0.4 + Math.random() * faceHeight * 0.6;
            const cameSize = 8 + Math.random() * 12;
            
            this.ctx.beginPath();
            this.ctx.arc(cameX, cameY, cameSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Helmet chin strap
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(leftTemple.x - faceWidth * 0.05, leftTemple.y + faceHeight * 0.25);
        this.ctx.quadraticCurveTo(
            forehead.x, 
            leftTemple.y + faceHeight * 0.45,
            rightTemple.x + faceWidth * 0.05, 
            rightTemple.y + faceHeight * 0.25
        );
        this.ctx.stroke();
        
        // Helmet night vision goggle mount
        this.ctx.fillStyle = '#2F2F2F';
        this.ctx.strokeStyle = '#1C1C1C';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - faceWidth * 0.08, forehead.y - faceHeight * 0.35, faceWidth * 0.16, faceHeight * 0.08);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Side helmet buckles
        this.ctx.fillStyle = '#8B7355';
        
        // Left buckle
        this.ctx.beginPath();
        this.ctx.rect(leftTemple.x - faceWidth * 0.08, leftTemple.y + faceHeight * 0.15, faceWidth * 0.06, faceHeight * 0.04);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right buckle
        this.ctx.beginPath();
        this.ctx.rect(rightTemple.x + faceWidth * 0.02, rightTemple.y + faceHeight * 0.15, faceWidth * 0.06, faceHeight * 0.04);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawCamoFacePaint(landmarks, faceWidth, faceHeight) {
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const nose = this.getLandmarkPoint(landmarks, 1);
        
        // Military face paint colors
        const camoColors = ['#4F5D2F', '#2F3B1F', '#1C2812', '#654321'];
        
        // Face paint stripes and patterns
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        
        // Horizontal stripes on forehead
        for (let i = 0; i < 3; i++) {
            this.ctx.strokeStyle = camoColors[i % camoColors.length];
            const stripeY = forehead.y + i * (faceHeight * 0.08);
            
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x - faceWidth * 0.3, stripeY);
            this.ctx.lineTo(forehead.x + faceWidth * 0.3, stripeY);
            this.ctx.stroke();
        }
        
        // Diagonal stripes on cheeks
        this.ctx.lineWidth = 6;
        
        // Left cheek stripes
        for (let i = 0; i < 4; i++) {
            this.ctx.strokeStyle = camoColors[i % camoColors.length];
            const startX = leftCheek.x - faceWidth * 0.15;
            const startY = leftCheek.y - faceHeight * 0.1 + i * (faceHeight * 0.06);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX + faceWidth * 0.2, startY + faceHeight * 0.08);
            this.ctx.stroke();
        }
        
        // Right cheek stripes
        for (let i = 0; i < 4; i++) {
            this.ctx.strokeStyle = camoColors[i % camoColors.length];
            const startX = rightCheek.x + faceWidth * 0.15;
            const startY = rightCheek.y - faceHeight * 0.1 + i * (faceHeight * 0.06);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX - faceWidth * 0.2, startY + faceHeight * 0.08);
            this.ctx.stroke();
        }
        
        // Nose camo stripe
        this.ctx.strokeStyle = camoColors[2];
        this.ctx.lineWidth = 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(nose.x, nose.y - faceHeight * 0.05);
        this.ctx.lineTo(nose.x, nose.y + faceHeight * 0.1);
        this.ctx.stroke();
        
        // Random camo spots
        for (let i = 0; i < 8; i++) {
            this.ctx.fillStyle = camoColors[i % camoColors.length];
            const spotX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.8;
            const spotY = forehead.y + (Math.random() - 0.2) * faceHeight * 0.6;
            const spotSize = 3 + Math.random() * 5;
            
            this.ctx.beginPath();
            this.ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawDogTags(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const neck = { x: chin.x, y: chin.y + faceWidth * 0.3 };
        
        // Dog tag chain
        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(neck.x - faceWidth * 0.1, neck.y - faceWidth * 0.2);
        this.ctx.quadraticCurveTo(neck.x, neck.y - faceWidth * 0.15, neck.x + faceWidth * 0.1, neck.y - faceWidth * 0.2);
        this.ctx.stroke();
        
        // Dog tags
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#A0A0A0';
        this.ctx.lineWidth = 1;
        
        // First dog tag
        this.ctx.beginPath();
        this.ctx.rect(neck.x - faceWidth * 0.04, neck.y - faceWidth * 0.05, faceWidth * 0.08, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Second dog tag (slightly offset)
        this.ctx.beginPath();
        this.ctx.rect(neck.x - faceWidth * 0.02, neck.y + faceWidth * 0.02, faceWidth * 0.08, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Dog tag text
        this.ctx.fillStyle = '#000';
        this.ctx.font = `${Math.floor(faceWidth * 0.02)}px monospace`;
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText('SOLDIER', neck.x, neck.y);
        this.ctx.fillText('US ARMY', neck.x + faceWidth * 0.02, neck.y + faceWidth * 0.08);
    }
    
    drawMilitaryCollar(landmarks, faceWidth, faceHeight) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const neck = { x: chin.x, y: chin.y + faceHeight * 0.3 };
        
        // Military uniform collar
        this.ctx.fillStyle = '#4F5D2F';
        this.ctx.strokeStyle = '#3C4A25';
        this.ctx.lineWidth = 2;
        
        // Left collar
        this.ctx.beginPath();
        this.ctx.moveTo(neck.x - faceWidth * 0.3, neck.y + faceHeight * 0.1);
        this.ctx.lineTo(neck.x - faceWidth * 0.15, neck.y - faceHeight * 0.05);
        this.ctx.lineTo(neck.x - faceWidth * 0.05, neck.y + faceHeight * 0.05);
        this.ctx.lineTo(neck.x - faceWidth * 0.25, neck.y + faceHeight * 0.2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right collar
        this.ctx.beginPath();
        this.ctx.moveTo(neck.x + faceWidth * 0.3, neck.y + faceHeight * 0.1);
        this.ctx.lineTo(neck.x + faceWidth * 0.15, neck.y - faceHeight * 0.05);
        this.ctx.lineTo(neck.x + faceWidth * 0.05, neck.y + faceHeight * 0.05);
        this.ctx.lineTo(neck.x + faceWidth * 0.25, neck.y + faceHeight * 0.2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawMilitaryRank(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const leftShoulder = { x: chin.x - faceWidth * 0.25, y: chin.y + faceWidth * 0.4 };
        
        // Sergeant stripes
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            // Chevron stripes
            const stripeY = leftShoulder.y - faceWidth * 0.05 + i * faceWidth * 0.04;
            
            this.ctx.beginPath();
            this.ctx.moveTo(leftShoulder.x - faceWidth * 0.06, stripeY);
            this.ctx.lineTo(leftShoulder.x, stripeY - faceWidth * 0.02);
            this.ctx.lineTo(leftShoulder.x + faceWidth * 0.06, stripeY);
            this.ctx.lineTo(leftShoulder.x + faceWidth * 0.04, stripeY + faceWidth * 0.015);
            this.ctx.lineTo(leftShoulder.x, stripeY - faceWidth * 0.005);
            this.ctx.lineTo(leftShoulder.x - faceWidth * 0.04, stripeY + faceWidth * 0.015);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    drawTacticalGear(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const chest = { x: chin.x, y: chin.y + faceWidth * 0.5 };
        
        // Tactical vest outline
        this.ctx.strokeStyle = '#2F2F2F';
        this.ctx.lineWidth = 4;
        
        this.ctx.beginPath();
        this.ctx.rect(chest.x - faceWidth * 0.3, chest.y, faceWidth * 0.6, faceWidth * 0.4);
        this.ctx.stroke();
        
        // Tactical pouches
        this.ctx.fillStyle = '#2F2F2F';
        this.ctx.strokeStyle = '#1C1C1C';
        this.ctx.lineWidth = 1;
        
        // Left pouch
        this.ctx.beginPath();
        this.ctx.rect(chest.x - faceWidth * 0.25, chest.y + faceWidth * 0.05, faceWidth * 0.08, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Center pouch
        this.ctx.beginPath();
        this.ctx.rect(chest.x - faceWidth * 0.04, chest.y + faceWidth * 0.05, faceWidth * 0.08, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right pouch
        this.ctx.beginPath();
        this.ctx.rect(chest.x + faceWidth * 0.17, chest.y + faceWidth * 0.05, faceWidth * 0.08, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Radio on shoulder
        this.ctx.fillStyle = '#1C1C1C';
        const rightShoulder = { x: chin.x + faceWidth * 0.25, y: chin.y + faceWidth * 0.35 };
        
        this.ctx.beginPath();
        this.ctx.rect(rightShoulder.x, rightShoulder.y, faceWidth * 0.06, faceWidth * 0.1);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Radio antenna
        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(rightShoulder.x + faceWidth * 0.03, rightShoulder.y);
        this.ctx.lineTo(rightShoulder.x + faceWidth * 0.03, rightShoulder.y - faceWidth * 0.08);
        this.ctx.stroke();
    }
    
    drawMedievalKnight(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const chin = this.getLandmarkPoint(landmarks, 175);
        const leftTemple = this.getLandmarkPoint(landmarks, 127);
        const rightTemple = this.getLandmarkPoint(landmarks, 356);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Draw knight helmet
        this.drawKnightHelmet(landmarks, faceWidth, faceHeight);
        
        // Draw chain mail
        this.drawChainMail(landmarks, faceWidth, faceHeight);
        
        // Draw armor breastplate
        this.drawArmorBreastplate(landmarks, faceWidth);
        
        // Draw sword
        this.drawKnightSword(landmarks, faceWidth);
        
        // Draw shield
        this.drawKnightShield(landmarks, faceWidth);
        
        // Draw medieval cape
        this.drawMedievalCape(landmarks, faceWidth, faceHeight);
    }
    
    drawKnightHelmet(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        
        // Medieval steel helmet colors
        this.ctx.fillStyle = '#C0C0C0'; // Steel gray
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        
        // Main helmet dome
        this.ctx.beginPath();
        this.ctx.arc(
            forehead.x, 
            forehead.y - faceHeight * 0.25, 
            faceWidth * 0.7, 
            0.15 * Math.PI, 
            0.85 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet face guard (leaving eye area open)
        this.ctx.fillStyle = '#A9A9A9';
        
        // Nose guard
        this.ctx.beginPath();
        this.ctx.rect(
            nose.x - faceWidth * 0.03, 
            forehead.y - faceHeight * 0.1, 
            faceWidth * 0.06, 
            faceHeight * 0.4
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        // Side guards (cheek plates)
        // Left cheek plate
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x - faceWidth * 0.2, forehead.y);
        this.ctx.lineTo(leftEye.x - faceWidth * 0.25, forehead.y + faceHeight * 0.3);
        this.ctx.lineTo(leftEye.x - faceWidth * 0.1, forehead.y + faceHeight * 0.35);
        this.ctx.lineTo(leftEye.x - faceWidth * 0.05, forehead.y + faceHeight * 0.1);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right cheek plate
        this.ctx.beginPath();
        this.ctx.moveTo(rightEye.x + faceWidth * 0.2, forehead.y);
        this.ctx.lineTo(rightEye.x + faceWidth * 0.25, forehead.y + faceHeight * 0.3);
        this.ctx.lineTo(rightEye.x + faceWidth * 0.1, forehead.y + faceHeight * 0.35);
        this.ctx.lineTo(rightEye.x + faceWidth * 0.05, forehead.y + faceHeight * 0.1);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Helmet plume/crest
        this.ctx.fillStyle = '#DC143C'; // Dark red
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 2;
        
        // Plume feathers
        for (let i = 0; i < 5; i++) {
            const plumeX = forehead.x + (i - 2) * (faceWidth * 0.08);
            const plumeHeight = faceHeight * 0.6 + Math.sin(i) * 20;
            
            this.ctx.beginPath();
            this.ctx.ellipse(
                plumeX, 
                forehead.y - faceHeight * 0.4, 
                faceWidth * 0.02, 
                plumeHeight * 0.5, 
                0, 0, 2 * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Helmet visor slits
        this.ctx.fillStyle = '#000';
        
        // Left eye slit
        this.ctx.beginPath();
        this.ctx.rect(leftEye.x - faceWidth * 0.08, leftEye.y - faceHeight * 0.03, faceWidth * 0.1, faceHeight * 0.02);
        this.ctx.fill();
        
        // Right eye slit
        this.ctx.beginPath();
        this.ctx.rect(rightEye.x - faceWidth * 0.02, rightEye.y - faceHeight * 0.03, faceWidth * 0.1, faceHeight * 0.02);
        this.ctx.fill();
        
        // Breathing holes
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                nose.x + (i - 1.5) * faceWidth * 0.02, 
                nose.y + faceHeight * 0.1, 
                2, 
                0, 2 * Math.PI
            );
            this.ctx.fill();
        }
    }
    
    drawChainMail(landmarks, faceWidth, faceHeight) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const neck = { x: chin.x, y: chin.y + faceHeight * 0.2 };
        
        // Chain mail coif (head covering)
        this.ctx.fillStyle = '#696969';
        this.ctx.strokeStyle = '#2F2F2F';
        this.ctx.lineWidth = 1;
        
        // Chain mail pattern using small circles
        for (let y = neck.y; y < neck.y + faceHeight * 0.6; y += 8) {
            for (let x = neck.x - faceWidth * 0.4; x < neck.x + faceWidth * 0.4; x += 8) {
                // Offset every other row for realistic chain mail pattern
                const offsetX = (Math.floor(y / 8) % 2) * 4;
                
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y, 3, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
        
        // Chain mail shoulder protection
        const leftShoulder = { x: chin.x - faceWidth * 0.3, y: chin.y + faceHeight * 0.5 };
        const rightShoulder = { x: chin.x + faceWidth * 0.3, y: chin.y + faceHeight * 0.5 };
        
        // Left shoulder mail
        for (let y = leftShoulder.y; y < leftShoulder.y + faceHeight * 0.3; y += 6) {
            for (let x = leftShoulder.x - faceWidth * 0.15; x < leftShoulder.x + faceWidth * 0.1; x += 6) {
                const offsetX = (Math.floor(y / 6) % 2) * 3;
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y, 2, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
        
        // Right shoulder mail
        for (let y = rightShoulder.y; y < rightShoulder.y + faceHeight * 0.3; y += 6) {
            for (let x = rightShoulder.x - faceWidth * 0.1; x < rightShoulder.x + faceWidth * 0.15; x += 6) {
                const offsetX = (Math.floor(y / 6) % 2) * 3;
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y, 2, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
    }
    
    drawArmorBreastplate(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const chest = { x: chin.x, y: chin.y + faceWidth * 0.6 };
        
        // Steel breastplate
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        
        // Main breastplate shape
        this.ctx.beginPath();
        this.ctx.moveTo(chest.x - faceWidth * 0.25, chest.y);
        this.ctx.lineTo(chest.x - faceWidth * 0.3, chest.y + faceWidth * 0.4);
        this.ctx.quadraticCurveTo(chest.x, chest.y + faceWidth * 0.5, chest.x + faceWidth * 0.3, chest.y + faceWidth * 0.4);
        this.ctx.lineTo(chest.x + faceWidth * 0.25, chest.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Breastplate ridges
        this.ctx.strokeStyle = '#A9A9A9';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 4; i++) {
            const ridgeY = chest.y + faceWidth * 0.1 + i * faceWidth * 0.08;
            this.ctx.beginPath();
            this.ctx.moveTo(chest.x - faceWidth * 0.2, ridgeY);
            this.ctx.quadraticCurveTo(chest.x, ridgeY + faceWidth * 0.02, chest.x + faceWidth * 0.2, ridgeY);
            this.ctx.stroke();
        }
        
        // Armor rivets
        this.ctx.fillStyle = '#2F2F2F';
        
        for (let i = 0; i < 6; i++) {
            const rivetX = chest.x + (i - 2.5) * faceWidth * 0.1;
            const rivetY = chest.y + faceWidth * 0.1;
            
            this.ctx.beginPath();
            this.ctx.arc(rivetX, rivetY, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Shoulder pauldrons
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;
        
        // Left pauldron
        this.ctx.beginPath();
        this.ctx.arc(chest.x - faceWidth * 0.25, chest.y + faceWidth * 0.05, faceWidth * 0.12, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right pauldron
        this.ctx.beginPath();
        this.ctx.arc(chest.x + faceWidth * 0.25, chest.y + faceWidth * 0.05, faceWidth * 0.12, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawKnightSword(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const rightShoulder = { x: chin.x + faceWidth * 0.4, y: chin.y + faceWidth * 0.3 };
        
        // Sword handle
        this.ctx.fillStyle = '#8B4513'; // Brown handle
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.rect(rightShoulder.x, rightShoulder.y, faceWidth * 0.04, faceWidth * 0.2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Sword crossguard
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        
        this.ctx.beginPath();
        this.ctx.rect(rightShoulder.x - faceWidth * 0.06, rightShoulder.y - faceWidth * 0.02, faceWidth * 0.16, faceWidth * 0.04);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Sword blade (partially visible)
        this.ctx.fillStyle = '#E6E6FA'; // Light steel
        this.ctx.strokeStyle = '#C0C0C0';
        
        this.ctx.beginPath();
        this.ctx.moveTo(rightShoulder.x + faceWidth * 0.02, rightShoulder.y - faceWidth * 0.02);
        this.ctx.lineTo(rightShoulder.x + faceWidth * 0.015, rightShoulder.y - faceWidth * 0.25);
        this.ctx.lineTo(rightShoulder.x + faceWidth * 0.025, rightShoulder.y - faceWidth * 0.25);
        this.ctx.lineTo(rightShoulder.x + faceWidth * 0.02, rightShoulder.y - faceWidth * 0.02);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Sword pommel
        this.ctx.fillStyle = '#FFD700'; // Gold pommel
        this.ctx.strokeStyle = '#B8860B';
        
        this.ctx.beginPath();
        this.ctx.arc(rightShoulder.x + faceWidth * 0.02, rightShoulder.y + faceWidth * 0.2, faceWidth * 0.03, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawKnightShield(landmarks, faceWidth) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const leftShoulder = { x: chin.x - faceWidth * 0.4, y: chin.y + faceWidth * 0.2 };
        
        // Shield background
        this.ctx.fillStyle = '#8B0000'; // Dark red
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        
        // Shield shape (kite shield)
        this.ctx.beginPath();
        this.ctx.moveTo(leftShoulder.x, leftShoulder.y);
        this.ctx.lineTo(leftShoulder.x - faceWidth * 0.1, leftShoulder.y + faceWidth * 0.05);
        this.ctx.lineTo(leftShoulder.x - faceWidth * 0.12, leftShoulder.y + faceWidth * 0.2);
        this.ctx.lineTo(leftShoulder.x - faceWidth * 0.06, leftShoulder.y + faceWidth * 0.3);
        this.ctx.lineTo(leftShoulder.x, leftShoulder.y + faceWidth * 0.25);
        this.ctx.lineTo(leftShoulder.x + faceWidth * 0.02, leftShoulder.y + faceWidth * 0.15);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Shield heraldry (cross)
        this.ctx.fillStyle = '#FFD700'; // Gold cross
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 1;
        
        // Vertical bar of cross
        this.ctx.beginPath();
        this.ctx.rect(leftShoulder.x - faceWidth * 0.07, leftShoulder.y + faceWidth * 0.08, faceWidth * 0.02, faceWidth * 0.12);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Horizontal bar of cross
        this.ctx.beginPath();
        this.ctx.rect(leftShoulder.x - faceWidth * 0.1, leftShoulder.y + faceWidth * 0.13, faceWidth * 0.08, faceWidth * 0.02);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Shield boss (center decoration)
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        
        this.ctx.beginPath();
        this.ctx.arc(leftShoulder.x - faceWidth * 0.06, leftShoulder.y + faceWidth * 0.14, faceWidth * 0.015, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawMedievalCape(landmarks, faceWidth, faceHeight) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const neck = { x: chin.x, y: chin.y + faceHeight * 0.3 };
        
        // Cape/cloak
        this.ctx.fillStyle = '#4B0082'; // Indigo purple
        this.ctx.strokeStyle = '#2F1B69';
        this.ctx.lineWidth = 2;
        
        // Cape shape flowing behind
        this.ctx.beginPath();
        this.ctx.moveTo(neck.x - faceWidth * 0.2, neck.y);
        this.ctx.quadraticCurveTo(neck.x - faceWidth * 0.6, neck.y + faceHeight * 0.3, neck.x - faceWidth * 0.4, neck.y + faceHeight * 0.8);
        this.ctx.quadraticCurveTo(neck.x, neck.y + faceHeight * 0.9, neck.x + faceWidth * 0.4, neck.y + faceHeight * 0.8);
        this.ctx.quadraticCurveTo(neck.x + faceWidth * 0.6, neck.y + faceHeight * 0.3, neck.x + faceWidth * 0.2, neck.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cape clasp
        this.ctx.fillStyle = '#FFD700'; // Gold clasp
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        this.ctx.arc(neck.x, neck.y, faceWidth * 0.02, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Cape decoration
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        
        // Decorative border
        this.ctx.beginPath();
        this.ctx.moveTo(neck.x - faceWidth * 0.15, neck.y + faceHeight * 0.1);
        this.ctx.quadraticCurveTo(neck.x, neck.y + faceHeight * 0.05, neck.x + faceWidth * 0.15, neck.y + faceHeight * 0.1);
        this.ctx.stroke();
    }

    drawAlienInvasion(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const chin = this.getLandmarkPoint(landmarks, 175);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Draw alien green skin overlay
        this.drawAlienSkin(landmarks, faceWidth, faceHeight);
        
        // Draw huge alien eyes
        this.drawAlienEyes(landmarks, eyeDistance);
        
        // Draw UFO above head
        this.drawUFO(landmarks, faceWidth);
        
        // Draw tractor beam effect
        this.drawTractorBeam(landmarks, faceWidth, faceHeight);
        
        // Draw alien text
        this.drawAlienText(landmarks, faceWidth);
    }
    
    drawAlienSkin(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const chin = this.getLandmarkPoint(landmarks, 175);
        
        // Green alien skin overlay
        this.ctx.fillStyle = 'rgba(100, 200, 100, 0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y + faceHeight * 0.2, faceWidth * 0.6, faceHeight * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Alien texture spots
        this.ctx.fillStyle = 'rgba(80, 180, 80, 0.4)';
        for (let i = 0; i < 8; i++) {
            const spotX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.8;
            const spotY = forehead.y + (Math.random() - 0.2) * faceHeight * 0.8;
            const spotSize = 5 + Math.random() * 8;
            
            this.ctx.beginPath();
            this.ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawAlienEyes(landmarks, eyeDistance) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        
        const alienEyeSize = eyeDistance * 0.8;
        
        // Giant black alien eyes
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 3;
        
        // Left alien eye
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y, alienEyeSize * 0.6, alienEyeSize * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right alien eye
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x, rightEye.y, alienEyeSize * 0.6, alienEyeSize * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Alien eye reflections
        this.ctx.fillStyle = '#FFFFFF';
        
        // Left eye reflection
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x - alienEyeSize * 0.2, leftEye.y - alienEyeSize * 0.3, alienEyeSize * 0.15, alienEyeSize * 0.2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right eye reflection
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x - alienEyeSize * 0.2, rightEye.y - alienEyeSize * 0.3, alienEyeSize * 0.15, alienEyeSize * 0.2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawUFO(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const ufoY = forehead.y - faceWidth * 0.8;
        const time = Date.now() * 0.003;
        
        // UFO body
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        
        // UFO dome
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, ufoY, faceWidth * 0.3, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        
        // UFO base
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, ufoY, faceWidth * 0.5, faceWidth * 0.15, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // UFO lights
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + time;
            const lightX = forehead.x + Math.cos(angle) * faceWidth * 0.4;
            const lightY = ufoY;
            
            this.ctx.fillStyle = colors[i % colors.length];
            this.ctx.beginPath();
            this.ctx.arc(lightX, lightY, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawTractorBeam(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const ufoY = forehead.y - faceWidth * 0.8;
        
        // Tractor beam
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - faceWidth * 0.3, ufoY);
        this.ctx.lineTo(forehead.x - faceWidth * 0.5, forehead.y + faceHeight * 0.5);
        this.ctx.lineTo(forehead.x + faceWidth * 0.5, forehead.y + faceHeight * 0.5);
        this.ctx.lineTo(forehead.x + faceWidth * 0.3, ufoY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Beam particles
        const time = Date.now() * 0.01;
        this.ctx.fillStyle = '#FFFF00';
        for (let i = 0; i < 15; i++) {
            const particleX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.8;
            const particleY = forehead.y + Math.sin(time + i) * faceHeight * 0.3;
            const particleSize = 2 + Math.sin(time * 2 + i) * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, particleSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawAlienText(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.005;
        
        // Alien language text
        this.ctx.font = `bold ${Math.floor(faceWidth * 0.08)}px Arial`;
        this.ctx.fillStyle = `hsl(${(time * 100) % 360}, 100%, 50%)`;
        this.ctx.textAlign = 'center';
        
        const alienTexts = ['▲◆●◄', '☰☱☲☳', '⟐⟑⟒⟓'];
        
        for (let i = 0; i < alienTexts.length; i++) {
            const textAngle = time * 2 + i * Math.PI / 1.5;
            const textRadius = faceWidth * 0.6;
            const textX = forehead.x + Math.cos(textAngle) * textRadius;
            const textY = forehead.y + Math.sin(textAngle) * textRadius;
            
            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.rotate(time + i);
            this.ctx.fillText(alienTexts[i], 0, 0);
            this.ctx.restore();
        }
    }
    
    drawZombieOutbreak(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const chin = this.getLandmarkPoint(landmarks, 175);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Draw zombie skin
        this.drawZombieSkin(landmarks, faceWidth, faceHeight);
        
        // Draw bloody wounds
        this.drawBloodyWounds(landmarks, faceWidth, faceHeight);
        
        // Draw zombie eyes
        this.drawZombieEyes(landmarks, eyeDistance);
        
        // Draw rotten teeth
        this.drawRottenTeeth(landmarks, eyeDistance);
        
        // Draw zombie text
        this.drawZombieText(landmarks, faceWidth);
    }
    
    drawZombieSkin(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        // Green-gray zombie skin
        this.ctx.fillStyle = 'rgba(120, 140, 100, 0.7)';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y + faceHeight * 0.2, faceWidth * 0.6, faceHeight * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Decay spots
        this.ctx.fillStyle = 'rgba(80, 100, 60, 0.8)';
        for (let i = 0; i < 12; i++) {
            const spotX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.8;
            const spotY = forehead.y + (Math.random() - 0.2) * faceHeight * 0.8;
            const spotSize = 8 + Math.random() * 15;
            
            this.ctx.beginPath();
            this.ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawBloodyWounds(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        
        // Blood splatters
        this.ctx.fillStyle = '#8B0000';
        
        // Forehead wound
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - faceWidth * 0.1, forehead.y - faceHeight * 0.1);
        this.ctx.lineTo(forehead.x + faceWidth * 0.15, forehead.y - faceHeight * 0.05);
        this.ctx.lineTo(forehead.x + faceWidth * 0.05, forehead.y + faceHeight * 0.05);
        this.ctx.lineTo(forehead.x - faceWidth * 0.05, forehead.y);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cheek scratches
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        
        // Left cheek scratch
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftCheek.x - faceWidth * 0.1, leftCheek.y - faceHeight * 0.1 + i * faceHeight * 0.04);
            this.ctx.lineTo(leftCheek.x + faceWidth * 0.05, leftCheek.y + faceHeight * 0.05 + i * faceHeight * 0.04);
            this.ctx.stroke();
        }
        
        // Blood drips
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 6;
        
        for (let i = 0; i < 5; i++) {
            const dripX = forehead.x + (i - 2) * faceWidth * 0.15;
            this.ctx.beginPath();
            this.ctx.moveTo(dripX, forehead.y + faceHeight * 0.1);
            this.ctx.lineTo(dripX, forehead.y + faceHeight * 0.4 + Math.random() * faceHeight * 0.2);
            this.ctx.stroke();
        }
    }
    
    drawZombieEyes(landmarks, eyeDistance) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        
        // Bloodshot zombie eyes
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 3;
        
        // Left zombie eye
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x, leftEye.y, eyeDistance * 0.2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Right zombie eye
        this.ctx.beginPath();
        this.ctx.arc(rightEye.x, rightEye.y, eyeDistance * 0.2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Bloodshot veins
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            // Left eye veins
            this.ctx.beginPath();
            this.ctx.moveTo(leftEye.x, leftEye.y);
            this.ctx.lineTo(leftEye.x + Math.cos(angle) * eyeDistance * 0.15, leftEye.y + Math.sin(angle) * eyeDistance * 0.15);
            this.ctx.stroke();
            
            // Right eye veins
            this.ctx.beginPath();
            this.ctx.moveTo(rightEye.x, rightEye.y);
            this.ctx.lineTo(rightEye.x + Math.cos(angle) * eyeDistance * 0.15, rightEye.y + Math.sin(angle) * eyeDistance * 0.15);
            this.ctx.stroke();
        }
    }
    
    drawRottenTeeth(landmarks, eyeDistance) {
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const leftMouth = this.getLandmarkPoint(landmarks, 61);
        const rightMouth = this.getLandmarkPoint(landmarks, 291);
        
        // Rotten mouth
        this.ctx.fillStyle = '#2F2F2F';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(mouth.x, mouth.y, eyeDistance * 0.4, eyeDistance * 0.15, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Missing and rotten teeth
        this.ctx.fillStyle = '#FFFACD';
        const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
        
        for (let i = 0; i < 6; i++) {
            if (i === 2 || i === 4) continue; // Missing teeth
            
            const toothX = leftMouth.x + (mouthWidth / 5) * i;
            const toothHeight = 8 + Math.random() * 5; // Irregular teeth
            
            this.ctx.fillStyle = i === 1 ? '#8B4513' : '#FFFACD'; // Brown rotten tooth
            
            this.ctx.beginPath();
            this.ctx.rect(toothX - 3, mouth.y - toothHeight / 2, 6, toothHeight);
            this.ctx.fill();
        }
    }
    
    drawZombieText(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.003;
        
        // Zombie groaning text
        this.ctx.font = `bold ${Math.floor(faceWidth * 0.1)}px Arial`;
        this.ctx.fillStyle = '#8B0000';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = 'center';
        
        const zombieTexts = ['BRAINSSS...', 'GRAAAH!', 'URGHHHH'];
        
        for (let i = 0; i < zombieTexts.length; i++) {
            const textAngle = time * 1.5 + i * Math.PI / 1.5;
            const textRadius = faceWidth * 0.7;
            const textX = forehead.x + Math.cos(textAngle) * textRadius;
            const textY = forehead.y + Math.sin(textAngle) * textRadius;
            
            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.rotate(Math.sin(time * 3 + i) * 0.3);
            this.ctx.strokeText(zombieTexts[i], 0, 0);
            this.ctx.fillText(zombieTexts[i], 0, 0);
            this.ctx.restore();
        }
    }
    
    drawCyborgFuture(landmarks) {
        // Get key face landmarks
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const chin = this.getLandmarkPoint(landmarks, 175);
        
        // Calculate dimensions
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const faceHeight = Math.abs(chin.y - forehead.y);
        
        // Draw metal face plates
        this.drawMetalPlates(landmarks, faceWidth, faceHeight);
        
        // Draw laser eye
        this.drawLaserEye(landmarks, eyeDistance);
        
        // Draw circuit patterns
        this.drawCircuitPatterns(landmarks, faceWidth, faceHeight);
        
        // Draw glitch effects
        this.drawGlitchEffects(landmarks, faceWidth, faceHeight);
        
        // Draw cyborg text
        this.drawCyborgText(landmarks, faceWidth);
    }
    
    drawMetalPlates(landmarks, faceWidth, faceHeight) {
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        // Metal face plates
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        
        // Left cheek plate
        this.ctx.beginPath();
        this.ctx.moveTo(leftCheek.x - faceWidth * 0.15, leftCheek.y - faceHeight * 0.1);
        this.ctx.lineTo(leftCheek.x + faceWidth * 0.05, leftCheek.y - faceHeight * 0.05);
        this.ctx.lineTo(leftCheek.x + faceWidth * 0.1, leftCheek.y + faceHeight * 0.15);
        this.ctx.lineTo(leftCheek.x - faceWidth * 0.1, leftCheek.y + faceHeight * 0.1);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Forehead plate
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - faceWidth * 0.2, forehead.y - faceHeight * 0.15, faceWidth * 0.4, faceHeight * 0.1);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Metal rivets
        this.ctx.fillStyle = '#2F2F2F';
        for (let i = 0; i < 8; i++) {
            const rivetX = leftCheek.x - faceWidth * 0.1 + (i % 3) * faceWidth * 0.06;
            const rivetY = leftCheek.y - faceHeight * 0.05 + Math.floor(i / 3) * faceHeight * 0.06;
            
            this.ctx.beginPath();
            this.ctx.arc(rivetX, rivetY, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawLaserEye(landmarks, eyeDistance) {
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const time = Date.now() * 0.01;
        
        // Laser eye lens
        this.ctx.fillStyle = '#FF0000';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.arc(rightEye.x, rightEye.y, eyeDistance * 0.25, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Laser scanning lines
        this.ctx.strokeStyle = '#FF4500';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 5; i++) {
            const lineY = rightEye.y - eyeDistance * 0.2 + (i * eyeDistance * 0.1) + Math.sin(time * 5 + i) * 5;
            this.ctx.beginPath();
            this.ctx.moveTo(rightEye.x - eyeDistance * 0.2, lineY);
            this.ctx.lineTo(rightEye.x + eyeDistance * 0.2, lineY);
            this.ctx.stroke();
        }
        
        // Laser beam
        const beamIntensity = Math.sin(time * 8) * 0.5 + 0.5;
        this.ctx.strokeStyle = `rgba(255, 0, 0, ${beamIntensity})`;
        this.ctx.lineWidth = 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(rightEye.x + eyeDistance * 0.25, rightEye.y);
        this.ctx.lineTo(rightEye.x + eyeDistance * 2, rightEye.y + Math.sin(time * 2) * 20);
        this.ctx.stroke();
    }
    
    drawCircuitPatterns(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        // Green circuit lines
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 2;
        
        // Horizontal circuits
        for (let i = 0; i < 6; i++) {
            const circuitY = forehead.y + i * faceHeight * 0.1;
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x - faceWidth * 0.3, circuitY);
            this.ctx.lineTo(forehead.x + faceWidth * 0.3, circuitY);
            this.ctx.stroke();
            
            // Circuit nodes
            for (let j = 0; j < 4; j++) {
                const nodeX = forehead.x - faceWidth * 0.2 + j * faceWidth * 0.133;
                this.ctx.fillStyle = '#00FF00';
                this.ctx.beginPath();
                this.ctx.arc(nodeX, circuitY, 3, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Vertical circuits
        for (let i = 0; i < 4; i++) {
            const circuitX = forehead.x - faceWidth * 0.2 + i * faceWidth * 0.133;
            this.ctx.beginPath();
            this.ctx.moveTo(circuitX, forehead.y);
            this.ctx.lineTo(circuitX, forehead.y + faceHeight * 0.5);
            this.ctx.stroke();
        }
    }
    
    drawGlitchEffects(landmarks, faceWidth, faceHeight) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.02;
        
        // Digital glitch bars
        if (Math.sin(time * 10) > 0.7) {
            this.ctx.fillStyle = `rgba(255, 0, 255, ${Math.random() * 0.5 + 0.3})`;
            
            for (let i = 0; i < 3; i++) {
                const glitchY = forehead.y + Math.random() * faceHeight;
                const glitchHeight = 5 + Math.random() * 10;
                
                this.ctx.beginPath();
                this.ctx.rect(forehead.x - faceWidth * 0.4, glitchY, faceWidth * 0.8, glitchHeight);
                this.ctx.fill();
            }
        }
        
        // Error messages
        if (Math.sin(time * 15) > 0.8) {
            this.ctx.font = `${Math.floor(faceWidth * 0.04)}px monospace`;
            this.ctx.fillStyle = '#FF0000';
            this.ctx.textAlign = 'left';
            
            const errors = ['ERROR 404', 'SYSTEM FAIL', 'REBOOT REQ'];
            const errorText = errors[Math.floor(Math.random() * errors.length)];
            
            this.ctx.fillText(errorText, forehead.x - faceWidth * 0.3, forehead.y + faceHeight * 0.6);
        }
    }
    
    drawCyborgText(landmarks, faceWidth) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const time = Date.now() * 0.005;
        
        // Digital countdown
        this.ctx.font = `bold ${Math.floor(faceWidth * 0.06)}px monospace`;
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.textAlign = 'center';
        
        const digitalTexts = ['SCANNING...', 'TARGET LOCKED', 'ANALYZE COMPLETE'];
        
        for (let i = 0; i < digitalTexts.length; i++) {
            const textAngle = time * 2 + i * Math.PI / 1.5;
            const textRadius = faceWidth * 0.8;
            const textX = forehead.x + Math.cos(textAngle) * textRadius;
            const textY = forehead.y + Math.sin(textAngle) * textRadius * 0.5;
            
            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.strokeText(digitalTexts[i], 0, 0);
            this.ctx.fillText(digitalTexts[i], 0, 0);
            this.ctx.restore();
        }
    }
    
    drawDiscoFever(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.01;
        
        // Disco afro hair
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, forehead.y - faceWidth * 0.4, faceWidth * 0.8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Disco sunglasses
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FF1493';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y, eyeDistance * 0.3, eyeDistance * 0.2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x, rightEye.y, eyeDistance * 0.3, eyeDistance * 0.2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Disco ball
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.beginPath();
        this.ctx.arc(forehead.x, forehead.y - faceWidth * 0.8, faceWidth * 0.2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Disco effects
        for (let i = 0; i < 20; i++) {
            const angle = time + i * Math.PI / 10;
            const radius = faceWidth * 0.6;
            const x = forehead.x + Math.cos(angle) * radius;
            const y = forehead.y + Math.sin(angle) * radius * 0.5;
            this.ctx.fillStyle = `hsl(${(time * 100 + i * 18) % 360}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Music notes
        this.ctx.font = `${faceWidth * 0.08}px Arial`;
        this.ctx.fillStyle = '#FFD700';
        const notes = ['♪', '♫', '♬'];
        for (let i = 0; i < 5; i++) {
            const noteX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const noteY = forehead.y + Math.cos(time * 2 + i) * faceWidth * 0.4;
            this.ctx.fillText(notes[i % notes.length], noteX, noteY);
        }
    }
    
    drawMimePerformance(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // White face paint
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y + faceWidth * 0.1, faceWidth * 0.5, faceWidth * 0.6, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Black tear lines
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(leftCheek.x, leftCheek.y - faceWidth * 0.1);
        this.ctx.lineTo(leftCheek.x, leftCheek.y + faceWidth * 0.2);
        this.ctx.moveTo(rightCheek.x, rightCheek.y - faceWidth * 0.1);
        this.ctx.lineTo(rightCheek.x, rightCheek.y + faceWidth * 0.2);
        this.ctx.stroke();
        
        // Striped shirt
        for (let i = 0; i < 8; i++) {
            this.ctx.fillStyle = i % 2 === 0 ? '#000' : '#FFF';
            const stripeY = forehead.y + faceWidth * 0.5 + i * faceWidth * 0.08;
            this.ctx.fillRect(forehead.x - faceWidth * 0.4, stripeY, faceWidth * 0.8, faceWidth * 0.08);
        }
        
        // Invisible box effect
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.strokeRect(forehead.x - faceWidth * 0.6, forehead.y - faceWidth * 0.3, faceWidth * 1.2, faceWidth * 0.8);
        this.ctx.setLineDash([]);
    }
    
    drawDragonLord(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const nose = this.getLandmarkPoint(landmarks, 1);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.005;
        
        // Dragon scales
        this.ctx.fillStyle = '#228B22';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 6; x++) {
                const scaleX = forehead.x - faceWidth * 0.3 + x * faceWidth * 0.1;
                const scaleY = forehead.y - faceWidth * 0.2 + y * faceWidth * 0.08;
                this.ctx.beginPath();
                this.ctx.ellipse(scaleX, scaleY, faceWidth * 0.04, faceWidth * 0.03, 0, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Dragon horns
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x - faceWidth * 0.2, forehead.y - faceWidth * 0.1);
        this.ctx.lineTo(forehead.x - faceWidth * 0.25, forehead.y - faceWidth * 0.4);
        this.ctx.lineTo(forehead.x - faceWidth * 0.15, forehead.y - faceWidth * 0.3);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x + faceWidth * 0.2, forehead.y - faceWidth * 0.1);
        this.ctx.lineTo(forehead.x + faceWidth * 0.25, forehead.y - faceWidth * 0.4);
        this.ctx.lineTo(forehead.x + faceWidth * 0.15, forehead.y - faceWidth * 0.3);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Fire breath
        const fireColors = ['#FF4500', '#FF6347', '#FFD700'];
        for (let i = 0; i < 12; i++) {
            const fireX = nose.x + faceWidth * 0.2 + Math.sin(time * 5 + i) * faceWidth * 0.3;
            const fireY = nose.y + Math.cos(time * 3 + i) * faceWidth * 0.2;
            this.ctx.fillStyle = fireColors[i % fireColors.length];
            this.ctx.beginPath();
            this.ctx.arc(fireX, fireY, 8 + Math.sin(time * 8 + i) * 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Treasure coins
        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 6; i++) {
            const coinX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const coinY = forehead.y + faceWidth * 0.6 + Math.cos(time * 2 + i) * faceWidth * 0.2;
            this.ctx.beginPath();
            this.ctx.arc(coinX, coinY, 8, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawMagicShow(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.008;
        
        // Top hat
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - faceWidth * 0.25, forehead.y - faceWidth * 0.6, faceWidth * 0.5, faceWidth * 0.4);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Hat brim
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - faceWidth * 0.2, faceWidth * 0.35, faceWidth * 0.1, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Magic wand
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(forehead.x + faceWidth * 0.4, forehead.y);
        this.ctx.lineTo(forehead.x + faceWidth * 0.6, forehead.y - faceWidth * 0.2);
        this.ctx.stroke();
        
        // Wand star
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        const starX = forehead.x + faceWidth * 0.6;
        const starY = forehead.y - faceWidth * 0.2;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = starX + Math.cos(angle) * 10;
            const y = starY + Math.sin(angle) * 10;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Magic sparkles
        for (let i = 0; i < 15; i++) {
            const sparkleX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const sparkleY = forehead.y + Math.cos(time * 1.5 + i) * faceWidth * 0.6;
            this.ctx.fillStyle = `hsl(${(time * 200 + i * 24) % 360}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(sparkleX, sparkleY, 3 + Math.sin(time * 10 + i) * 2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Rabbits appearing
        if (Math.sin(time * 4) > 0.5) {
            this.ctx.font = `${faceWidth * 0.1}px Arial`;
            this.ctx.fillStyle = '#FFF';
            this.ctx.fillText('🐰', forehead.x - faceWidth * 0.15, forehead.y - faceWidth * 0.4);
        }
    }
    
    drawUnderwaterDiver(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.003;
        
        // Underwater background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(0, 100, 150, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 50, 100, 0.5)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Diving mask
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y, faceWidth * 0.4, faceWidth * 0.3, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Mask glass
        this.ctx.fillStyle = 'rgba(150, 200, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y, faceWidth * 0.35, faceWidth * 0.25, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Bubbles
        for (let i = 0; i < 20; i++) {
            const bubbleX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const bubbleY = forehead.y - (time * 50 + i * 30) % (faceWidth * 2);
            const bubbleSize = 5 + Math.sin(time * 3 + i) * 3;
            this.ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
            this.ctx.strokeStyle = 'rgba(100, 150, 200, 0.8)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Fish
        for (let i = 0; i < 4; i++) {
            const fishX = forehead.x + Math.sin(time * 2 + i * 1.5) * faceWidth * 1.2;
            const fishY = forehead.y + Math.cos(time + i) * faceWidth * 0.4;
            this.ctx.fillStyle = `hsl(${60 + i * 90}, 70%, 50%)`;
            this.ctx.beginPath();
            this.ctx.ellipse(fishX, fishY, 15, 8, time + i, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Coral
        this.ctx.strokeStyle = '#FF6347';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
            const coralX = forehead.x - faceWidth * 0.6 + i * faceWidth * 0.3;
            const coralY = forehead.y + faceWidth * 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(coralX, coralY);
            this.ctx.lineTo(coralX + Math.sin(time * 5 + i) * 20, coralY - faceWidth * 0.3);
            this.ctx.stroke();
        }
    }
    
    drawRockStar(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.01;
        
        // Wild hair
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        for (let i = 0; i < 20; i++) {
            const angle = (i * Math.PI) / 10;
            const hairLength = faceWidth * 0.4 + Math.sin(time * 3 + i) * 20;
            const startX = forehead.x + Math.cos(angle) * faceWidth * 0.3;
            const startY = forehead.y - faceWidth * 0.2;
            const endX = startX + Math.cos(angle) * hairLength;
            const endY = startY + Math.sin(angle) * hairLength;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        
        // Leather jacket
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - faceWidth * 0.4, forehead.y + faceWidth * 0.3, faceWidth * 0.8, faceWidth * 0.5);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Guitar
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        const guitarX = forehead.x - faceWidth * 0.6;
        const guitarY = forehead.y + faceWidth * 0.2;
        this.ctx.beginPath();
        this.ctx.ellipse(guitarX, guitarY, faceWidth * 0.15, faceWidth * 0.25, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Guitar strings
        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const stringY = guitarY - faceWidth * 0.2 + i * faceWidth * 0.067;
            this.ctx.beginPath();
            this.ctx.moveTo(guitarX - faceWidth * 0.1, stringY);
            this.ctx.lineTo(guitarX + faceWidth * 0.1, stringY);
            this.ctx.stroke();
        }
        
        // Stage lights
        for (let i = 0; i < 8; i++) {
            const lightAngle = time * 2 + i * Math.PI / 4;
            const lightRadius = faceWidth * 0.8;
            const lightX = forehead.x + Math.cos(lightAngle) * lightRadius;
            const lightY = forehead.y + Math.sin(lightAngle) * lightRadius * 0.5;
            this.ctx.fillStyle = `hsl(${(time * 100 + i * 45) % 360}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(lightX, lightY, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Crowd cheering text
        this.ctx.font = `bold ${faceWidth * 0.05}px Arial`;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'center';
        const crowdTexts = ['ROCK!', 'YEAH!', 'WOOOH!'];
        for (let i = 0; i < crowdTexts.length; i++) {
            const textX = forehead.x + Math.sin(time + i * 2) * faceWidth * 0.8;
            const textY = forehead.y + faceWidth * 0.8 + Math.cos(time * 2 + i) * 20;
            this.ctx.fillText(crowdTexts[i], textX, textY);
        }
    }
    
    drawChefMaster(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        const time = Date.now() * 0.005;
        
        // Chef hat
        this.ctx.fillStyle = '#FFF';
        this.ctx.strokeStyle = '#CCC';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y - faceWidth * 0.4, faceWidth * 0.4, faceWidth * 0.3, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Chef hat band
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.rect(forehead.x - faceWidth * 0.3, forehead.y - faceWidth * 0.15, faceWidth * 0.6, faceWidth * 0.08);
        this.ctx.fill();
        
        // Chef mustache
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        const noseY = this.getLandmarkPoint(landmarks, 2).y;
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, noseY + faceWidth * 0.1, faceWidth * 0.2, faceWidth * 0.05, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Flying ingredients
        const ingredients = ['🍅', '🧅', '🥕', '🌶️', '🥖'];
        for (let i = 0; i < ingredients.length; i++) {
            const ingredientX = forehead.x + Math.sin(time * 2 + i * 1.2) * faceWidth * 0.8;
            const ingredientY = forehead.y + Math.cos(time * 3 + i * 0.8) * faceWidth * 0.6;
            
            this.ctx.font = `${faceWidth * 0.08}px Arial`;
            this.ctx.fillText(ingredients[i], ingredientX, ingredientY);
        }
        
        // Kitchen utensils
        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        
        // Spatula
        const spatulaX = forehead.x + faceWidth * 0.5;
        const spatulaY = forehead.y + faceWidth * 0.2;
        this.ctx.beginPath();
        this.ctx.moveTo(spatulaX, spatulaY);
        this.ctx.lineTo(spatulaX, spatulaY + faceWidth * 0.3);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.beginPath();
        this.ctx.rect(spatulaX - 10, spatulaY - 20, 20, 15);
        this.ctx.fill();
        
        // Steam effects
        this.ctx.strokeStyle = '#DDD';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
            const steamX = forehead.x + (i - 2.5) * faceWidth * 0.1;
            const steamY = forehead.y + faceWidth * 0.6;
            
            this.ctx.beginPath();
            this.ctx.moveTo(steamX, steamY);
            this.ctx.quadraticCurveTo(
                steamX + Math.sin(time * 4 + i) * 10,
                steamY - faceWidth * 0.2,
                steamX + Math.sin(time * 2 + i) * 20,
                steamY - faceWidth * 0.4
            );
            this.ctx.stroke();
        }
        
        // Chef text
        this.ctx.font = `bold ${faceWidth * 0.06}px Arial`;
        this.ctx.fillStyle = '#FF6347';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BON APPÉTIT!', forehead.x, forehead.y + faceWidth * 0.8);
    }

    drawRealisticBeard(landmarks) {
        const chin = this.getLandmarkPoint(landmarks, 175);
        const jaw = this.getLandmarkPoint(landmarks, 172);
        const leftJaw = this.getLandmarkPoint(landmarks, 172);
        const rightJaw = this.getLandmarkPoint(landmarks, 397);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // Create realistic beard gradient
        const beardGradient = this.ctx.createRadialGradient(
            chin.x, chin.y, 0,
            chin.x, chin.y, faceWidth * 0.4
        );
        beardGradient.addColorStop(0, 'rgba(101, 67, 33, 0.9)');
        beardGradient.addColorStop(0.3, 'rgba(139, 69, 19, 0.8)');
        beardGradient.addColorStop(0.7, 'rgba(101, 67, 33, 0.6)');
        beardGradient.addColorStop(1, 'rgba(101, 67, 33, 0.2)');
        
        // Main beard shape
        this.ctx.fillStyle = beardGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(leftJaw.x, leftJaw.y);
        this.ctx.quadraticCurveTo(chin.x, chin.y + faceWidth * 0.15, rightJaw.x, rightJaw.y);
        this.ctx.quadraticCurveTo(rightJaw.x + faceWidth * 0.1, chin.y + faceWidth * 0.2, chin.x, chin.y + faceWidth * 0.25);
        this.ctx.quadraticCurveTo(leftJaw.x - faceWidth * 0.1, chin.y + faceWidth * 0.2, leftJaw.x, leftJaw.y);
        this.ctx.fill();
        
        // Individual beard hairs for realism
        this.ctx.strokeStyle = 'rgba(101, 67, 33, 0.7)';
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 200; i++) {
            const hairX = leftJaw.x + Math.random() * (rightJaw.x - leftJaw.x);
            const hairY = chin.y + Math.random() * faceWidth * 0.25;
            const hairLength = 8 + Math.random() * 12;
            const hairAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hairX, hairY);
            this.ctx.lineTo(
                hairX + Math.cos(hairAngle) * hairLength,
                hairY + Math.sin(hairAngle) * hairLength
            );
            this.ctx.stroke();
        }
        
        // Mustache
        const noseBottom = this.getLandmarkPoint(landmarks, 2);
        this.ctx.fillStyle = 'rgba(101, 67, 33, 0.9)';
        this.ctx.beginPath();
        this.ctx.ellipse(noseBottom.x, noseBottom.y + faceWidth * 0.06, faceWidth * 0.12, faceWidth * 0.03, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Mustache hairs
        for (let i = 0; i < 50; i++) {
            const hairX = noseBottom.x + (Math.random() - 0.5) * faceWidth * 0.2;
            const hairY = noseBottom.y + faceWidth * 0.05 + Math.random() * faceWidth * 0.02;
            const hairLength = 4 + Math.random() * 6;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hairX, hairY);
            this.ctx.lineTo(hairX + (Math.random() - 0.5) * hairLength, hairY + Math.random() * hairLength);
            this.ctx.stroke();
        }
    }

    drawMakeupGlam(landmarks) {
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const forehead = this.getLandmarkPoint(landmarks, 10);
        
        // Realistic eyeshadow with gradient
        const eyeshadowGradient = this.ctx.createRadialGradient(
            leftEye.x, leftEye.y - eyeDistance * 0.1, 0,
            leftEye.x, leftEye.y - eyeDistance * 0.1, eyeDistance * 0.4
        );
        eyeshadowGradient.addColorStop(0, 'rgba(147, 112, 219, 0.8)');
        eyeshadowGradient.addColorStop(0.5, 'rgba(186, 85, 211, 0.6)');
        eyeshadowGradient.addColorStop(1, 'rgba(147, 112, 219, 0.2)');
        
        // Left eye makeup
        this.ctx.fillStyle = eyeshadowGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(leftEye.x, leftEye.y - eyeDistance * 0.1, eyeDistance * 0.35, eyeDistance * 0.25, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Right eye makeup
        const rightEyeshadowGradient = this.ctx.createRadialGradient(
            rightEye.x, rightEye.y - eyeDistance * 0.1, 0,
            rightEye.x, rightEye.y - eyeDistance * 0.1, eyeDistance * 0.4
        );
        rightEyeshadowGradient.addColorStop(0, 'rgba(147, 112, 219, 0.8)');
        rightEyeshadowGradient.addColorStop(0.5, 'rgba(186, 85, 211, 0.6)');
        rightEyeshadowGradient.addColorStop(1, 'rgba(147, 112, 219, 0.2)');
        
        this.ctx.fillStyle = rightEyeshadowGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(rightEye.x, rightEye.y - eyeDistance * 0.1, eyeDistance * 0.35, eyeDistance * 0.25, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Realistic eyeliner
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        // Left eyeliner
        this.ctx.beginPath();
        this.ctx.moveTo(leftEye.x - eyeDistance * 0.2, leftEye.y);
        this.ctx.lineTo(leftEye.x + eyeDistance * 0.2, leftEye.y);
        this.ctx.lineTo(leftEye.x + eyeDistance * 0.25, leftEye.y - eyeDistance * 0.05);
        this.ctx.stroke();
        
        // Right eyeliner
        this.ctx.beginPath();
        this.ctx.moveTo(rightEye.x - eyeDistance * 0.2, rightEye.y);
        this.ctx.lineTo(rightEye.x + eyeDistance * 0.2, rightEye.y);
        this.ctx.lineTo(rightEye.x + eyeDistance * 0.25, rightEye.y - eyeDistance * 0.05);
        this.ctx.stroke();
        
        // Realistic blush
        const blushGradient = this.ctx.createRadialGradient(
            leftCheek.x, leftCheek.y, 0,
            leftCheek.x, leftCheek.y, eyeDistance * 0.3
        );
        blushGradient.addColorStop(0, 'rgba(255, 182, 193, 0.6)');
        blushGradient.addColorStop(1, 'rgba(255, 182, 193, 0.1)');
        
        this.ctx.fillStyle = blushGradient;
        this.ctx.beginPath();
        this.ctx.arc(leftCheek.x, leftCheek.y, eyeDistance * 0.25, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(rightCheek.x, rightCheek.y, eyeDistance * 0.25, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Glossy lips
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const lipGradient = this.ctx.createLinearGradient(
            mouth.x, mouth.y - eyeDistance * 0.05,
            mouth.x, mouth.y + eyeDistance * 0.05
        );
        lipGradient.addColorStop(0, 'rgba(220, 20, 60, 0.9)');
        lipGradient.addColorStop(0.5, 'rgba(255, 20, 147, 0.8)');
        lipGradient.addColorStop(1, 'rgba(199, 21, 133, 0.9)');
        
        this.ctx.fillStyle = lipGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(mouth.x, mouth.y, eyeDistance * 0.2, eyeDistance * 0.08, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Lip gloss highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(mouth.x, mouth.y - eyeDistance * 0.02, eyeDistance * 0.15, eyeDistance * 0.03, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawBattleScars(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // Realistic scar on forehead
        this.drawRealisticScar(
            forehead.x - faceWidth * 0.08, forehead.y - faceWidth * 0.05,
            forehead.x + faceWidth * 0.12, forehead.y + faceWidth * 0.02,
            faceWidth * 0.008
        );
        
        // Cheek scar
        this.drawRealisticScar(
            leftCheek.x - faceWidth * 0.05, leftCheek.y - faceWidth * 0.08,
            leftCheek.x + faceWidth * 0.03, leftCheek.y + faceWidth * 0.05,
            faceWidth * 0.006
        );
        
        // Small scars
        for (let i = 0; i < 3; i++) {
            const scarX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.6;
            const scarY = forehead.y + (Math.random() - 0.2) * faceWidth * 0.4;
            const scarEndX = scarX + (Math.random() - 0.5) * faceWidth * 0.1;
            const scarEndY = scarY + (Math.random() - 0.5) * faceWidth * 0.08;
            
            this.drawRealisticScar(scarX, scarY, scarEndX, scarEndY, faceWidth * 0.004);
        }
    }
    
    drawRealisticScar(startX, startY, endX, endY, width) {
        // Scar base
        this.ctx.strokeStyle = 'rgba(139, 90, 90, 0.8)';
        this.ctx.lineWidth = width * 2;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Scar highlight
        this.ctx.strokeStyle = 'rgba(210, 180, 180, 0.6)';
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Scar stitches for realism
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const stitches = Math.floor(distance / 20);
        
        for (let i = 0; i < stitches; i++) {
            const t = i / (stitches - 1);
            const stitchX = startX + (endX - startX) * t;
            const stitchY = startY + (endY - startY) * t;
            
            this.ctx.strokeStyle = 'rgba(80, 80, 80, 0.7)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(stitchX - width * 2, stitchY - width * 2);
            this.ctx.lineTo(stitchX + width * 2, stitchY + width * 2);
            this.ctx.moveTo(stitchX + width * 2, stitchY - width * 2);
            this.ctx.lineTo(stitchX - width * 2, stitchY + width * 2);
            this.ctx.stroke();
        }
    }

    drawAgingEffect(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftEye = this.getLandmarkPoint(landmarks, 33);
        const rightEye = this.getLandmarkPoint(landmarks, 263);
        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const faceWidth = eyeDistance * 2;
        
        // Forehead wrinkles
        this.ctx.strokeStyle = 'rgba(139, 115, 85, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 4; i++) {
            const wrinkleY = forehead.y - faceWidth * 0.1 + i * faceWidth * 0.04;
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x - faceWidth * 0.2, wrinkleY);
            this.ctx.quadraticCurveTo(forehead.x, wrinkleY + faceWidth * 0.01, forehead.x + faceWidth * 0.2, wrinkleY);
            this.ctx.stroke();
        }
        
        // Crow's feet around eyes
        const crowsFeetLines = [
            { dx: 0.25, dy: -0.1 }, { dx: 0.3, dy: -0.05 }, { dx: 0.3, dy: 0 },
            { dx: 0.3, dy: 0.05 }, { dx: 0.25, dy: 0.1 }
        ];
        
        crowsFeetLines.forEach(line => {
            // Left eye crow's feet
            this.ctx.beginPath();
            this.ctx.moveTo(leftEye.x + eyeDistance * 0.15, leftEye.y);
            this.ctx.lineTo(leftEye.x + eyeDistance * line.dx, leftEye.y + eyeDistance * line.dy);
            this.ctx.stroke();
            
            // Right eye crow's feet (mirrored)
            this.ctx.beginPath();
            this.ctx.moveTo(rightEye.x - eyeDistance * 0.15, rightEye.y);
            this.ctx.lineTo(rightEye.x - eyeDistance * line.dx, rightEye.y + eyeDistance * line.dy);
            this.ctx.stroke();
        });
        
        // Nasolabial folds
        const nose = this.getLandmarkPoint(landmarks, 1);
        const mouth = this.getLandmarkPoint(landmarks, 13);
        
        this.ctx.beginPath();
        this.ctx.moveTo(nose.x - eyeDistance * 0.1, nose.y + eyeDistance * 0.1);
        this.ctx.quadraticCurveTo(
            nose.x - eyeDistance * 0.15, mouth.y - eyeDistance * 0.05,
            mouth.x - eyeDistance * 0.15, mouth.y + eyeDistance * 0.05
        );
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(nose.x + eyeDistance * 0.1, nose.y + eyeDistance * 0.1);
        this.ctx.quadraticCurveTo(
            nose.x + eyeDistance * 0.15, mouth.y - eyeDistance * 0.05,
            mouth.x + eyeDistance * 0.15, mouth.y + eyeDistance * 0.05
        );
        this.ctx.stroke();
        
        // Age spots
        this.ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
        for (let i = 0; i < 8; i++) {
            const spotX = forehead.x + (Math.random() - 0.5) * faceWidth * 0.8;
            const spotY = forehead.y + (Math.random() - 0.2) * faceWidth * 0.6;
            const spotSize = 2 + Math.random() * 4;
            
            this.ctx.beginPath();
            this.ctx.arc(spotX, spotY, spotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawFaceTattoos(landmarks) {
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const leftCheek = this.getLandmarkPoint(landmarks, 116);
        const rightCheek = this.getLandmarkPoint(landmarks, 345);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // Tribal tattoo on left cheek
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Complex tribal pattern
        this.ctx.beginPath();
        this.ctx.moveTo(leftCheek.x - faceWidth * 0.08, leftCheek.y - faceWidth * 0.1);
        this.ctx.quadraticCurveTo(leftCheek.x, leftCheek.y - faceWidth * 0.05, leftCheek.x + faceWidth * 0.05, leftCheek.y);
        this.ctx.quadraticCurveTo(leftCheek.x + faceWidth * 0.03, leftCheek.y + faceWidth * 0.08, leftCheek.x - faceWidth * 0.02, leftCheek.y + faceWidth * 0.1);
        this.ctx.quadraticCurveTo(leftCheek.x - faceWidth * 0.06, leftCheek.y + faceWidth * 0.05, leftCheek.x - faceWidth * 0.08, leftCheek.y - faceWidth * 0.1);
        this.ctx.stroke();
        
        // Inner tribal details
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(leftCheek.x - faceWidth * 0.04, leftCheek.y - faceWidth * 0.03);
        this.ctx.lineTo(leftCheek.x + faceWidth * 0.02, leftCheek.y + faceWidth * 0.02);
        this.ctx.moveTo(leftCheek.x - faceWidth * 0.02, leftCheek.y + faceWidth * 0.03);
        this.ctx.lineTo(leftCheek.x + faceWidth * 0.01, leftCheek.y - faceWidth * 0.02);
        this.ctx.stroke();
        
        // Star tattoo on forehead
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 2;
        
        const starX = forehead.x;
        const starY = forehead.y - faceWidth * 0.08;
        const starSize = faceWidth * 0.04;
        
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const x = starX + Math.cos(angle) * starSize;
            const y = starY + Math.sin(angle) * starSize;
            
            if (i === 0) this.ctx.moveTo(x, y);
            else {
                const prevAngle = ((i - 2) * Math.PI * 2) / 5 - Math.PI / 2;
                const prevX = starX + Math.cos(prevAngle) * starSize;
                const prevY = starY + Math.sin(prevAngle) * starSize;
                this.ctx.lineTo(prevX, prevY);
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Small dots tattoo on right cheek
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        for (let i = 0; i < 7; i++) {
            const dotX = rightCheek.x + Math.sin(i * 0.8) * faceWidth * 0.05;
            const dotY = rightCheek.y + Math.cos(i * 0.8) * faceWidth * 0.05;
            const dotSize = 2 + i % 3;
            
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawSnowEffect(landmarks) {
        const time = Date.now() * 0.002;
        
        // Snow particles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 100; i++) {
            const snowX = (time * 30 + i * 123) % this.canvas.width;
            const snowY = (time * 50 + i * 456) % this.canvas.height;
            const snowSize = 2 + (i % 4);
            const drift = Math.sin(time * 3 + i) * 20;
            
            this.ctx.beginPath();
            this.ctx.arc(snowX + drift, snowY, snowSize, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Snowflake details for larger flakes
            if (snowSize > 3) {
                this.ctx.beginPath();
                this.ctx.moveTo(snowX + drift - 3, snowY);
                this.ctx.lineTo(snowX + drift + 3, snowY);
                this.ctx.moveTo(snowX + drift, snowY - 3);
                this.ctx.lineTo(snowX + drift, snowY + 3);
                this.ctx.moveTo(snowX + drift - 2, snowY - 2);
                this.ctx.lineTo(snowX + drift + 2, snowY + 2);
                this.ctx.moveTo(snowX + drift + 2, snowY - 2);
                this.ctx.lineTo(snowX + drift - 2, snowY + 2);
                this.ctx.stroke();
            }
        }
        
        // Cold breath effect
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const breathGradient = this.ctx.createRadialGradient(
            mouth.x, mouth.y, 0,
            mouth.x + 50, mouth.y - 30, 60
        );
        breathGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        breathGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = breathGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(mouth.x + 30, mouth.y - 15, 40, 20, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawGoldenHour(landmarks) {
        // Golden hour lighting overlay
        const goldenGradient = this.ctx.createLinearGradient(
            0, 0, this.canvas.width, this.canvas.height
        );
        goldenGradient.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
        goldenGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.1)');
        goldenGradient.addColorStop(1, 'rgba(255, 140, 0, 0.2)');
        
        this.ctx.fillStyle = goldenGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Rim lighting on face
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // Rim light gradient
        const rimGradient = this.ctx.createRadialGradient(
            forehead.x - faceWidth * 0.3, forehead.y - faceWidth * 0.2, 0,
            forehead.x - faceWidth * 0.3, forehead.y - faceWidth * 0.2, faceWidth * 0.8
        );
        rimGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
        rimGradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.2)');
        rimGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
        
        this.ctx.fillStyle = rimGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y + faceWidth * 0.1, faceWidth * 0.6, faceWidth * 0.8, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Lens flares
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
            const flareX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const flareY = forehead.y + Math.cos(time * 1.2 + i) * faceWidth * 0.6;
            const flareSize = 10 + Math.sin(time * 3 + i) * 8;
            
            this.ctx.fillStyle = `rgba(255, 255, 100, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(flareX, flareY, flareSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawCyberpunkNeon(landmarks) {
        const time = Date.now() * 0.003;
        const forehead = this.getLandmarkPoint(landmarks, 10);
        const eyeDistance = Math.abs(this.getLandmarkPoint(landmarks, 33).x - this.getLandmarkPoint(landmarks, 263).x);
        const faceWidth = eyeDistance * 2;
        
        // Neon city background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Neon face outline
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 + Math.sin(time * 5) * 0.2})`;
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#00FFFF';
        this.ctx.shadowBlur = 15;
        
        this.ctx.beginPath();
        this.ctx.ellipse(forehead.x, forehead.y + faceWidth * 0.1, faceWidth * 0.5, faceWidth * 0.7, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Neon grid lines
        this.ctx.strokeStyle = `rgba(255, 0, 255, ${0.5 + Math.sin(time * 4) * 0.3})`;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#FF00FF';
        this.ctx.shadowBlur = 10;
        
        // Horizontal lines
        for (let i = 0; i < 8; i++) {
            const lineY = i * this.canvas.height / 8;
            this.ctx.beginPath();
            this.ctx.moveTo(0, lineY);
            this.ctx.lineTo(this.canvas.width, lineY);
            this.ctx.stroke();
        }
        
        // Vertical lines
        for (let i = 0; i < 10; i++) {
            const lineX = i * this.canvas.width / 10;
            this.ctx.beginPath();
            this.ctx.moveTo(lineX, 0);
            this.ctx.lineTo(lineX, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Neon particles
        this.ctx.shadowBlur = 20;
        for (let i = 0; i < 30; i++) {
            const particleX = forehead.x + Math.sin(time + i) * faceWidth * 0.8;
            const particleY = forehead.y + Math.cos(time * 1.5 + i) * faceWidth * 0.6;
            const hue = (time * 100 + i * 12) % 360;
            
            this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.6 + Math.sin(time * 8 + i) * 0.4})`;
            this.ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    drawVintageFilm(landmarks) {
        // Film grain texture
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 30;
            data[i] += noise;     // Red
            data[i + 1] += noise; // Green
            data[i + 2] += noise; // Blue
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        
        // Sepia tone overlay
        this.ctx.fillStyle = 'rgba(222, 184, 135, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vignette effect
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const vignetteGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius
        );
        vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignetteGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
        vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        
        this.ctx.fillStyle = vignetteGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Film scratches
        const time = Date.now() * 0.001;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const scratchX = (time * 200 + i * 123) % this.canvas.width;
            this.ctx.beginPath();
            this.ctx.moveTo(scratchX, 0);
            this.ctx.lineTo(scratchX + Math.sin(time + i) * 50, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Film border
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 20;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRainGlass(landmarks) {
        const time = Date.now() * 0.002;
        
        // Glass surface with slight tint
        this.ctx.fillStyle = 'rgba(173, 216, 230, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Water droplets
        for (let i = 0; i < 50; i++) {
            const dropX = (Math.sin(i * 1.2) * 0.3 + 0.5) * this.canvas.width;
            const dropY = (time * 100 + i * 23) % (this.canvas.height + 100);
            const dropSize = 3 + (i % 5);
            const dropSpeed = 1 + (i % 3) * 0.5;
            
            // Droplet body
            this.ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
            this.ctx.strokeStyle = 'rgba(100, 149, 237, 0.8)';
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            this.ctx.ellipse(dropX, dropY, dropSize, dropSize * 1.5, 0, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Droplet highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.beginPath();
            this.ctx.ellipse(dropX - dropSize * 0.3, dropY - dropSize * 0.3, dropSize * 0.3, dropSize * 0.4, 0, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Water trails
            if (dropSize > 4) {
                this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(dropX, dropY + dropSize);
                this.ctx.lineTo(dropX + Math.sin(time + i) * 5, dropY + dropSize * 3);
                this.ctx.stroke();
            }
        }
        
        // Fogged glass effect around breath
        const mouth = this.getLandmarkPoint(landmarks, 13);
        const fogGradient = this.ctx.createRadialGradient(
            mouth.x, mouth.y, 0,
            mouth.x, mouth.y, 80
        );
        fogGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        fogGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = fogGradient;
        this.ctx.beginPath();
        this.ctx.arc(mouth.x, mouth.y, 60, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Glass reflection streaks
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < 8; i++) {
            const streakX = i * this.canvas.width / 8;
            const streakOffset = Math.sin(time + i) * 30;
            
            this.ctx.beginPath();
            this.ctx.moveTo(streakX + streakOffset, 0);
            this.ctx.lineTo(streakX + streakOffset + 20, this.canvas.height);
            this.ctx.stroke();
        }
    }
}

// Initialize the app when the page loads
let webcamFilters;

document.addEventListener('DOMContentLoaded', () => {
    webcamFilters = new WebcamFilters();
});

// Handle page visibility changes to pause/resume camera
document.addEventListener('visibilitychange', () => {
    if (webcamFilters && webcamFilters.camera) {
        if (document.hidden) {
            webcamFilters.camera.stop();
        } else if (webcamFilters.isInitialized) {
            webcamFilters.camera.start();
        }
    }
}); 