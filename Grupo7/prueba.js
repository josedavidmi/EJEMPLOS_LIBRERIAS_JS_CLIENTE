        // Import model-viewer
        import '@google/model-viewer';

        // ============ CONFIGURADOR SIN MODELO REAL ============
        // Como no tenemos un modelo GLB real de guitarra con piezas separadas,
        // simulamos el cambio visual con estilos y efectos
        
        window.cambiarColorCuerpo = function(color) {
            const viewer = document.getElementById('guitar-viewer');
            let colorHex = '#c41e3a';
            let nombreColor = 'Rojo';
            
            switch(color) {
                case 'rojo': colorHex = '#c41e3a'; nombreColor = 'Rojo'; break;
                case 'azul': colorHex = '#2a6f8b'; nombreColor = 'Azul'; break;
                case 'negro': colorHex = '#222222'; nombreColor = 'Negro'; break;
                case 'blanco': colorHex = '#f5f5f5'; nombreColor = 'Blanco'; break;
                case 'verde': colorHex = '#2e7d32'; nombreColor = 'Verde'; break;
            }
            
            // SIMULACIÓN: Cambiamos el color del fondo/envío
            viewer.style.setProperty('--poster-color', colorHex + '30');
            
            // Actualizar UI
            document.getElementById('cuerpo-seleccionado').innerHTML = nombreColor;
            document.getElementById('resumen-cuerpo').innerHTML = nombreColor;
            
            // Feedback visual
            console.log(`🎸 Color cuerpo cambiado a: ${nombreColor} (${colorHex})`);
        };

        window.cambiarColorMastil = function(color) {
            let nombreColor = 'Caoba';
            
            switch(color) {
                case 'caoba': nombreColor = 'Caoba'; break;
                case 'arce': nombreColor = 'Arce'; break;
                case 'nogal': nombreColor = 'Nogal'; break;
                case 'negro': nombreColor = 'Negro'; break;
            }
            
            // SIMULACIÓN: Cambiamos el tono del modelo
            const viewer = document.getElementById('guitar-viewer');
            viewer.exposure = 1.0 + (color === 'arce' ? 0.3 : 0);
            
            // Actualizar UI
            document.getElementById('mastil-seleccionado').innerHTML = nombreColor;
            document.getElementById('resumen-mastil').innerHTML = nombreColor;
            
            console.log(`🎸 Mástil cambiado a: ${nombreColor}`);
        };

        window.cambiarPastillas = function(tipo) {
            let nombre = tipo === 'humbucker' ? 'Humbucker' : 'Single-coil';
            let precio = tipo === 'humbucker' ? '899' : '849';
            
            // Actualizar UI
            document.getElementById('pastilla-seleccionada').innerHTML = nombre;
            document.getElementById('resumen-pastillas').innerHTML = nombre;
            document.getElementById('precio-guitarra').innerHTML = `${precio} €`;
            
            // Efecto visual en el viewer
            const viewer = document.getElementById('guitar-viewer');
            viewer.style.filter = tipo === 'humbucker' ? 'contrast(1.1)' : 'contrast(0.9)';
            
            console.log(`🔊 Pastillas cambiadas a: ${nombre}`);
        };

        window.configurarGuitarra = function() {
            const cuerpo = document.getElementById('resumen-cuerpo').innerHTML;
            const mastil = document.getElementById('resumen-mastil').innerHTML;
            const pastillas = document.getElementById('resumen-pastillas').innerHTML;
            const precio = document.getElementById('precio-guitarra').innerHTML;
            
            alert(`✅ GUITARRA CONFIGURADA:\n\n🎸 Cuerpo: ${cuerpo}\n🎸 Mástil: ${mastil}\n🎸 Pastillas: ${pastillas}\n💰 Precio: ${precio}\n\n¡Gracias por tu compra!`);
        };

        // Inicializar con valores por defecto
        setTimeout(() => {
            cambiarColorCuerpo('rojo');
            cambiarColorMastil('caoba');
            cambiarPastillas('humbucker');
        }, 500);
