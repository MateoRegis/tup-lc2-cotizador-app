/////////////////////////Obtener elementos del DOM//////////////////////////////////////

//me traigo el boton de selector moneda
const btnSelectorMoneda = document.getElementById("btn-selector-moneda");

const modal = document.getElementById("modal");
const linkCompartir = document.getElementById("link-compartir-info");
const closeButton = document.querySelectorAll(".close-button");
const formCompartir = document.getElementById("formularioCompartir");

const tableBody = document.getElementById("table-body");

//cuando se haga click en este boton quiero que se agregue un select
let selectorDesplegable = document.getElementById("selector-container");

const nombreBandera = document.getElementById("nombre-bandera");
const nombreBanderaFlagImg = nombreBandera.querySelector(".flag img");

const nombreBanderaNombre = nombreBandera.querySelector(".nombre");

////////////////////////////////////////////////////
////////////////////////Definimos variables globales///////////////////////////////////////////

//este iconito es el que voy a usar para indicar que una moneda esta seleccionada en el selector
let iconoCheck = `<i class="fa-solid fa-check"></i>`;
let monedaSeleccionada;
let chartInstance = null; // Variable para almacenar la instancia del gráfico

////////////////////////////////////////////////////////
//////////////////////////principal/////////////////////////////////////

//este evento se activa cuando se carga el  dom
//dibujamos el grafico y la tabla
document.addEventListener("DOMContentLoaded", () => {
  const cotizaciones = localStorage.getItem("cotizaciones");
  if (!cotizaciones || cotizaciones === "[]") {
    console.log("Estoy entrando al if.");
    Swal.fire({
      title: "Informes",
      text: "Debes guardar cotizaciones para que aparezca aquí un informe.",
      icon: "info",
    });
    document.querySelector(
      "main"
    ).innerHTML = `<h2 class="aviso">Debes guardar cotizaciones para que aparezcan aquí.</h2>`;
  } else {
    MostrarGrafico("0");
    const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    // Ordenar los datos por fecha de la más actual a la menos actual
    datosOrdenadosDescendente = data.sort(
      (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
    );

    // Generar filas de la tabla dependiendo de cuanta info hay en el local storage
    datosOrdenadosDescendente.forEach((moneda) => {
      const fila = document.createElement("tr");

      const celdaMoneda = document.createElement("td");
      celdaMoneda.textContent = moneda.moneda + " " + moneda.casa;
      fila.appendChild(celdaMoneda);

      const celdaFecha = document.createElement("td");
      celdaFecha.textContent = extraerFechaSinHora(moneda.fechaActualizacion);
      fila.appendChild(celdaFecha);

      const celdaCompra = document.createElement("td");
      celdaCompra.textContent = moneda.compra;
      fila.appendChild(celdaCompra);

      const celdaVenta = document.createElement("td");
      celdaVenta.textContent = moneda.venta;
      fila.appendChild(celdaVenta);

      const celdaVariacion = document.createElement("td");
      const icono = document.createElement("i");

      if (
        !actualizarIconoConRegistrosPrevios(
          datosOrdenadosDescendente,
          moneda,
          icono
        )
      ) {
        actualizarIconoConRegistrosNuevos(data, moneda, icono);
      }

      //agregamos el icono a la celda
      celdaVariacion.appendChild(icono);
      //agregamos la celda a la fila
      fila.appendChild(celdaVariacion);
      //una vez que tenemos toda la fila cargada la agregamos a la tabla
      tableBody.appendChild(fila);
    });
  }
});

function actualizarIconoConRegistrosPrevios(data, moneda, icono) {
  let dataPrevia = data.filter(
    (item) =>
      item.moneda === moneda.moneda &&
      item.casa === moneda.casa &&
      item.fechaActualizacion < moneda.fechaActualizacion
  );

  // Validamos si se encontraron elementos que cumplen con los requisitos
  if (dataPrevia.length > 0) {
    // Guardamos el último elemento de dataPrevia, el más reciente antes de moneda.fechaActualizacion
    let ultimoRegistro = dataPrevia[dataPrevia.length - 1];
    // Comparamos si el precio de compra es mayor o menor
    if (moneda.compra > ultimoRegistro.compra) {
      icono.className = "fa-solid fa-arrow-up";
    } else if (moneda.compra < ultimoRegistro.compra) {
      icono.className = "fa-solid fa-arrow-down";
    } else {
      icono.className = "fa-solid fa-minus";
    }
    return true;
  } else {
    return false;
  }
}

function actualizarIconoConRegistrosNuevos(data, moneda, icono) {
  data.sort(
    (a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
  );

  let datanueva = data.filter(
    (item) =>
      item.moneda === moneda.moneda &&
      item.casa === moneda.casa &&
      item.fechaActualizacion > moneda.fechaActualizacion
  );

  if (datanueva.length > 0) {
    let primerRegistro = datanueva[0];
    if (moneda.compra > primerRegistro.compra) {
      icono.className = "fa-solid fa-arrow-up";
    } else if (moneda.compra < primerRegistro.compra) {
      icono.className = "fa-solid fa-arrow-down";
    } else {
      icono.className = "fa-solid fa-minus";
    }
  }
}

//este evento se activa cuando un usuario hace click en el selector
btnSelectorMoneda.addEventListener("click", function () {
  //si el valor de la propiedad esta en none al hacer click significa que tengo que mostrar el selector, entonces lo que hago es  setear el valor de display en flex
  if (getComputedStyle(selectorDesplegable).display == "none") {
    selectorDesplegable.style.display = "flex";
    //ahora que se desplego el selector aprovecho para guardarme todas las opciones de monedas
    opcionesMonedas = document.querySelectorAll(".selector-option-container");

    //como esto me devuelve una lista de nodos, tengo que recorrer nodo por nodo, le agrego un evento click y me guardo el valor del atributo data currency del div clickeado
    opcionesMonedas.forEach((opcion) => {
      opcion.addEventListener("click", function () {
        //obtengo el elemento span en la opcion
        let span = opcion.querySelector("span");
        //al span de la opcion seleccionada le agrego el icono de iconoCheck

        // Agregar el icono de check al span
        span.innerHTML = iconoCheck;

        //en moneda seleccionada obtengo el valor del atributo data currency de la opcion clickeada
        monedaSeleccionada = opcion.getAttribute("data-currency");
        console.log(monedaSeleccionada);
        //monedaSeleccionada = 0 = Todas
        //monedaSeleccionada = 1 = Dolar oficial
        //monedaSeleccionada = 2 = Dolar Blue
        //monedaSeleccionada = 3 = Dolar Bolsa
        //monedaSeleccionada = 4 = Dolar CCL
        //monedaSeleccionada = 5 = Dolar Mayorista
        //monedaSeleccionada = 6 = Dolar Cripto
        //monedaSeleccionada = 7 = Dolar Tarjeta
        //monedaSeleccionada = 8 = Euro
        //monedaSeleccionada = 9 = Real Brasileño
        //monedaSeleccionada = 10 = peso chileno
        //monedaSeleccionada = 11 = peso uruguayo
        MostrarGrafico(monedaSeleccionada);

        //despues de mostrar las tarjetas oculto el desplegable
        selectorDesplegable.style.display = "none";
      });
    });
    //lo que hago aca es limpiar todos los span de las opciones que no sean la opcion clickeada
    opcionesMonedas.forEach((opcion) => {
      if (opcion.getAttribute("data-currency") != monedaSeleccionada) {
        opcion.querySelector("span").innerHTML = "";
      }
    });
  } else if (getComputedStyle(selectorDesplegable).display == "flex") {
    //por otro lado si el valor de la propiedad display es flex al momento de hacer click significa que tengo que ocultar el selector, entonces seteo el display en none
    selectorDesplegable.style.display = "none";
  }
});
// Función para mostrar el gráfico
function MostrarGrafico(selectedOption) {
  selectedOption = parseInt(selectedOption);
  let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || [];
  let rutaImagen;
  let rutaImagenUsd = "usd.svg";
  // Filtrar las cotizaciones según la opción seleccionada
  //de las cotizaciones recuperadas del local storage lo que hacemos el filtrar las que coinciden con la opcion seleccionada por el usuario
  let datosFiltrados = cotizaciones.filter((item) => {
    switch (selectedOption) {
      case 0: // Todas las monedas
        rutaImagen = "noun-world-2699516.svg";
        nombreBanderaFlagImg.src = "img/" + rutaImagen;
        nombreBanderaNombre.textContent = "Todas";
        return true;
      case 1:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Oficial";
        return item.moneda === "USD" && item.casa === "oficial";
      case 2:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Blue";
        return item.moneda === "USD" && item.casa === "blue";
      case 3:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Bolsa";
        return item.moneda === "USD" && item.casa === "bolsa";
      case 4:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "CCL";
        return item.moneda === "USD" && item.casa === "contadoconliqui";
      case 5:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Mayorista";
        return item.moneda === "USD" && item.casa === "mayorista";
      case 6:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Cripto";
        return item.moneda === "USD" && item.casa === "cripto";
      case 7:
        nombreBanderaFlagImg.src = "img/" + rutaImagenUsd;
        nombreBanderaNombre.textContent = "Tarjeta";
        return item.moneda === "USD" && item.casa === "tarjeta";
      case 8:
        rutaImagen = "eur.svg";
        nombreBanderaFlagImg.src = "img/" + rutaImagen;
        nombreBanderaNombre.textContent = "EUR";
        return item.moneda === "EUR" && item.casa === "oficial";
      case 9:
        rutaImagen = "brl.svg";
        nombreBanderaFlagImg.src = "img/" + rutaImagen;
        nombreBanderaNombre.textContent = "BRL";
        return item.moneda === "BRL" && item.casa === "oficial";
      case 10:
        rutaImagen = "clp.svg";
        nombreBanderaFlagImg.src = "img/" + rutaImagen;
        nombreBanderaNombre.textContent = "CLP";
        return item.moneda === "CLP" && item.casa === "oficial";
      case 11:
        rutaImagen = "uyu.svg";
        nombreBanderaFlagImg.src = "img/" + rutaImagen;
        nombreBanderaNombre.textContent = "UYU";
        return item.moneda === "UYU" && item.casa === "oficial";
      default:
        return false;
    }
  });

   // Verificar si no hay datos filtrados y mostrar un mensaje de alerta
   if (datosFiltrados.length === 0) {
    Swal.fire({
      title: "Sin datos",
      text: "No hay cotizaciones guardadas para la moneda seleccionada.",
      icon: "warning",
    });
    return;
  }
  

  // Llamar a la función para dibujar el gráfico con los datos filtrados
  dibujarGrafico(datosFiltrados, selectedOption);
}

//como los datos obtenidos de la api nos da una fecha con formato iso, hacemos esta funcion para quedarnos solamente con la fecha, sin hora
function extraerFechaSinHora(fechaISO) {
  return fechaISO.split("T")[0];
}

//este evtno se activa cuando un usuario hace click en el link de compartir info
linkCompartir.addEventListener("click", (event) => {
  event.preventDefault();
  modal.style.display = "block";
});

//este evento es para cerrar el modal de compartir info
closeButton.forEach((button) => {
  button.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

//este evento es para cerra el modal de compartir info al hacer click en cualquier parte de la ventana
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

//este evento se activa cuando se hace click en el boton enviar en el formulario de compartir información
//guardamos la info de los inputs, osea nombre y correo y nos guardamos la info de la tabla
//con la info de la tabla armamos el body del correo a enviar
formCompartir.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const table = document.getElementById("cotizaciones-table");
  const filas = Array.from(table.querySelectorAll("tr"));
  let tableContent = "";

  // Capturar encabezados de la tabla, excepto el último
  const headers = Array.from(table.querySelectorAll("th:not(:last-child)")).map(
    (th) => "|" + th.textContent
  );

  tableContent += headers.join("\t") + "\n";

  // Capturamos filas de la tabla y vamos guardando en tablecontent el contenido de latabla celda por celda
  filas.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowContent = Array.from(cells)
      .map((cell) => "|" + cell.textContent)
      .join("\t\t");
    tableContent += rowContent + "\n";
  });

  const subject = "Información de Cotizaciones";
  const body = `Hola ${name},\n\nAquí tienes la información de cotizaciones:\n\n${tableContent}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  modal.style.display = "none";
});

// Función para dibujar el gráfico
function dibujarGrafico(cotizaciones, selectedOption) {
  // Destruir el gráfico anterior si existe
  if (chartInstance) {
    chartInstance.destroy();
  }
  // Ordenar los datos por fecha de la más actual a la menos actual
  cotizaciones.sort(
    (a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
  );

  // Preparar datos para Chart.js
  const data = {};

  cotizaciones.forEach((item) => {
    const key = `${item.moneda}-${item.casa}`;
    if (!data[key]) {
      data[key] = {
        labels: [],
        prices: [],
        salePrices: [],
      };
    }
    data[key].labels.push(item.fechaActualizacion);
    data[key].prices.push(item.compra);
    data[key].salePrices.push(item.venta);
  });

  // Configurar datasets para Chart.js
  const datasets = Object.keys(data).map((key) => {
    const [moneda, casa] = key.split("-");
    return {
      label:
        selectedOption === 0
          ? `${moneda} (${casa})`
          : `${moneda} (${casa}) - Compra`,
      data: data[key].prices,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.4,
    };
  });

  if (selectedOption !== 0) {
    const saleDatasets = Object.keys(data).map((key) => {
      const [moneda, casa] = key.split("-");
      return {
        label: `${moneda} (${casa}) - Venta`,
        data: data[key].salePrices,
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.4,
      };
    });
    datasets.push(...saleDatasets);
  }

  // Crear gráfico con Chart.js
  const ctx = document.getElementById("cotizaciones-chart").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: data[Object.keys(data)[0]].labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Fecha de Actualización",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: selectedOption === 0 ? "Precio de Compra" : "Precio",
          },
        },
      },
    },
  });

  // Función para generar colores aleatorios
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
