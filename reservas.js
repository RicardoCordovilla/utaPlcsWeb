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
const tableContainer = document.getElementById('tableContainer')



let userName
let userId
let idBtnPlc
let role = 'normal'
let token = 'jwt ' + localStorage.getItem("token")
console.log(token)

let plcs = ["1", "2", "3"]
let plcsR = []
let plcsEmpty = []
let htmlRenderPlcs = ''
let htmlRenderTable = ''


const getUser = () => {
    userName = ''
    getMe('http://localhost:9000/api/v1/users/me')
        .then((data) => {
            console.log("userdata: ", data)
            userName = data.name
            userId = data.id
            role = data.role
            // headerName.innerHTML = `Hola ${userName}- ${userId}`
            headerName.innerHTML = `Hola ${userName}`
            getMisReservas(`http://localhost:9000/api/v1/reservas/user/${userId}`)
                .then((data) => {
                    console.log("Mis reservas: ", data)
                    htmlRenderTable = ''
                    if (data.length > 0) {
                        let misreservas = data.sort((a, b) => ((a.fecha).substr(-2)) - ((b.fecha).substr(-2)))
                        misreservas = data.sort((a, b) => ((a.fecha).substr(5, 2)) - ((b.fecha).substr(5, 2)))
                        misreservas = data.sort((a, b) => ((a.fecha).substr(0, 2)) - ((b.fecha).substr(0, 2)))
                        for (let i = 0; i < data.length; i++) {
                            htmlRenderTable +=
                                `
                            <tr>
                                <td class="text-center">${misreservas[i].fecha}</td>
                                <td class="text-center">${misreservas[i].hora}</td>
                                <td class="text-center">${misreservas[i].plcId}</td>
                            </tr>
                            `
                        }
                    }
                    tableContainer.innerHTML = htmlRenderTable
                })
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
    getUser()
    getReservas(
        `http://localhost:9000/api/v1/reservas?fecha=${fecha.value}&hora=${hora.value}:00`
    )
        .then((data) => {
            console.log(data)

            plcsR = []
            plcsEmpty = plcs
            htmlRenderPlcs = ''

            if (data.length == plcs.length) {
                htmlRenderPlcs += `
                <h2>No hay PLCs disponibles para esta hora y fecha!</h2>
                `
            }

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    plcsR.push(data[i].plc.name)
                    if (data[i].user.id == userId) {
                        plcsR = plcs
                        htmlRenderPlcs += `
                        <div class="msjPlcs">
                            <h3>Ya se realizó una reserva del PLC!</h3>
                            <h2>No se puede reservar más PLCs en la misma hora!</h2>
                        </div>
                        `
                    }

                }
            }
            else plcsEmpty = plcs

            plcsEmpty = plcs.filter(n => !plcsR.includes(n))
            plcsEmpty.forEach(item => {
                htmlRenderPlcs += `
                <div class="plcBx">
                    <h2>PLC-${item}</h2>
                    <button data-id="${item}" class="btnReservar">Reservar</button>
                </div>
                `
            })

            plcsContainer.innerHTML = htmlRenderPlcs


        })

}


document.addEventListener('DOMContentLoaded', () => {
    if (role == 'normal') {
        plcsContainer.addEventListener('click', (e) => {
            idBtnPlc = e.target.dataset.id
            console.log("target.classList: ", e.target.classList)
            console.log("target.dataset.id: ", e.target.dataset.id)
            if (e.target.classList.contains('btnReservar')) {
                modalContainer.classList.remove('hideBx')
                modalName.innerText = userName
                modalFecha.innerText = fecha.value
                modalHora.innerText = hora.value
                modalPlc.innerHTML = `PLC- ${e.target.dataset.id}`
            }
        })
    }
})

modalSi.addEventListener('click', (e) => {
    e.preventDefault()
    createReserva(
        "http://localhost:9000/api/v1/reservas",
        {
            "fecha": fecha.value,
            "hora": hora.value,
            "plcId": idBtnPlc
        }
    )
        .then(() => {
            pintarReservas()
            modalContainer.classList.add('hideBx')
            alert('Reserva confirmada')
        })


})

modalNo.addEventListener('click', (e) => {
    e.preventDefault()
    modalContainer.classList.add('hideBx')

})


async function createReserva(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(body)

    })
    return response.json()
}

async function getMisReservas(url) {
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
        referrerPolicy: 'no-referrer',

    })
    return response.json()

}