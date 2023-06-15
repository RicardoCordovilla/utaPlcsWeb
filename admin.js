// const btnBuscar = document.getElementById('btnBuscar')
const fecha = document.getElementById('fecha')
const hora = document.getElementById('hora')
const plcsContainer = document.getElementById('plcsContainer')
const modalContainer = document.getElementById('modalConfirmacionContainer')
const modalName = document.getElementById('modalName')
const modalFecha = document.getElementById('modalFecha')
const modalHora = document.getElementById('modalHora')
const modalSi = document.getElementById('modalSi')
const modalNo = document.getElementById('modalNo')
const modalPlc = document.getElementById('modalPlc')
const headerName = document.getElementById('headerName')

const baseUrl = "https://uta-reservas-plcs.netlify.app/api/v1/"


let userName = ''
let userId
let idBtnPlc, idReserva, reservaName
let role = 'normal'
let token = 'jwt ' + localStorage.getItem("token")
console.log(token)

let plcs = ["1", "2", "3"]
let plcsR = []
let plcsEmpty = []
let htmlRenderPlcs = ''
let reservas = []


const getUser = () => {
    userName = 'Hola '
    getMe(baseUrl + 'users/me')
        .then((data) => {
            console.log("userdata: ", data)
            userName += data.name
            userId = data.id
            role = data.role
            console.log("role: ", role)
            headerName.innerText = userName
        })

}
getUser()


async function getMe(url) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'

    })
    return response.json()
}

// btnBuscar.addEventListener('click', (e) => {
//     e.preventDefault()
//     pintarReservas()
//     console.log("userName: ", userName, "userId: ", userId)
// })

fecha.addEventListener('change', (e) => {
    e.preventDefault()
    getUser()
    console.log("role: ", role)
    pintarReservas()
})

hora.addEventListener('change', (e) => {
    e.preventDefault()
    if (fecha.value)
        pintarReservas()
    else alert("Seleccione una fecha")
})

async function getReservas(url) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',

    })
    return response.json()
}


const pintarReservas = () => {
    getReservas(
        `${baseUrl}reservas?fecha=${fecha.value}&hora=${hora.value}:00`
    )
        .then((data) => {
            console.log(data)

            plcsR = []
            reservas = []
            htmlRenderPlcs = ''

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    plcsR.push(data[i].plc.name)
                    reservas.push(data[i])
                }
                console.log("reservas: ", reservas[0])
            }

            // plcsEmpty = plcs.filter(n => !plcsR.includes(n))
            reservas.forEach(item => {
                htmlRenderPlcs += `
                <div class="plcBx">
                    <h2>PLC-${item.plc.id}</h2>
                    <h3>Ci: ${item.user.ci}</h3>
                    <h4>Nombre: ${item.user.name}</h4>
                    <button data-id="${item.id}" data-plc="${item.plc.id}" data-name="${item.user.name}" class="btnReservar" >Eliminar</button >
                </div>
                    `
            })

            plcsContainer.innerHTML = htmlRenderPlcs


        })

}


document.addEventListener('DOMContentLoaded', () => {
    plcsContainer.addEventListener('click', (e) => {
        if (role == 'admin') {
            idBtnPlc = e.target.dataset.plc
            reservaName = e.target.dataset.name
            idReserva = e.target.dataset.id
            console.log("target.classList: ", e.target.classList)
            console.log("target.dataset.id: ", idReserva)
            if (e.target.classList.contains('btnReservar')) {
                modalContainer.classList.remove('hideBx')
                modalName.innerText = reservaName
                modalFecha.innerText = fecha.value
                modalHora.innerText = hora.value
                modalPlc.innerHTML = `PLC- ${idBtnPlc}`
                // modalPlc.innerHTML = `PLC- ${idReserva}`
            }
        }
    })
})

modalSi.addEventListener('click', (e) => {
    e.preventDefault()
    deleteReserva(
        `${baseUrl}/reservas/${idReserva}`
    )
        .then(() => {
            pintarReservas()
            modalContainer.classList.add('hideBx')
            alert('Reserva eliminada')
        })


})

modalNo.addEventListener('click', (e) => {
    e.preventDefault()
    modalContainer.classList.add('hideBx')

})


async function deleteReserva(url) {
    const response = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',

    })
    return 'deleted'
}