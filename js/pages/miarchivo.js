let listaCotizacionesGuardadas = [];
let fechaMonedas = document.getElementById("fecha-monedas");

function cargarMonedasGuardadas() {
    const monedasGuardadas = localStorage.getItem("cotizaciones");
    if (monedasGuardadas) {
        listaCotizacionesGuardadas = JSON.parse(monedasGuardadas);
    }
}
cargarMonedasGuardadas();

/*function construirTarjeta(datosMoneda, rutaImagen) {
    return `<div class="tarjeta">
                    <div class="tarjeta-header">
                      <div class="tarjeta-img-container">
                        <img src="img/${rutaImagen}" alt="" />
                      </div>
                      <div class="title">${datosMoneda.moneda} + " " + ${datosMoneda.nombre}</div>
                    </div>
                    <div class="tarjeta-body">
                      <div class="compra item-tarjeta">
                        <span>Compra</span>
                        <span>$${datosMoneda.compra}</span>
                      </div>
                      <div class="venta item-tarjeta">
                        <span>Venta</span>
                        <span>$${datosMoneda.venta}</span>
                      </div>
                    </div>
                    <div class="tarjeta-footer">
                      <div class="btn-container">
                        <button class="btn-Eliminar">Eliminar</button>
                      </div>
                    </div>
                  </div>`;
}*/
function construirTarjeta(cotizacion,rutaImagen) {
    let div = document.createElement('div');
    div.classList.add('tarjeta');
    div.innerHTML = `
        <div class="tarjeta-header">
                      <div class="tarjeta-img-container">
                        <img src="img/${rutaImagen}" alt="" />
                      </div>
                      <div class="title">${cotizacion.moneda}  ${cotizacion.nombre}</div>
                    </div>
                    <div class="tarjeta-body">
                      <div class="compra item-tarjeta">
                        <span>Compra</span>
                        <span>$${cotizacion.compra}</span>
                      </div>
                      <div class="venta item-tarjeta">
                        <span>Venta</span>
                        <span>$${cotizacion.venta}</span>
                      </div>
                    </div>
                    <div class="tarjeta-footer">
                      <div class="btn-container">
                        <button class="btn-Eliminar">Eliminar</button>
                      </div>
                    </div>
    `;
    return div;
}

function construirDivFecha(fecha) {
    return `<div class="fecha">${fecha}</div>`;
}

// Función para extraer solo la fecha (sin hora) de una fecha ISO
function extraerFechaSinHora(fechaISO) {
    // Divide la cadena ISO en 'T' y devuelve la parte de la fecha (primer elemento del array resultante)
    return fechaISO.split('T')[0];
}

// Función para ordenar y agrupar cotizaciones por fecha (sin hora)
function ordenarYAgruparPorFecha(lista) {
    // Ordenar la lista de cotizaciones por fechaActualizacion
    lista.sort((a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion));

    // Agrupar las cotizaciones por fechaActualizacion (sin hora)
    let grupos = lista.reduce((listaAgrupados, cotizacion) => {
        // Extrae solo la fecha sin la hora de fechaActualizacion
        let fechaSinHora = extraerFechaSinHora(cotizacion.fechaActualizacion);
        // Si no existe un grupo para esta fecha, lo crea como un array vacío
        if (!listaAgrupados[fechaSinHora]) {
            listaAgrupados[fechaSinHora] = [];
        }
        // Añade la cotizacion actual al grupo correspondiente a la fecha sin hora
        listaAgrupados[fechaSinHora].push(cotizacion);
        // Devuelve el acumulador para la siguiente iteración
        return listaAgrupados;
    }, {});

    // Devuelve el objeto con las cotizaciones agrupadas por fecha
    return grupos;
}

// Usar la función para ordenar y agrupar las cotizaciones
let cotizacionesAgrupadas = ordenarYAgruparPorFecha(listaCotizacionesGuardadas);

function MostrarTarjetas() {
    cargarMonedasGuardadas();
    let urlBandera;
    let tarjetasContainer = document.createElement('div');
    tarjetasContainer.classList.add('tarjetas-container');
    // Iterar sobre las claves del objeto cotizacionesAgrupadas
    Object.entries(cotizacionesAgrupadas).forEach(([fecha, cotizaciones]) => {
        // Mostrar la fecha y las cotizaciones
        console.log(`Fecha: ${fecha}`);
        fechaMonedas.innerHTML += construirDivFecha(fecha);
        cotizaciones.forEach(cotizacion => {
            console.log(cotizacion);
            if (cotizacion.moneda == 'USD') {
                urlBandera = 'usd.svg';
            }else if(cotizacion.moneda == 'EUR'){
                urlBandera = 'eur.svg';
            }else if(cotizacion.moneda == 'BRL'){
                urlBandera = 'brl.svg';
            }else if(cotizacion.moneda == 'CLP'){
                urlBandera = 'clp.svg';
            }else{
                urlBandera = 'uyu.svg';
            }
            let tarjetaNueva = construirTarjeta(cotizacion,urlBandera);
            tarjetasContainer.appendChild(tarjetaNueva);
            //tarjetasContainer.innerHTML += tarjetaNueva;
        });
    });
    //fechaMonedas.innerHTML += tarjetasContainer;
    fechaMonedas.appendChild(tarjetasContainer);
    //fechaMonedas.insertBefore(tarjetasContainer);
}



MostrarTarjetas();