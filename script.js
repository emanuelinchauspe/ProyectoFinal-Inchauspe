let subtotal = 0;
let valorFinal = 0;

class Servicios {
    service;
    valor;
    editorial;

    constructor(service, valor, editorial) {
        this.service = service;
        this.valor = valor;
        this.editorial = editorial;
    }
}

class ItemFactura {
    service;
    valor;
    cantidad;
    subtotal;

    constructor(service, valor, cantidad, subtotal) {
        this.service = service;
        this.valor = valor;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
}

const producto1 = new Servicios('Luz', 9500, 'EDEA');
const producto2 = new Servicios('Gas', 3200, 'Camuzzi');
const producto3 = new Servicios('Agua', 900, 'ABSA');
const producto4 = new Servicios('Internet', 4200, 'Loganet');
const producto5 = new Servicios('Colegio', 21500, 'CJN');
const producto6 = new Servicios('Seguro Automotor', 13200, 'Federación Patronal');

const catalogo = [producto1, producto2, producto3, producto4, producto5, producto6];

function mostrarCatalogo() {
    const catalogoSelect = document.getElementById('eleccion');

    catalogo.forEach((producto, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = `${producto.service}: $${producto.valor}`;
        catalogoSelect.appendChild(option);
    });
}

const arrayItems = [];

function totalServicios(valor, cantidad) {
    valorFinal += valor * cantidad;
    return valorFinal;
}

function guardarCarrito() {
    const carritoGuardado = arrayItems.map(item => ({
        service: item.service,
        valor: item.valor,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
    }));

    localStorage.setItem('carrito', JSON.stringify(carritoGuardado));
    localStorage.setItem('valorFinal', valorFinal.toString());
}

function recuperarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    const valorFinalGuardado = localStorage.getItem('valorFinal');

    if (carritoGuardado && valorFinalGuardado) {
        const carritoParseado = JSON.parse(carritoGuardado);
        arrayItems.splice(0, arrayItems.length, ...carritoParseado.map(item => new ItemFactura(item.service, item.valor, item.cantidad, item.subtotal)));
        valorFinal = parseInt(valorFinalGuardado);

        mostrarItemsCarrito();
    }
}

function carrito(event) {
    event.preventDefault();

    const eleccionSelect = document.getElementById('eleccion');
    const cantidadInput = document.getElementById('cantidad');

    const eleccion = parseInt(eleccionSelect.value);
    const cantidad = parseInt(cantidadInput.value);

    if (eleccion < 0 || eleccion >= catalogo.length || isNaN(cantidad) || cantidad <= 0) {
        alert('Los valores ingresados no son válidos. Por favor, intente nuevamente.');
        return;
    }

    subtotal = catalogo[eleccion].valor * cantidad;
    const nuevoItem = new ItemFactura(catalogo[eleccion].service, catalogo[eleccion].valor, cantidad, subtotal);
    arrayItems.push(nuevoItem);
    valorFinal += subtotal;

    const carritoElement = document.getElementById('items');
    const item = document.createElement('li');
    item.textContent = `${nuevoItem.service} | Precio: $${nuevoItem.valor} | Cantidad de boletas: ${nuevoItem.cantidad} | Subtotal: $${nuevoItem.subtotal}`;
    carritoElement.appendChild(item);

    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total a pagar = $${valorFinal}`;

    eleccionSelect.value = '';
    cantidadInput.value = '';

    guardarCarrito();
}

function mostrarItemsCarrito() {
    const carritoElement = document.getElementById('items');
    carritoElement.innerHTML = '';

    arrayItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.service} | Precio: $${item.valor} | Cantidad de boletas: ${item.cantidad} | Subtotal: $${item.subtotal}`;
        carritoElement.appendChild(listItem);
    });
}

function mostrarComprobante() {
    const comprobanteText = document.getElementById('comprobanteText');

    if (arrayItems.length === 0) {
        comprobanteText.textContent = 'No hay elementos en el carrito.';
        return;
    }

    const stringItemFactura = arrayItems.map((item, index) => `${index + 1} - Servicio: ${item.service} | Precio: $${item.valor} | Cantidad de boletas: ${item.cantidad} | Subtotal: $${item.subtotal}`);
    comprobanteText.textContent = 'COMPROBANTE DE PAGO\n\n' + stringItemFactura.join('\n\n') + '\n\nTotal a pagar = $' + valorFinal + '.';
}

function limpiarCarrito() {
    arrayItems.length = 0;
    valorFinal = 0;

    const carritoElement = document.getElementById('items');
    carritoElement.innerHTML = '';

    const totalElement = document.getElementById('total');
    totalElement.textContent = 'Total a pagar = $0';

    guardarCarrito();
}

document.addEventListener('DOMContentLoaded', function () {
    mostrarCatalogo();
    recuperarCarrito();

    const carritoForm = document.getElementById('carritoForm');
    carritoForm.addEventListener('submit', carrito);

    const comprobante = document.getElementById('comprobante');
    comprobante.addEventListener('click', mostrarComprobante);

    const limpiarBtn = document.getElementById('limpiar');
    limpiarBtn.addEventListener('click', limpiarCarrito);

    // Guardar el carrito al cerrar la página
    window.addEventListener('beforeunload', guardarCarrito);
});
