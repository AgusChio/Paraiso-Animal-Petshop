const { createApp } = Vue

const app = createApp({
    data() {
		return {
			articulos: [],
			articulosFiltrados: [],
			articulosBajoStock: [],
			articulosTipoJuguetes: [],
			articulosTipoMedicamentos: [],
			tipos: [],
			checked: [],
            textoInput: '',
            seleccionada: '',
			carrito: {},
			nuevoId: 1,
			total: 0,
			cantidad: 0,
		};
	},
	created() {
		this.cargarDatos();
	},
	methods: {
		cargarDatos() {
			fetch("https://mindhub-xj03.onrender.com/api/petshop")
				.then((respuesta) => respuesta.json())
				.then((datos) => {
					this.articulos = datos;
					this.articulos.forEach((a) => this.agregarNuevoId(a));
					this.extraerTipos();
					this.filtrarArticulosPorTipos();
					this.articulosFiltrados = [...this.articulosTipoJuguetes];
					this.buscarArticulosBajoStock();
					this.consultarLocalStorage();
				})
				.catch((e) => console.log(e));
		},
		extraerTipos() {
			let fn = (e) => e.categoria;
			this.tipos = [...new Set(this.articulos.filter(fn).map(fn))];
		},
		buscarArticulosBajoStock() {
			this.articulosBajoStock = this.articulos.filter((a) => a.stock < 5);
		},
		agregarNuevoId(articulo) {
			articulo.nuevoId = this.nuevoId;
			this.nuevoId++;
		},
		buscarArticulo(id) {
			return this.articulos.find((a) => a.nuevoId === id);
		},
		agregarAlCarrito(id) {
			let articulo = this.buscarArticulo(id);
            console.log(articulo);
			if (this.carrito.hasOwnProperty(articulo.nuevoId)) {
				this.aumentarCantidad(articulo.nuevoId);
			} else {
				let e = {
					id: articulo.nuevoId,
					nombre: articulo.producto,
					cantidad: 1,
					precio: articulo.precio,
				};
				Swal.fire("Se ha agregado al carrito exitosamente!");
				this.carrito[e.id] = { ...e };
				this.guardarEnLocalStorage();
			}
		},
		aumentarCantidad(id) {
			let articulo = this.buscarArticulo(id);
			if (this.carrito[id].cantidad === articulo.disponibles) {
				Swal.fire("Usted tiene toda las unidades que disponemos en el carrito en este momento!");
			} else {
				this.carrito[id].cantidad++;
				this.carrito[id].precio = articulo.precio * this.carrito[id].cantidad;
				this.guardarEnLocalStorage();
			}
		},
		decrementarCantidad(id) {
			let articulo = this.buscarArticulo(id);
			if (this.carrito[id].cantidad === 1) {
				this.eliminarDelCarrito(id);
			} else {
				this.carrito[id].cantidad--;
				this.carrito[id].precio = articulo.precio * this.carrito[id].cantidad;
			}
			this.guardarEnLocalStorage();
		},
		eliminarDelCarrito(id) {
			delete this.carrito[id];
			this.guardarEnLocalStorage();
			Swal.fire("Se ha eliminado dicho elemento del carrito");
		},
		vaciarCarrito() {
			this.carrito = {};
			this.guardarEnLocalStorage();
			Swal.fire("Se han eliminado todos los articulos del carrito!");
		},
		consultarLocalStorage() {
			if (localStorage.getItem("carrito")) {
				this.carrito = JSON.parse(localStorage.getItem("carrito"));
			}
		},
		guardarEnLocalStorage() {
			localStorage.setItem("carrito", JSON.stringify(this.carrito));
		},
		filtrarArticulosPorTipos() {
			this.articulosTipoJuguetes = this.articulos.filter(
				(a) => a.categoria == this.tipos[1]
			);
			this.articulosTipoMedicamentos = this.articulos.filter(
				(a) => a.categoria == this.tipos[0]
			);
		},
        BuscadorJuguetes() {
            console.log(this.textoInput)
            if (this.textoInput) {
                this.articulosFiltrados = this.articulos.filter(juguetes => {
                    return juguetes.producto.toLowerCase().trim().includes(this.textoInput.toLowerCase().trim())
                })
            } else {
                this.articulosFiltrados = this.articulosTipoJuguetes
            }
        },
	},
	computed: {
		filtrar() {
            switch (this.seleccionada) {
                case 'A-Z':
                    this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => a.producto.localeCompare(b.producto))
                    break;
                case 'Mayor precio':
                    this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => b.precio - a.precio)
                    break;
                case 'Menor precio':
                    this.articulosFiltrados = this.articulosFiltrados.sort((a, b) => a.precio - b.precio)
                    break;
                default:
                    this.articulosFiltrados = this.articulosFiltrados
            }
            
        },
		calcularTotal() {
			this.total = Object.values(this.carrito).reduce(
				(acc, { precio }) => acc + precio,
				0
			);
		},
		calcularCantidad() {
			this.cantidad = Object.values(this.carrito).reduce(
				(acc, { cantidad }) => acc + cantidad,
				0
			);
		},
	},
})

app.mount('#app')