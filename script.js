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
            forehead.y - faceHeight * 0.1
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