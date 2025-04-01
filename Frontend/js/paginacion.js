// Mantén tus variables existentes
let pagina = 1;
let registrosPorPagina = 5;

// Función actualizada
function cargarTabla() {
    const token = localStorage.getItem('token');
    const url = `https://proyectnube25-production-e6e4.up.railway.app/api/productos/paginados?page=${pagina}&limit=${registrosPorPagina}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar productos');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#miTabla');
            tableBody.innerHTML = '';

            data.productos.forEach(item => {
                const fila = tableBody.insertRow();
                
                // Celdas básicas (ajusta según tu estructura actual)
                fila.insertCell().textContent = item._id;
                fila.insertCell().textContent = item.nombre;
                fila.insertCell().textContent = item.tipo;
                fila.insertCell().textContent = `$${item.precio?.toFixed(2) || '0.00'}`;
                fila.insertCell().textContent = item.fechaCaducidad ? new Date(item.fechaCaducidad).toLocaleDateString() : 'N/A';
                fila.insertCell().textContent = item.stock || 'N/A';
                
                // Solo si está logueado muestra botones de acción
                if (token) {
                    const accionesCell = fila.insertCell();
                    
                    // Botón Editar
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.className = 'btn btn-warning btn-sm me-2';
                    editBtn.onclick = () => window.location.href = `form.html?Mode=UPD&id=${item._id}`;
                    accionesCell.appendChild(editBtn);
                    
                    // Botón Eliminar
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.className = 'btn btn-danger btn-sm';
                    deleteBtn.onclick = () => eliminarProducto(item._id);
                    accionesCell.appendChild(deleteBtn);
                }
            });

            // Actualiza controles de paginación (mantén tu lógica existente)
            actualizarControlesPaginacion(data.total);
        })
        .catch(err => {
            console.error('Error:', err);
            mostrarError('error-message', err);
        });
}

// Mantén tus funciones existentes de paginación
function actualizarControlesPaginacion(total) {
    document.querySelector('#paginaActual').textContent = `Página ${pagina}`;
    document.querySelector('#anterior').disabled = pagina <= 1;
    document.querySelector('#siguiente').disabled = pagina * registrosPorPagina >= total;
}

// Función para eliminar producto (ejemplo)
function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    fetch(`https://proyectnube25-production-e6e4.up.railway.app/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al eliminar');
        cargarTabla(); // Recargar la tabla después de eliminar
    })
    .catch(err => mostrarError('error-message', err));
}

// Función para mostrar errores
function mostrarError(elementId, error) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.innerHTML = `
            <div class="alert alert-danger">
                ${error.message || 'Error desconocido'}
            </div>
        `;
        errorDiv.style.display = 'block';
    }
}

// Mantén tus event listeners existentes
document.querySelector('#registrosPorPagina').addEventListener('change', (e) => {
    registrosPorPagina = parseInt(e.target.value);
    pagina = 1;
    cargarTabla();
});

document.querySelector('#anterior').addEventListener('click', () => {
    if (pagina > 1) {
        pagina--;
        cargarTabla();
    }
});

document.querySelector('#siguiente').addEventListener('click', () => {
    pagina++;
    cargarTabla();
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla();
    
    // Opcional: Ocultar/mostrar elementos basados en autenticación
    const token = localStorage.getItem('token');
    if (token) {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
});