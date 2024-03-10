//Arrays

const pastas = [
    {
        nombre: "Ñoquis",
        categoria: "sin relleno",
        precio: 13.00
    },

    {
        nombre: "Sorrentinos de champiñones y queso",
        categoria: "con relleno",
        precio: 14.00
    },

    {
        nombre: "Tallarines",
        categoria: "sin relleno",
        precio: 12.00
    },

    {
        nombre: "Canelones de verduras",
        categoria: "sin relleno",
        precio: 15.00
    }
];

const salsas = [
    {
        nombre: "Roja",
        precio: 2.00
    },

    {
        nombre: "Blanca",
        precio: 3.00
    },

    {
        nombre: "Mixta",
        precio: 3.00
    },

    {
        nombre: "de Espinaca",
        precio: 4.00
    }
];

// PRIMERA ENTREGA 

//Funcion
// function tomarOrden() {
//     let continuarOrdenando = true;

//     //Ciclo while
//     while (continuarOrdenando) {
//         let totalPedido = 0;

//         //Ciclo for + flecha
//         for (let i = 0; i < 2; i++) {
//             let opcionesPasta = prompt("¿Qué pasta desea comer? (Ñoquis, Sorrentinos de champignones y queso, Tallarines, Canelones de verdura)").toLowerCase();

//             let pastaSeleccionada = pasta.find(item => item.nombre.toLowerCase() === opcionesPasta);

//             if (!pastaSeleccionada) {
//                 alert("Lo sentimos, la pasta seleccionada no está disponible.");
//                 i--;
//                 continue;
//             }

//             let opcionesSalsa = prompt("¿Con qué salsa desea sus " + opcionesPasta + "? (Roja, Blanca, Mixta, de Espinaca)").toLowerCase();

//             let salsaSeleccionada = salsa.find(item => item.nombre.toLowerCase() === opcionesSalsa);

//             if (!salsaSeleccionada) {
//                 alert("Lo sentimos, la salsa seleccionada no está disponible.");
//                 i--;
//                 continue;
//             }

//             totalPedido += pastaSeleccionada.precio + salsaSeleccionada.precio;
//         }

//         alert("El total de su pedido es " + totalPedido.toFixed(2));

//         continuarOrdenando = confirm("¿Desea agregar más platos?");
//     }

//     alert("Su pedido está en camino. Gracias por su compra. ¡Buen provecho!");
// }

// tomarOrden();



const formularioPedido = document.getElementById('formularioPedido');
const seleccionarPasta = document.getElementById('seleccionarPasta');
const seleccionarSalsa = document.getElementById('seleccionarSalsa');
const listaPedidos = document.getElementById('listaPedidos');
const totalPedido = document.getElementById('totalPedido');

// Función para obtener el precio de la pasta seleccionada - Este código me lo dió ChatGPT, no me traía el precio de los sorrentinos
function obtenerPrecioPasta(pastaSeleccionada) {
    const informacionPastaSeleccionada = pastas.find(item => item.nombre.toLowerCase().includes(pastaSeleccionada.toLowerCase())); 
    return informacionPastaSeleccionada ? informacionPastaSeleccionada.precio : 0;
}

// Función para obtener el precio de la salsa seleccionada
function obtenerPrecioSalsa(salsaSeleccionada) {
    return salsas.find(item => item.nombre === salsaSeleccionada)?.precio || 0;
}

// Función para agregar un pedido al resumen
function agregarPedidoAlResumen(pasta, salsa, precioPasta, precioSalsa) {
    // Ajustar el nombre de la salsa para evitar el error gramatical - Este código me lo dió ChatGPT
    const nombreSalsa = salsa === "Espinaca" ? "de Espinaca" : salsa;

    // Crear un nuevo elemento de lista para mostrar el pedido en el resumen
    const elementoLista = document.createElement('li');
    elementoLista.textContent = `${pasta} con salsa ${nombreSalsa} - Precio: $${(precioPasta + precioSalsa).toFixed(2)}`;

    // Agregar el nuevo elemento de lista al resumen del pedido
    listaPedidos.appendChild(elementoLista);

    // Actualizar el total del pedido - Esto me volvió loca también, lo resolví con chatGPT
    let total = parseFloat(totalPedido.textContent.split(':')[1].trim().replace('$', ''));
    total += precioPasta + precioSalsa;
    totalPedido.textContent = `Total del pedido: $${total.toFixed(2)}`;
}

// Función para guardar el pedido en el almacenamiento local
function guardarPedidoEnLocalStorage(pasta, salsa, precioPasta, precioSalsa) {
    // Obtener los pedidos existentes del almacenamiento local o inicializar un array vacío
    const pedidosExistente = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Agregar el nuevo pedido al array de pedidos
    pedidosExistente.push({ pasta, salsa, precioPasta, precioSalsa });

    // Guardar el array actualizado en el almacenamiento local
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistente));
}

// Función para cargar los pedidos almacenados del almacenamiento local al cargar la página
function cargarPedidosDesdeLocalStorage() {
    // Obtener los pedidos del almacenamiento local
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos'));

    // Si hay pedidos almacenados, agregarlos al resumen del pedido y calcular el total
    let total = 0;
    if (pedidosGuardados) {
        pedidosGuardados.forEach(pedido => {
            agregarPedidoAlResumen(pedido.pasta, pedido.salsa, parseFloat(pedido.precioPasta), parseFloat(pedido.precioSalsa));
            total += parseFloat(pedido.precioPasta) + parseFloat(pedido.precioSalsa);
        });
    }
    // Actualizar el total del pedido después de cargar los pedidos
    actualizarTotalPedido(total);
    
    // Manejar el evento click del botón de checkout
    document.getElementById('botonFinalizarCompra').addEventListener('click', function() {
        alert('¡Gracias por tu compra!');
        // Limpiar los pedidos del almacenamiento local después de finalizar la compra
        localStorage.removeItem('pedidos');
        // Limpiar el resumen del pedido
        listaPedidos.innerHTML = '';
        // Actualizar el total del pedido a 0
        actualizarTotalPedido(0);
    });
}

// Función para actualizar el total del pedido en el display
function actualizarTotalPedido(total) {
    totalPedido.textContent = `Total del pedido: $${total.toFixed(2)}`;
}

// Manejar el evento submit del formulario
formularioPedido.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    // Obtener los valores seleccionados por el usuario
    const pastaSeleccionada = seleccionarPasta.value;
    const salsaSeleccionada = seleccionarSalsa.value;

    // Obtener los precios de la pasta y la salsa seleccionadas
    const precioPasta = obtenerPrecioPasta(pastaSeleccionada);
    const precioSalsa = obtenerPrecioSalsa(salsaSeleccionada);

    // Agregar el pedido al resumen del pedido y guardar en el almacenamiento local
    agregarPedidoAlResumen(pastaSeleccionada, salsaSeleccionada, precioPasta, precioSalsa);
    guardarPedidoEnLocalStorage(pastaSeleccionada, salsaSeleccionada, precioPasta, precioSalsa);

    // Limpiar los selectores después de agregar el pedido
    seleccionarPasta.selectedIndex = 0;
    seleccionarSalsa.selectedIndex = 0;
});

// Cargar los pedidos almacenados del almacenamiento local al cargar la página
cargarPedidosDesdeLocalStorage();