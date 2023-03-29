let cerrar = document.querySelectorAll('.close')[0]
let abrir = document.querySelectorAll('#form-contacto')[0]
let modal = document.querySelectorAll('.m')[0]
let modalC = document.querySelectorAll('.modal-container')[0]

abrir.addEventListener('submit', e => {
    e.preventDefault()
    modalC.style.opacity = "1"
    modalC.style.visibility = "visible"
    modal.classList.toggle("m-close")
})

cerrar.addEventListener('click', e => {
    modalC.style.opacity = "0"
    modalC.style.visibility = "hidden"
    modal.classList.toggle("m-close")
})

