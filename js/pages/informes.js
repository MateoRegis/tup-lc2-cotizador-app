//////////////////////////////////////////
////////// Obtener elementos del DOM //////////
// me traigo el botón de selector moneda
const btnSelectorMoneda = document.getElementById("btn-selector-moneda");
const linkCompartir = document.getElementById("link-compartir-info");
const tableBody = document.getElementById("table-body");
let selectorDesplegable = document.getElementById("selector-container");
const nombreBandera = document.getElementById("nombre-bandera");
const nombreBanderaFlagImg = nombreBandera.querySelector(".flag img");
const nombreBanderaNombre = nombreBandera.querySelector(".nombre");

//////////////////////////////////////////
////////// Definimos variables globales //////////
let iconoCheck = `<i class="fa-solid fa-check"></i>`;
let monedaSeleccionada;
let chartInstance = null;

//////////////////////////////////////////
////////// Funciones de ayuda //////////
// Extraer fecha sin hora
function extraerFechaSinHora(fechaISO) {
  return fechaISO.split("T")[0];
}

// Actualizar icono con registros previos
function actualizarIconoConRegistrosPrevios(data, moneda, icono) {
  let dataPrevia = data.filter(
    (item) =>
      item.moneda === moneda.moneda &&
      item.casa === moneda.casa &&
      new Date(item.fechaActualizacion) < new Date(moneda.fechaActualizacion)
  );

  if (dataPrevia.length > 0) {
    let ultimoRegistro = dataPrevia[dataPrevia.length - 1];
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

// Actualizar icono con registros nuevos
function actualizarIconoConRegistrosNuevos(data, moneda, icono) {
  const dataOrdenada = data.sort(
    (a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
  );

  let datanueva = dataOrdenada.filter(
    (item) =>
      item.moneda === moneda.moneda &&
      item.casa === moneda.casa &&
      new Date(item.fechaActualizacion) > new Date(moneda.fechaActualizacion)
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

// Mostrar gráfico
function MostrarGrafico(selectedOption) {
  selectedOption = parseInt(selectedOption);
  let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || [];
  let rutaImagen;
  let rutaImagenUsd = "usd.svg";

  let datosFiltrados = cotizaciones.filter((item) => {
    switch (selectedOption) {
      case 0:
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

  if (datosFiltrados.length === 0) {
    Swal.fire({
      title: "Sin datos",
      text: "No hay cotizaciones guardadas para la moneda seleccionada.",
      icon: "warning",
    });
    return;
  }

  dibujarGrafico(datosFiltrados, selectedOption);
}

// Dibujar gráfico
// funcion para mostrar el grafico
function dibujarGrafico(cotizaciones, selectedOption) {
  // destruimos el grafico anterior si ya existre
  // lo destruimos para poder crear uno nuevo, sino nos tira error, es como que no puede dibujar un nuevo grafico si ya existe uno, por eso primero lo eliminamos
  if (chartInstance) {
    chartInstance.destroy();
  }

  //con sort ordenamos los datos por fecha de mas actual a menos actual basandonos en la fecha de actualizacion
  cotizaciones.sort(
    (a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
  );

  // Creamos un objeto para almacenar los datos que vamos a usar para el grafico
  const data = {};

  // iteramos sobre cada cotizacion para organizar los datos
  cotizaciones.forEach((item) => {
    // Creamos una clave unica para cada combinación de moneda y casa de cambio
    const key = `${item.moneda}-${item.casa}`;
    // Si la clave no existe en el objeto data, la inicializamos con arrays vacios
    if (!data[key]) {
      data[key] = {
        labels: [],
        prices: [],
        salePrices: [],
      };
    }
    // Añadimos los datos de la cotización actual a los arrays correspondientes
    data[key].labels.push(extraerFechaSinHora(item.fechaActualizacion)); // Fechas de actualización
    data[key].prices.push(item.compra); // Precios de compra
    data[key].salePrices.push(item.venta); // Precios de venta
  });

  // creamos los conjuntos de datos (datasets) para el chart basandonos en los datos preparados
  const datasets = Object.keys(data).map((key) => {
    const [moneda, casa] = key.split("-"); // dividimos la clave en moneda y casa de cambio con split, y como antes le habiamos puesto un "-" entonces lo podemos hacer facilmente
    return {
      label:
        selectedOption === 0
          ? `${moneda} (${casa})` // Etiqueta para el grafico de precios de compra
          : `${moneda} (${casa}) - Compra`, // Etiqueta para otro tipo de grafico
      data: data[key].prices, // Datos de precios de compra
      fill: false, // No rellenar el area bajo la linea
      borderColor: getRandomColor(), // Color aleatorio para la línea
      tension: 0.4, // Suavizar la linea del gráfico
    };
  });

  // Si la opción seleccionada no es 0, añadir datasets para los precios de venta
  if (selectedOption !== 0) {
    const saleDatasets = Object.keys(data).map((key) => {
      const [moneda, casa] = key.split("-"); // Dividimos la clave en moneda y casa de cambio nuevamente
      return {
        label: `${moneda} (${casa}) - Venta`, // Etiqueta para el grafico de precios de venta
        data: data[key].salePrices, // Datos de precios de venta
        fill: false, // No rellenar el area bajo la línea
        borderColor: getRandomColor(), // Color aleatorio para la linea
        tension: 0.4, // Suavizar la línea del gráfico
      };
    });
    // Añadimos los datasets de venta a los datasets existentes
    datasets.push(...saleDatasets);
  }

  // accedemos al elemento canva
  const ctx = document.getElementById("cotizaciones-chart");
  // Creamos una nueva instancia de Chart.js para dibujar el grafico y lo guardamos en chart instance para despues validar si ya existe un grafico
  chartInstance = new Chart(ctx, {
    type: "line", // Tipo de gráfico: línea
    data: {
      labels: data[Object.keys(data)[0]].labels, // Usamos las etiquetas (fechas) del primer conjunto de datos
      datasets: datasets, // Conjuntos de datos para el grafico
    },
    options: {
      responsive: true, // Hacer que el grafico sea responsivo
      plugins: {
        tooltip: {
          mode: "index", // Mostrar tooltips por indice
          intersect: false, // No requerir intersección para mostrar tooltips
        },
      },
      scales: {
        x: {
          display: true, // Mostrar eje X
          title: {
            display: true, // Mostrar titulo del eje X
            text: "Fecha de Actualización", // Texto del titulo del eje X
          },
        },
        y: {
          display: true, // Mostrar eje Y
          title: {
            display: true, // Mostrar título del eje Y
            text: selectedOption === 0 ? "Precio de Compra" : "Precio", // Texto del titulo del eje Y
          },
        },
      },
    },
  });

  // Función para generar colores aleatorios
  // Esta función crea un color hexadecimal aleatorio
  function getRandomColor() {
    const letters = "0123456789ABCDEF"; // Caracteres hexadecimales
    let color = "#"; // Comienza con #
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]; // Añade 6 caracteres aleatorios
    }
    return color; // Devuelve el color generado
  }
}

//////////////////////////////////////////
////////// Eventos del DOM //////////
document.addEventListener("DOMContentLoaded", () => {
  //recuperamos la cotizaciones del local storage
  let cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || [];

  //validamos si hay informacion en el local storage, si no hay mostramos un mensajito
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
    //si hay informacion, mostramos el grafico
    MostrarGrafico("0");
  }

  //luego preparamos los datos para mostrarlos en la tabla
  //ordenamos de mas actual a menos actual
  cotizaciones = cotizaciones.sort(
    (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
  );

  //recorremos las cotizaciones que recuperamos del local storage, creamos una fila por cada cotizacion
  cotizaciones.forEach((cotizacion) => {
    const row = document.createElement("tr");

    //luego empezamos a crear las celdas que queremos mostrar: moneda - fecha - compra - venta - variacion
    //celda de moneda en donde combinamos moneda- casa
    const cellMoneda = document.createElement("td");
    cellMoneda.textContent = cotizacion.moneda + " " + cotizacion.casa;
    row.appendChild(cellMoneda);

    //celda de fecha
    const cellFecha = document.createElement("td");
    cellFecha.textContent = extraerFechaSinHora(cotizacion.fechaActualizacion);
    row.appendChild(cellFecha);

    //celda de precio de compra
    const cellCompra = document.createElement("td");
    cellCompra.textContent = cotizacion.compra;
    row.appendChild(cellCompra);


    //celda de precio de venta
    const cellVenta = document.createElement("td");
    cellVenta.textContent = cotizacion.venta;
    row.appendChild(cellVenta);


    //celda del icono de variacion
    const cellIcono = document.createElement("td");
    const icono = document.createElement("i");

    actualizarIconoConRegistrosPrevios(cotizaciones, cotizacion, icono);
    cellIcono.appendChild(icono);

    
    row.appendChild(cellIcono);

    //luego de cargar todas las celdas en la fila, cargamos la fila en el bdoy de la tabla
    tableBody.appendChild(row);
  });
});



//este evtno se activa cuando un usuario hace click en el link de compartir info
linkCompartir.addEventListener("click", (event) => {
  Swal.fire({
    title: "Compartir Información",
    html:
      '<form id="formularioCompartir">' +
      '<label for="name">Nombre:</label>' +
      '<input type="text" id="name" name="name" required class="swal2-input">' +
      '<label for="email">Email:</label>' +
      '<input type="email" id="email" name="email" required class="swal2-input">' +
      "</form>",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    preConfirm: () => {
      const name = Swal.getPopup().querySelector("#name").value;
      const email = Swal.getPopup().querySelector("#email").value;
      if (!name || !email) {
        Swal.showValidationMessage(`Por favor completa ambos campos`);
      }
      return { name: name, email: email };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(result.value);
      enviarFormulario(result.value.name, result.value.email);
    }
  });
});

//esta funcion la llamamos cuando hacemos click en enviar en el modal de sweealert
//le pasamos por parametro el nombre y e email
function enviarFormulario(name, email) {
  //recuperamos del dom la tabla
  const table = document.getElementById("cotizaciones-table");
  //aca recorremos todas las filas de la tabla
  const filas = Array.from(table.querySelectorAll("tr"));
  let tableContent = "";

  // Capturar encabezados de la tabla
  const headers = Array.from(table.querySelectorAll("th")).map(
    (th) => th.textContent
  );

  tableContent += headers.join("\t") + "\n";

  // Capturamos filas de la tabla y vamos guardando en tableContent el contenido de la tabla celda por celda
  filas.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowContent = Array.from(cells)
      .map((cell) => cell.textContent)
      .join("\t\t");
    tableContent += rowContent + "\n";
  });

  const subject = "Información de Cotizaciones";
  const body = `Hola ${name},\n\nAquí tienes la información de cotizaciones:\n\n${tableContent}`;

  // Verifica la longitud del cuerpo del correo
  if (body.length > 2000) {
    console.log(
      "El cuerpo del correo es demasiado largo y puede no abrirse correctamente en algunos clientes de correo."
    );
  }
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
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