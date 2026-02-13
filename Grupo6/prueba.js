        // ============ 1. QUILL - EDITOR WYSIWYG ============
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: 'Escribe tu post... formato libre, imágenes, enlaces...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link', 'image', 'video']
                ]
            }
        });

        // ============ 2. DOMPurify - SANITIZACIÓN ============
        // Datos de ejemplo (posts precargados)
        let posts = [
            {
                id: 1,
                titulo: '💪 Rutina de fuerza para principiantes',
                categoria: 'Entrenamiento',
                contenido: '<h3><strong>Ejercicios básicos:</strong></h3><ul><li>Sentadillas - 3x12</li><li>Flexiones - 3x10</li><li>Remo con mancuerna - 3x12</li></ul><p><em>Recordad mantener la espalda recta siempre</em> 🏋️</p>',
                autor: 'Carlos M.',
                avatar: 'CM',
                fecha: '2026-02-12 10:30',
                likes: 24,
                comentarios: 7
            },
            {
                id: 2,
                titulo: '🥗 Batido de proteínas casero',
                categoria: 'Nutrición',
                contenido: '<p><strong>Receta:</strong></p><ol><li>1 scoop de proteína</li><li>1 plátano</li><li>200ml leche de almendras</li><li>1 cucharada de mantequilla de cacahuete</li></ol><p>Licuar todo y listo 🥤</p>',
                autor: 'Ana G.',
                avatar: 'AG',
                fecha: '2026-02-11 18:45',
                likes: 42,
                comentarios: 12
            }
        ];

        // Función para sanitizar HTML con DOMPurify
        function sanitizarHTML(html) {
            return DOMPurify.sanitize(html, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
                    'a', 'img', 'span', 'div', 'blockquote', 'pre', 'code'
                ],
                ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'style'],
                ALLOW_DATA_ATTR: false,
                FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
                FORBID_ATTR: ['onerror', 'onload', 'onclick']
            });
        }

        // Renderizar posts con DOMPurify
        function renderizarPosts() {
            const container = document.getElementById('posts-container');
            
            container.innerHTML = posts.map(post => {
                // SANITIZAR: aquí está la clave de seguridad
                const contenidoSeguro = sanitizarHTML(post.contenido);
                
                return `
                    <div class="post">
                        <div class="post-header">
                            <div class="post-author">
                                <div class="author-avatar">${post.avatar}</div>
                                <div class="author-info">
                                    <h4>${post.autor}</h4>
                                    <span>📅 ${post.fecha}</span>
                                </div>
                            </div>
                            <span class="post-tag">#${post.categoria}</span>
                        </div>
                        <h3 style="margin-bottom: 15px; color: #333;">${post.titulo}</h3>
                        <div class="post-content">
                            ${contenidoSeguro}
                        </div>
                        <div class="post-footer">
                            <span>❤️ ${post.likes} me gusta</span>
                            <span>💬 ${post.comentarios} comentarios</span>
                            <span style="margin-left: auto;">🔗 Compartir</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Publicar nuevo post
        function publicarPost() {
            const titulo = document.getElementById('post-titulo').value.trim();
            const categoria = document.getElementById('post-categoria').value;
            
            if (!titulo) {
                alert('❌ El título es obligatorio');
                return;
            }

            const contenido = quill.root.innerHTML;
            
            if (contenido === '<p><br></p>' || !contenido) {
                alert('❌ El contenido no puede estar vacío');
                return;
            }

            // Crear nuevo post (el contenido se sanitizará al renderizar)
            const nuevoPost = {
                id: posts.length + 1,
                titulo: titulo,
                categoria: categoria,
                contenido: contenido, // Guardamos el original, sanitizamos al mostrar
                autor: 'Usuario FitConnect',
                avatar: 'UF',
                fecha: new Date().toLocaleString('es-ES', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                likes: 0,
                comentarios: 0
            };

            posts.unshift(nuevoPost);
            renderizarPosts();
            
            // Limpiar formulario
            document.getElementById('post-titulo').value = '';
            document.getElementById('post-categoria').value = 'Entrenamiento';
            quill.root.innerHTML = '';

            alert('✅ Post publicado con seguridad (sanitizado)');
        }

        // ============ 3. JITSI MEET IFRAME API ============
        let jitsiApi = null;

        function joinRoom() {
            const roomName = document.getElementById('room-name').value.trim();
            
            if (!roomName) {
                alert('❌ Debes especificar un nombre de sala');
                return;
            }

            // Limpiar nombre (solo caracteres seguros)
            const cleanRoomName = roomName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            
            // Actualizar UI
            document.getElementById('current-room').innerHTML = cleanRoomName;
            
            // Destruir instancia anterior si existe
            if (jitsiApi) {
                jitsiApi.dispose();
            }

            // Opciones de Jitsi
            const domain = 'meet.jit.si';
            const options = {
                roomName: cleanRoomName,
                width: '100%',
                height: '100%',
                parentNode: document.querySelector('#jitsi-container'),
                configOverwrite: {
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                    enableWelcomePage: false,
                    enableClosePage: false,
                    prejoinPageEnabled: false,
                    toolbarButtons: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 
                        'fullscreen', 'fodeviceselection', 'hangup', 
                        'profile', 'chat', 'recording', 'livestreaming', 
                        'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback',
                        'stats', 'shortcuts', 'tileview', 'download'
                    ]
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 
                        'fullscreen', 'fodeviceselection', 'hangup', 
                        'profile', 'chat', 'recording', 'livestreaming', 
                        'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback',
                        'stats', 'shortcuts', 'tileview', 'download'
                    ],
                    DEFAULT_REMOTE_DISPLAY_NAME: 'FitConnect User',
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_LOGO_URL: '',
                    DISABLE_VIDEO_BACKGROUND: true
                },
                userInfo: {
                    displayName: 'FitConnect User',
                    email: 'user@fitconnect.com'
                }
            };

            try {
                jitsiApi = new JitsiMeetExternalAPI(domain, options);
                console.log('✅ Jitsi conectado a sala:', cleanRoomName);
            } catch (error) {
                console.error('Error Jitsi:', error);
                alert('❌ Error al conectar con la sala. Recarga la página.');
            }
        }

        // ============ INICIALIZACIÓN ============
        document.addEventListener('DOMContentLoaded', () => {
            // Renderizar posts iniciales
            renderizarPosts();
            
            // Event listeners
            document.getElementById('btn-publicar').addEventListener('click', publicarPost);
            
            document.getElementById('btn-limpiar').addEventListener('click', () => {
                quill.root.innerHTML = '';
                document.getElementById('post-titulo').value = '';
            });

            // Unirse a sala por defecto
            setTimeout(() => {
                joinRoom();
            }, 500);
        });
