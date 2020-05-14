if (document.getElementById('signin-link')) {
    document.getElementById('signin-link').addEventListener('click', event => {
        event.preventDefault();
        document.getElementById('login-card').classList.add('d-none');
        document.getElementById('signin-card').classList.remove('d-none');
    });
}

if (document.getElementById('login-link')) {
    document.getElementById('login-link').addEventListener('click', event => {
        event.preventDefault();
        document.getElementById('login-card').classList.remove('d-none');
        document.getElementById('signin-card').classList.add('d-none');
    });
}

if (document.getElementById('login')) {
    document.getElementById('login').addEventListener('submit', event => {
        event.preventDefault();

        const nickname = event.target.querySelector('input[name=nickname]').value;
        const password = event.target.querySelector('input[name=password]').value;
        var data = {
            'nickname': nickname,
            'password': password,
        };
        fetch('/users', {
            method: 'put',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(data)
        }
        )
            .then(function (r) { return r.json() })
            .then(function (response) {
                if (response.status) {
                    document.location.reload();
                } else {
                    alert(response.message || 'Une erreur est survenue');
                }
            })
    });
}

if (document.getElementById('signin')) {
    document.getElementById('signin').addEventListener('submit', event => {
        event.preventDefault();
        let e = document.getElementById("profil-picture");
        
        const nickname = event.target.querySelector('input[name=nickname]').value;
        const profilPicture = e.options[e.selectedIndex].value;
        const email = event.target.querySelector('input[name=email]').value;
        const password = event.target.querySelector('input[name=password]').value;
        const password2 = event.target.querySelector('input[name=password2]').value;
        let data = {
            'nickname': nickname,
            'profilPicture': profilPicture,
            'email': email,
            'password': password,
            'password2': password2,
        };
        console.log('before fetch :'+JSON.stringify(data));
        fetch('/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        )
            .then(function (r) { return r.json() })
            .then(function (response) {
                if (response.status) {
                    document.location.reload();
                } else {
                    alert(response.message || 'Une erreur est survenue');
                }
            })
    });
}

if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', event => {
        event.preventDefault();
        fetch('/users', {
            method: 'delete',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
        })
            .then(function (r) { return r.json() })
            .then(function (response) {
                if (response.status) {
                    document.location.reload();
                } else {
                    alert('probleme de déconnexion');
                }
            });
    });
}