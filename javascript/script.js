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

async function obtenerPrecio(idServicio) {
    try {
        const response = await fetch('servicios.json');
        const data = await response.json();
        const precioServicio = data[idServicio]?.valor || 0;
        return precioServicio;
    } catch (error) {
        console.error('Error al obtener el precio del servicio:', error);
        return 0;
    }
}


async function carrito(event) {
    event.preventDefault();

    const eleccionSelect = document.getElementById('eleccion');
    const cantidadInput = document.getElementById('cantidad');

    const eleccion = parseInt(eleccionSelect.value);
    const cantidad = parseInt(cantidadInput.value);

    if (eleccion < 0 || eleccion >= catalogo.length || isNaN(cantidad) || cantidad <= 0) {
        alert('Los valores ingresados no son válidos. Por favor, intente nuevamente.');
        return;
    }

    const precioServicio = await obtenerPrecio(eleccion);
    if (precioServicio === 0) {
        alert('No se pudo obtener el precio del servicio. Intente nuevamente más tarde.');
        return;
    }

    subtotal = precioServicio * cantidad;
    const nuevoItem = new ItemFactura(catalogo[eleccion].service, precioServicio, cantidad, subtotal);
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

function limpiarCarrito() {
    arrayItems.length = 0;
    valorFinal = 0;
    guardarCarrito();
    mostrarItemsCarrito();

    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total a pagar = $${valorFinal}`;
}

function mostrarComprobante() {
    const comprobanteElement = document.getElementById('comprobante');
    const carritoElement = document.getElementById('items');

    if (arrayItems.length === 0) {
        alert('El carrito está vacío. Agregue servicios antes de mostrar el comprobante.');
        return;
    }

    comprobanteElement.style.display = 'none';

    const stringItemFactura = arrayItems.map((item, index) => (index + 1) + ' - Servicio: ' + item.service + ' | Precio: $' + item.valor + ' | Cantidad de boletas: ' + item.cantidad + ' | Subtotal: $' + item.subtotal);
    const comprobanteList = document.createElement('ul');
    comprobanteList.innerHTML = stringItemFactura.map(item => `<li>${item}</li>`).join('');

    const totalElement = document.createElement('p');
    totalElement.textContent = `Total a pagar = $${valorFinal}`;

    const comprobanteContainer = document.getElementById('comprobanteContainer');

    comprobanteContainer.innerHTML = '';
    comprobanteContainer.appendChild(comprobanteList);
    comprobanteContainer.appendChild(totalElement);
    comprobanteElement.style.display = 'block';

    comprobanteContainer.scrollIntoView({ behavior: 'smooth' });
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

});

window.addEventListener('beforeunload', guardarCarrito);
;
