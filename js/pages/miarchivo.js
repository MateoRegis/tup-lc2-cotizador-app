////////////////////////////// Obtener elementos del DOM  ///////////////////////////////////////////////////////////////////////////////
let fechaMonedas = document.getElementById("fecha-monedas");

////variables globales

//esta vaarible la vamos a usar para guardar la informacion que recuperamos del storage
let listaCotizacionesGuardadas = [];

//////////////////////////////////////////////////
//////////////////////Principal//////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {


  const cotizaciones = localStorage.getItem("cotizaciones");


  if (!cotizaciones || cotizaciones === "[]") {
    console.log("Estoy entrando al if.");
    Swal.fire({
      title: "Favoritos",
      text: "No hay cotizaciones guardadas.",
      icon: "info",
    });
    document.querySelector(
      "main"
    ).innerHTML = `<h2 class="aviso">Debes guardar cotizaciones para que aparezcan aquí.</h2>`;
  }
});


//Esta funcion nos sirve para recuperar los datos del local storage
function cargarMonedasGuardadas() {
  //monedas guardadas se va a cargar con los datos del local storage
  let monedasGuardadas = localStorage.getItem("cotizaciones");
  if (monedasGuardadas) {
    //como en el local storage solo se guarda texto, entonces lo convertimos en json para poder manipular los datos en nuestro codigo
    listaCotizacionesGuardadas = JSON.parse(monedasGuardadas);
    //lista cotizaciones guardadas es una lista de objetos "cotizacion"
  }
}

//en esta funcion simplemente contruimos la tarjeta de la cotizacion con los datos que le pasamos por parametro
function construirTarjeta(cotizacion, rutaImagen) {
  let div = document.createElement("div");
  div.classList.add("tarjeta");
  div.innerHTML = `
        <div class="tarjeta-header">
            <div class="tarjeta-img-container">
                <img src="img/${rutaImagen}" alt="" />
            </div>
            <div class="title">${cotizacion.moneda} ${cotizacion.nombre}</div>
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
                <button class="btn-Eliminar" data-favorita='${JSON.stringify(
    cotizacion
  )}'  onClick="eliminarCotizacion(this)">Eliminar</button>
            </div>
        </div>
    `;
  return div;
}

// Función para eliminar la cotización del almacenamiento local
function eliminarCotizacion(button) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let cotizacionEliminar = JSON.parse(button.getAttribute("data-favorita"));
      console.log(cotizacionEliminar);
      listaCotizacionesGuardadas = listaCotizacionesGuardadas.filter(
        (item) =>
          !(
            item.fechaActualizacion === cotizacionEliminar.fechaActualizacion &&
            item.moneda === cotizacionEliminar.moneda &&
            item.casa === cotizacionEliminar.casa
          )
      );
      localStorage.setItem(
        "cotizaciones",
        JSON.stringify(listaCotizacionesGuardadas)
      );
      Swal.fire(
        "Eliminado",
        "La cotización ha sido eliminada.",
        "success"
      ).then(() => {
        window.location = "Miarchivo.html";
      });
    }
  });
}

//esta funcion la usamos para contruir el div donde va la fecha de la cotizacion
function construirDivFecha(fecha) {
  let div = document.createElement("div");
  div.classList.add("fecha");
  div.textContent = fecha;
  return div;
}

//como los datos obtenidos de la api nos da una fecha con formato iso, hacemos esta funcion para quedarnos solamente con la fecha, sin hora
function extraerFechaSinHora(fechaISO) {
  return fechaISO.split("T")[0];
}

//esta funcion la usamos para agrupar y ordenar los datos por fecha
function ordenarYAgruparPorFecha(lista) {
  //sort es un metodo de arrays, definimos dos "variables", a y b, y evaluamos (cabe recordar que lista que le pasamos es una lista de objetos, es decir que cada elemento de la lista tiene propiedades) si la fecha de fechaActualizacion de b es mayor que la fecha de fechaActualizacion que a, esto lo hacemos mediante una resta, si la resta da positivo significa que b es mayor que a, si la resta da negativo significa que a mayor que b, entonces asi ordenamos la lista por fecha de mas actual a menos actual
  lista.sort(
    (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
  );

  //en la variable grupos nos vamos a guardar la nueva lista agrupada por fecha
  //reduce es un metodo de arrays, se pasa por parametro una funcion, y un valor inicial, en nuestro caso solo le pasamos la funcion, el valor inicial no se lo damos, y como no se lo damos, el primer elemento del array se utiliza como el initialValue y reduce comienza a partir del segundo elemento.
  //la funcion que se pasa por parametro debe tener 4 parametros: total - currentValue - currentIndex - array
  // el total y el current value son obligatorios, los otros dos son opcionales.
  //total hace la funcion de un acumulador
  //el total que nosotros le pasamos es listaAgrupados, es decir que en lista agrupados vamos a acumular el valor de vuelto por la funcion.
  //lo inicializamos vacio.
  //el currentValue que nosotros le pasamos a la funcion es cotizacion, que es el elemento actual-
  //luego dentro de la funcion lo que hacemos es construir el div de la fecha sin hora, inicializar la lista como vacia, y luego ir cargando las cotizaciones, se usa fechaSinHora como indice
  // finalmente retornamos list agrupados pero como todo esto lo asignamos en la variable grupos, entonces lo que hacemos es retornar grupos, y asi logramos ordenar y agrupar las cotizaciones por fecha.
  let grupos = lista.reduce((listaAgrupados, cotizacion) => {
    let fechaSinHora = extraerFechaSinHora(cotizacion.fechaActualizacion);
    if (!listaAgrupados[fechaSinHora]) {
      listaAgrupados[fechaSinHora] = [];
    }
    listaAgrupados[fechaSinHora].push(cotizacion); //lista agrupados es un objeto de listas de cotizaciones en donde usa las fechas como indices
    return listaAgrupados;
  }, {});
  return grupos;
}

//en esta funcion mostramos las tarjetas
function MostrarTarjetas() {
  //lo primero que hacemos es recuperar los datos del local storage con la funcion cargarMonedasGuardadas
  cargarMonedasGuardadas();
  //luego con los datos obtenidos del local lo que hacemos es ordenarlo y agruparlo con la funcion hecha anteriormente
  let cotizacionesAgrupadas = ordenarYAgruparPorFecha(
    listaCotizacionesGuardadas
  );

  //object entries es una funcion para convertir un objeto en una matriz de pares clave-valor.
  // Cada par se representa como un array con dos elementos: el primer elemento es la clave y el segundo elemento es el valor.
  //en nuestro caso el objeto es lo que le pasamos por parametro: cotizacionesAgrupadas
  //lo utilizamos con un for each para recorrer todos los pares clave-valor del objeto
  //clave: fecha
  //valor: cotizaciones
  //despues simplemente lo que hacemos es construir las fechas y las tarjetas y mostrarlas.
  Object.entries(cotizacionesAgrupadas).forEach(([fecha, cotizaciones]) => {
    //contruimos el div de fecha
    let fechaDiv = construirDivFecha(fecha);
    //lo agregamos en el contenedor principal
    fechaMonedas.appendChild(fechaDiv);

    //aca creamos un contenedor para las tarjetas
    let tarjetasContainer = document.createElement("div");
    tarjetasContainer.classList.add("tarjetas-container");

    //dependiendo la moneda que sea, definimos el url de la banderita
    cotizaciones.forEach((cotizacion) => {
      let urlBandera;
      switch (cotizacion.moneda) {
        case "USD":
          urlBandera = "usd.svg";
          break;
        case "EUR":
          urlBandera = "eur.svg";
          break;
        case "BRL":
          urlBandera = "brl.svg";
          break;
        case "CLP":
          urlBandera = "clp.svg";
          break;
        default:
          urlBandera = "uyu.svg";
      }
      //contruimos la tarjeta
      let tarjetaNueva = construirTarjeta(cotizacion, urlBandera);
      //la agregamos en el contenedor de tarjetas
      tarjetasContainer.appendChild(tarjetaNueva);
    });
    //finalmente agregamos el contenedor de tarjetas al contenedor principal
    fechaMonedas.appendChild(tarjetasContainer);
  });
}

//llamamos a la funcion para mostrar las tarjetas
MostrarTarjetas();