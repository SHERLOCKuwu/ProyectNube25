let pagina = 1;
        let registrosPorPagina = 5;

        function cargarTabla() {
            const url = `http://localhost:3001/productoPaginacion?page=${pagina}&limit=${registrosPorPagina}`;
            fetch(url)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error('Error en la respuesta del servidor');
                })
                .then(data => {
                    const tableBody = document.querySelector('#miTabla');
                    tableBody.innerHTML = '';

                    data.productos.forEach(item => {
                        const fila = tableBody.insertRow();
                        fila.insertCell().textContent = item._id;
                        fila.insertCell().textContent = item.nombre;
                        fila.insertCell().textContent = item.tipo;
                        fila.insertCell().textContent = item.precio;
                        fila.insertCell().textContent = item.fechaCaducidad;
                        fila.insertCell().textContent = item.stock;

                        // Agregar imagen como enlace
                        const imagenCell = fila.insertCell();
                        const enlace = document.createElement('a');
                        enlace.href = `http://localhost:3001/uploads/${item._id}.png`; // Ruta accesible desde el servidor
                        enlace.target = '_blank';

                        const img = document.createElement('img');
                        img.src = `http://localhost:3001/uploads/${item._id}.png`; // Ruta accesible desde el servidor
                        img.alt = 'Imagen del producto';
                        img.className = 'img-table';
                        enlace.appendChild(img);

                        imagenCell.appendChild(enlace);
                    });

                    document.querySelector('#paginaActual').textContent = `Página ${pagina}`;
                    document.querySelector('#anterior').disabled = pagina === 1;
                })
                .catch(err => console.error(err));
        }

        document.querySelector('#registrosPorPagina').addEventListener('change', (e) => {
            registrosPorPagina = e.target.value;
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

        cargarTabla();