// Array de productos disponibles
const productos = [
    {
        id: 1,
        nombreProducto: 'Muzzarella',
        descripcion: "Salsa de tomate, muzzarella, orégano y aceitunas.",
        precio: 3000,
        imagen: "./assets/pizza-muzarella.png",
        cantidad: 0,
    },
    {
        id: 2,
        nombreProducto: 'Napolitana',
        descripcion: "Salsa de tomate, muzzarella, jamón, rodajas de tomate, orégano y aceitunas.",
        precio: 3200,
        imagen: "./assets/pizza-napolitana.png",
        cantidad: 0,
    },
    {
        id: 3,
        nombreProducto: 'Fugazzeta',
        descripcion: "Muzzarella, cebolla, orégano y aceitunas.",
        precio: 3400,
        imagen: "./assets/pizza-fugazzeta.png",
        cantidad: 0,
    },
    {
        id: 4,
        nombreProducto: 'Roquefort',
        descripcion: "Salsa de tomate, roquefort, muzzarella, orégano y aceitunas.",
        precio: 3600,
        imagen: "./assets/pizza-roquefort.png",
        cantidad: 0,
    },
    {
        id: 5,
        nombreProducto: 'Palmitos',
        descripcion: "Salsa de tomate, muzzarella, jamón, palmitos, salsa golf, orégano y aceitunas.",
        precio: 3800,
        imagen: "./assets/pizza-palmitos.png",
        cantidad: 0,
    },
    {
        id: 6,
        nombreProducto: 'Calabresa',
        descripcion: "Salsa de tomate, muzzarella, calabresa, orégano y aceitunas.",
        precio: 4000,
        imagen: "./assets/pizza-calabresa.png",
        cantidad: 0,
    },
];
// Array vacío para almacenar los productos seleccionados en el carrito
const carrito = [];
// Copia de los productos originales
const productosOriginales = [...productos]; 
// Función para renderizar los productos en el DOM
function listarProductos() {
    // Contenedor donde se mostrarán las tarjetas de los productos
    const lista = document.getElementById('productos');
    // Recorremos el array de productos y creamos una tarjeta para cada uno
    for (const producto of productos) {
        const { id, nombreProducto, descripcion, precio, imagen } = producto;

        const cardProducto = document.createElement('div');
        cardProducto.innerHTML = `
            <div class="card">
                <img class="card-img-top card-product-image" src="${imagen}" alt="${nombreProducto}">
                <div class="card-body">
                    <h3 class="card-title">${nombreProducto}</h3>
                    <p class="card-text">${descripcion}</p>
                    <h3 class="card-text precio">$ ${precio}</h3>
                    <input type="number" class="form-control card-product-quantity" id="cantidad${id}" value="0" min="0" />
                    <button class="button btn btn-primary" id="${id}">Agregar al carrito</button>
                </div>
            </div>
        `;
        cardProducto.className = 'col-md-4';
        lista.append(cardProducto);
        // Obtenemos el botón de "Agregar al carrito" para agregar un evento de click
        const botonParaAgregar = document.getElementById(`${id}`);
        botonParaAgregar.addEventListener('click', () => agregarAlCarrito(producto));
    }
}
// Función para agregar los producto al carrito
function agregarAlCarrito(productoAAgregar) {
    const cantidadInput = document.getElementById(`cantidad${productoAAgregar.id}`);
    const cantidadSeleccionada = parseInt(cantidadInput.value, 10);

    const productoEnCarrito = carrito.find((producto) => producto.id === productoAAgregar.id);

    if (cantidadSeleccionada > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidadSeleccionada;
        } else {
            carrito.push({ ...productoAAgregar, cantidad: cantidadSeleccionada });
        }
    } else {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ ...productoAAgregar, cantidad: 1 });
        }
    }
    // Restablecer el campo de entrada a cero después de agregar al carrito
    cantidadInput.value = 0; 
    // Guardar el carrito actualizado en el localStorage
    guardarCarritoEnLocalStorage(); 
    // Actualizar visualmente el carrito en el DOM
    actualizarCarrito();
}
// Función para renderizar el carrito en el DOM
function actualizarCarrito() {
    const carritoContendor = document.getElementById('carrito');
    carritoContendor.innerHTML = ''; // Vaciar el contenido del carrito

    for (const producto of carrito) {
        const { nombreProducto, precio, cantidad } = producto;

        const cardProductoCarrito = document.createElement('div');
        cardProductoCarrito.innerHTML = `
            <div class="card">
                <div class="card-body bg-secondary">
                    <h3 class="card-title">${nombreProducto}</h3>
                    <h3 class="card-text">Cantidad: ${cantidad}</h3>
                    <h3 class="card-text">Precio unitario: $ ${precio}</h3>
                    <h3 class="card-text subtotal">Subtotal: $ ${precio * cantidad}</h3>
                </div>
            </div>
        `;
        cardProductoCarrito.className = 'col-md-4 ';
        carritoContendor.append(cardProductoCarrito);
    }

    // Calcular el total de la compra
    const totalCompra = calcularTotalCarrito();

    // Mostrar el total de la compra en el DOM
    const totalCompraElement = document.getElementById('totalCompra');
    totalCompraElement.textContent = `Total de tu compra: $ ${totalCompra}`;
 
}
// Función para vaciar el carrito
function vaciarCarrito() {
    // Vaciar el array carrito
    carrito.length = 0;
    // Actualizar la interfaz para mostrar el carrito vacío 
    actualizarCarrito(); 
}
// Función para calcular el total de la compra
function calcularTotalCarrito() {
    let total = 0;
    for (const producto of carrito) {
        total += producto.precio * producto.cantidad;
    }
    return total;
}
// Función para guardar el carrito en el localStorage.
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
// Evento al hacer click en el botón de "Confirmar Compra"
const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
btnConfirmarCompra.addEventListener('click', () => {
    const totalCompra = calcularTotalCarrito();
    alert(`Compra confirmada. Total: $ ${totalCompra}`);
    vaciarCarrito();  
});
// Evento al hacer click en el botón de "Vaciar Carrito"
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
btnVaciarCarrito.addEventListener('click', () => {
    vaciarCarrito();
    alert('Carrito vaciado correctamente.');
});
listarProductos();