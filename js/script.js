// Array vacío para almacenar los productos seleccionados en el carrito
const carrito = [];

async function obtenerProductos() {
    try {
        const response = await fetch('../js/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos.');
        }
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function cargarProductos() {
    const productosOriginales = await obtenerProductos();
    const productos = [...productosOriginales];
    listarProductos(productos);
}

async function listarProductos(productos) {
    const lista = document.getElementById('productos');
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
        const botonParaAgregar = document.getElementById(`${id}`);
        botonParaAgregar.addEventListener('click', () => agregarAlCarrito(producto));
    }
}
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
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

async function confirmarCompra(totalCompra) {
    const result = await Swal.fire({
        title: 'Confirmar Compra',
        text: `El total de la compra es: $ ${totalCompra}\n¿Desea confirmar la compra?`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Comprar Definitivamente',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
        Swal.fire({
            title: 'Compra Realizada',
            text: `Total: $ ${totalCompra}\n¡Gracias por su compra!`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
        }).then(() => {
            vaciarCarrito();
            Swal.close(); // Cierra el cuadro de diálogo
        });
    }
}

function mostrarCarrito() {
    const totalCompra = calcularTotalCarrito();
    let carritoContenido = '';

    for (const producto of carrito) {
        const { nombreProducto, precio, cantidad } = producto;
        carritoContenido += `
            Nombre: ${nombreProducto}
            Cantidad: ${cantidad}
            Precio unitario: $ ${precio}
            Subtotal: $ ${precio * cantidad}\n\n`;
    }

    Swal.fire({
        title: 'Carrito de Compras',
        html: `${carritoContenido}<hr><strong>Total: $ ${totalCompra}</strong>`,
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Continuar Comprando',
        confirmButtonText: 'Confirmar Compra',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showDenyButton: true,
        denyButtonText: 'Vaciar Carrito',
    }).then((result) => {
        if (result.isConfirmed) {
            confirmarCompra(totalCompra);
        } else if (result.isDenied) {
            vaciarCarrito();
            Swal.close(); // Cierra el cuadro de diálogo
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // El usuario eligió "Continuar Comprando"
            // No es necesario hacer nada adicional, el cuadro de diálogo seguirá abierto
        }
    });
}
function vaciarCarrito() {
    carrito.length = 0;
    guardarCarritoEnLocalStorage();

    Swal.fire({
        title: 'Carrito Vacío',
        text: 'El carrito ha sido vaciado.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
    });

    actualizarCarrito(); // Actualizar la visualización del carrito en la página
}

function actualizarCarrito() {
    const totalCompra = calcularTotalCarrito();
    let carritoContenido = '';

    for (const producto of carrito) {
        const { nombreProducto, precio, cantidad } = producto;
        carritoContenido += `
            Nombre: ${nombreProducto}
            Cantidad: ${cantidad}
            Precio unitario: $ ${precio}
            Subtotal: $ ${precio * cantidad}\n\n`;
    }

    Swal.fire({
        title: 'Carrito de Compras',
        text: carritoContenido,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        html: `${carritoContenido}
            <button class="button btn btn-success" id="btnContinuarComprando">Continuar Comprando</button>
            <button class="button btn btn-primary" id="btnComprarDefinitivamente">Comprar Definitivamente</button>
            <button class="button btn btn-danger" id="btnVaciarCarrito">Vaciar Carrito</button>`,
        didOpen: () => {
            const btnContinuarComprando = Swal.getPopup().querySelector('#btnContinuarComprando');
            btnContinuarComprando.addEventListener('click', () => {
                Swal.close(); // Cierra el cuadro de diálogo
            });

            const btnComprarDefinitivamente = Swal.getPopup().querySelector('#btnComprarDefinitivamente');
            btnComprarDefinitivamente.addEventListener('click', () => {
                confirmarCompra(totalCompra);
            });

            const btnVaciarCarrito = Swal.getPopup().querySelector('#btnVaciarCarrito');
            btnVaciarCarrito.addEventListener('click', () => {
                vaciarCarrito();
                Swal.close();
            });
        },
    });
}
function calcularTotalCarrito() {
    let total = 0;
    for (const producto of carrito) {
        total += producto.precio * producto.cantidad;
    }
    return total;
}

const btnAbrirCarrito = document.getElementById('btnAbrirCarrito');
btnAbrirCarrito.addEventListener('click', () => mostrarCarrito());

cargarProductos();