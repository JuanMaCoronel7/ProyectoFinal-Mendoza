const contenedor = document.getElementById("contenedor-menu");
const btnCarrito = document.getElementById("btn-carrito");
let carrito = [];

// API local usando Fetch
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('./js/productos.json');
        if (!respuesta.ok) throw new Error("No se pudo conectar con el servidor");
        
        const productos = await respuesta.json();
        mostrarMenu(productos);
    } catch (error) {
        
        console.error("Hubo un error:", error);
        contenedor.innerHTML = "<h3>Error al cargar el menú. Reintente más tarde.</h3>";
    }
};

function mostrarMenu(lista) {
    contenedor.innerHTML = "";
    
    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto-card");
        div.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio}</p>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al Pedido</button>
        `;
        contenedor.appendChild(div);
    });

    // Eventos de botones
    const botones = document.querySelectorAll(".btn-agregar");
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.getAttribute("data-id");
            const productoEncontrado = lista.find(p => p.id == id);
            agregarAlCarrito(productoEncontrado);
        });
    });
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    
    Toastify({
        text: `${producto.nombre} añadido al carrito`,
        duration: 2000,
        gravity: "bottom", 
        position: "right",
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
}

btnCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Agrega algo rico para continuar',
            icon: 'info'
        });
        return;
    }

    let total = carrito.reduce((acc, p) => acc + p.precio, 0);

    Swal.fire({
        title: '¿Confirmar pedido?',
        text: `El total es $${total}. ¿Deseas finalizar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, tengo hambre!',
        cancelButtonText: 'Seguir eligiendo'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('¡Pedido en camino!', 'Tu comida llegará pronto.', 'success');
            carrito = []; 
        }
    });
});

cargarProductos();