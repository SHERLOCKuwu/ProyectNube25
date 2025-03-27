 // Verifica si el usuario está loggeado
 window.onload = function () {
    const token = localStorage.getItem('token');
    const authStatus = document.getElementById('auth-status');

    if (token) {
        authStatus.innerHTML = `
            ¡Sesión iniciada exitosamente! 
            <button id="manage-data-btn" class="display-5" style="cursor: pointer;">Administrar Datos</button>
            <button id="logout-btn" class="display-5" style="cursor: pointer;">Cerrar sesión</button>
        `;

        // Redirigir a la página de administración
        document.getElementById('manage-data-btn').addEventListener('click', function () {
            window.location.href = 'administrarDatos.html';
        });

        // Muestra el modal al hacer clic en "Cerrar sesión"
        document.getElementById('logout-btn').addEventListener('click', function () {
            $('#logoutModal').modal('show');
        });

        // Confirma el cierre de sesión
        document.getElementById('confirm-logout-btn').addEventListener('click', function () {
            localStorage.removeItem('token');
            $('#logoutModal').modal('hide');
            window.location.href = 'login.html';
        });
    } else {
        //authStatus.innerHTML = `<a href="login.html">Iniciar sesión</a> o <a href="signup.html">Registrarse</a>`;
    }
};

