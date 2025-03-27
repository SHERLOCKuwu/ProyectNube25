
function crearAbejas(cantidad) {
    const contenedor = document.getElementById('animacion-abejas');

    for (let i = 0; i < cantidad; i++) {
        const abeja = document.createElement('img');
        abeja.src = '../imagenes/abeja1.png'; 
        abeja.alt = 'Abeja volando';
        abeja.className = 'abeja';
        
        
        if (i === 0) {
            abeja.style.animationName = 'volar1';
        } else {
            abeja.style.animationName = 'volar2';
        }
        
        abeja.style.left = Math.random() * 100 + 'vw'; 
        abeja.style.top = Math.random() * 100 + 'vh'; 
        contenedor.appendChild(abeja);
    }
}

window.onload = function() {
    crearAbejas(2); 
};
