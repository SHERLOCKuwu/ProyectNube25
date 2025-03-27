document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Aquí se guardaría la información en la base de datos, por ahora simula el registro
    alert('Te has registrado correctamente');
    window.location.href = 'login.html'; // Redirigir a la página de login
});
