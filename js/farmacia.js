const { createApp } = Vue

const app = createApp({
    data() {
        return {
            medicamentos: [],
            medicamentosFiltrados: [],
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
                console.log(data)
                this.obtenerMedicamentos(data)
            })
            .catch(err => console.log(err))
        this.carrito = JSON.parse(localStorage.getItem('carrito'))
        if (!this.carrito) {
            this.carrito = []
        } else {
            this.carrito.forEach(medicamento => this.total += medicamento.unidades*medicamento.precio)
        }
    },
    methods: {
        obtenerMedicamentos(data) {
            this.medicamentos = data.filter(elemento => elemento.categoria === "farmacia")
            this.medicamentosFiltrados = this.medicamentos
            console.log(this.medicamentosFiltrados)
        },
        filtrarMedicamentos() {
            console.log(this.textoInput)
            if (this.textoInput) {
                this.medicamentosFiltrados = this.medicamentos.filter(medicamento => {
                    return medicamento.producto.toLowerCase().trim().includes(this.textoInput.toLowerCase().trim())
                })
                /* this.medicamentosFiltrados = this.medicamentos.filter(medicamento => medicamento.stock > 5) */
            } else {
                this.medicamentosFiltrados = this.medicamentos
            }
        },
        agregarAlCarrito(medicamento) {
            if (this.carrito.find(med => med._id === medicamento._id)) {
                const index = this.carrito.findIndex(med => med._id === medicamento._id)
                if(this.carrito[index].unidades < this.carrito[index].stock)
                    this.carrito[index].unidades += 1
            } else {    
                medicamento.unidades = 1
                this.carrito.push(medicamento)
            }
            this.total += medicamento.precio
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        },
        quitarUnidad(medicamento) {
            const index = this.carrito.findIndex(med => med._id === medicamento._id)
            this.carrito[index].unidades -= 1
            if (!this.carrito[index].unidades) {
                this.carrito.splice(index,1)
            }
            this.total -= medicamento.precio
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        },
        quitarElemento(medicamento) {
            const index = this.carrito.findIndex(med => med._id === medicamento._id)
            this.carrito.splice(index, 1)
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        }
    },
    computed: {
        filtrar() {
            switch (this.seleccionada) {
                case 'A-Z':
                    this.medicamentosFiltrados = this.medicamentosFiltrados.sort((a, b) => a.producto.localeCompare(b.producto))
                    break;
                case 'Mayor precio':
                    this.medicamentosFiltrados = this.medicamentosFiltrados.sort((a, b) => b.precio - a.precio)
                    break;
                case 'Menor precio':
                    this.medicamentosFiltrados = this.medicamentosFiltrados.sort((a, b) => a.precio - b.precio)
                    break;
                default:
                    this.medicamentosFiltrados = this.medicamentosFiltrados
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