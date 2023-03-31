const { createApp } = Vue

const app = createApp({
    data() {
        return {
            juguetes: [],
            juguetesFiltrados: [],
            textoInput: '',
            seleccionada: '',
            carrito: [],
            total: 0
        }
    },
    created() {
        fetch('https://mindhub-xj03.onrender.com/api/petshop')
            .then(response => response.json())
            .then(data => {
                this.obtenerJuguetes(data)
            })
            .catch(err => console.log(err))
            this.carrito = JSON.parse(localStorage.getItem('carrito'))
            if (!this.carrito) {
                this.carrito = []
            } else {
                this.carrito.forEach(juguetes => this.total += juguetes.unidades*juguetes.precio)
            }
    },
    methods: {
        obtenerJuguetes(data) {
            this.juguetes = data.filter(elemento => elemento.categoria === "jugueteria")
            this.juguetes = this.juguetes.sort((a, b) => a.producto.localeCompare(b.producto))
            this.juguetesFiltrados = this.juguetes
            console.log(this.juguetesFiltrados)
        },
        filtrarjuguetes() {
            console.log(this.textoInput)
            if (this.textoInput) {
                this.juguetesFiltrados = this.juguetes.filter(Juguete => {
                    return Juguete.producto.toLowerCase().trim().includes(this.textoInput.toLowerCase().trim())
                })
            } else {
                this.juguetesFiltrados = this.juguetes
            }
        },
        agregarAlCarrito(Juguete) {
            if (this.carrito.find(jug => jug._id === Juguete._id)) {
                const index = this.carrito.findIndex(jug => jug._id === Juguete._id)
                if(this.carrito[index].unidades < this.carrito[index].stock)
                    this.carrito[index].unidades += 1
            } else {    
                Juguete.unidades = 1
                this.carrito.push(Juguete)
            }
            this.total += Juguete.precio
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        },
        quitarUnidad(Juguete) {
            const index = this.carrito.findIndex(med => med._id === Juguete._id)
            this.carrito[index].unidades -= 1
            if (!this.carrito[index].unidades) {
                this.carrito.splice(index,1)
            }
            this.total -= Juguete.precio
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        },
        quitarElemento(Juguete) {
            const index = this.carrito.findIndex(med => med._id === Juguete._id)
            this.carrito.splice(index, 1)
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            this.total -= Juguete.precio * Juguete.unidades
        }
    },
    computed: {
        filtrar() {
            let ordenarPor;
            switch (this.seleccionada) {
                case 'A-Z':
                    this.juguetesFiltrados = this.juguetesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
                    break;
                case 'Mayor precio':
                    this.juguetesFiltrados = this.juguetesFiltrados.sort((a, b) => b.precio - a.precio)
                    break;
                case 'Menor precio':
                    this.juguetesFiltrados = this.juguetesFiltrados.sort((a, b) => a.precio - b.precio)
                    break;
                default:
                    this.juguetesFiltrados = this.juguetesFiltrados
            }
            
        },
        cantTotal: function(){
            let cant = 0;
            for(key in this.carrito){
                cant = cant + this.carrito[key].unidades 
            }
            return cant
        },
        carritoTotal: function(){
            let suma = 0;
            for(key in this.carrito){
                suma = suma +(this.carrito[key].unidades * this.carrito[key].precio)
            }
            return suma
        },
    }
})

app.mount('#app')
