const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')

let userName = ''
let role = ''
let token = ''


loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const pass = loginForm.pass.value
    let message = ''
    token = ''


    login('http://localhost:9000/api/v1/auth/login',
        {
            "email": email,
            "password": pass
        }

    )
        .then((data) => {
            message = data.message
            token = data.token
            role=data.role
            localStorage.setItem("token", token)
            console.log(data)
            if (message === 'Invalid Credentials') {
                alert('clave o correo incorrecto')
                loginForm.reset()
            }
            if (message == 'Correct Credentials') {
                alert('Ingreso exitoso')
                loginForm.reset()
                if (role == 'normal')
                    window.location.href = 'reservas.html'
                if (role == 'admin')
                    window.location.href = 'admin.html'


            }
        })


    // alert(username)

})


signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = signupForm.email.value
    const cedula = signupForm.cedula.value
    const nombre = signupForm.nombre.value
    const pass = signupForm.pass.value

    register('http://localhost:9000/api/v1/auth/register',
        {
            "name": nombre,
            "ci": cedula,
            "email": email,
            "password": pass
        }

    )
        .then((data) => {
            console.log(data.created)
            if(data.created=='succes'){
                alert('Usuario resgistrado correctamente')
                window.location.href = 'index.html'
            }
            else{
                alert('Este correo o cédula ya existe')
                window.location.href = 'index.html'
            }
        })

    // alert(username)

})


async function login(url, data) {
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)

    })
    return response.json()
}

async function register(url, data) {
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)

    })
    return response.json()
}



const logintab = document.getElementById("login-tab")
const registertab = document.getElementById("register-tab")

const registertabBx = document.getElementById("signup-tab-content")
const logintabBx = document.getElementById("login-tab-content")


logintab.addEventListener("click", (e) => {
    e.preventDefault()
    registertab.classList.remove('active')
    registertabBx.classList.remove('active')
    logintab.classList.add('active')
    logintabBx.classList.add('active')

})
registertab.addEventListener("click", (e) => {
    e.preventDefault()
    registertab.classList.add('active')
    registertabBx.classList.add('active')
    logintab.classList.remove('active')
    logintabBx.classList.remove('active')
})

