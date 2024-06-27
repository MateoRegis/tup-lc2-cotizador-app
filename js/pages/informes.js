//me traigo el boton de selector moneda
let btnSelectorMoneda = document.getElementById("btn-selector-moneda");

//cuando se haga click en este boton quiero que se agregue un select
let selectorDesplegable = document.getElementById("selector-container");

//este iconito es el que voy a usar para indicar que una moneda esta seleccionada en el selector
let iconoCheck = `<i class="fa-solid fa-check"></i>`;
let monedaSeleccionada;

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

//como los datos obtenidos de la api nos da una fecha con formato iso, hacemos esta funcion para quedarnos solamente con la fecha, sin hora
function extraerFechaSinHora(fechaISO) {
  return fechaISO.split("T")[0];
}
document.addEventListener("DOMContentLoaded", () => {
  dibujarGrafico();
  const tableBody = document.getElementById("table-body");
  const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
  // Ordenar los datos por fecha de la más actual a la menos actual
  data.sort(
    (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
  );

  // Generar filas de la tabla
  data.forEach((moneda) => {
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
    const dataPrevia = data.filter(
      (m) =>
        m.moneda === moneda.moneda &&
        m.casa === moneda.casa &&
        m.fechaActualizacion < moneda.fechaActualizacion
    );
    if (dataPrevia.length > 0) {
      const ultimoRegistro = dataPrevia[dataPrevia.length - 1];
      if (moneda.compra > ultimoRegistro.compra) {
        icono.className = "fa-solid fa-arrow-up";
      } else if (moneda.compra < ultimoRegistro.compra) {
        icono.className = "fa-solid fa-arrow-down";
      }
    }
    celdaVariacion.appendChild(icono);
    fila.appendChild(celdaVariacion);

    tableBody.appendChild(fila);
  });
});

const modal = document.getElementById("modal");
const shareLink = document.getElementById("share-link");
const closeButton = document.querySelectorAll(".close-button");
const shareForm = document.getElementById("share-form");

shareLink.addEventListener("click", (event) => {
  event.preventDefault();
  modal.style.display = "block";
});

closeButton.forEach((button) => {
  button.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

shareForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const table = document.getElementById("cotizaciones-table");
  const rows = Array.from(table.querySelectorAll("tr"));
  let tableContent = "";

  // Capturar encabezados de la tabla, excepto el último
  const headers = Array.from(table.querySelectorAll("th:not(:last-child)")).map(
    (th) => th.textContent
  );
  tableContent += headers.join("\t") + "\n";

  // Capturar filas de la tabla
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowContent = Array.from(cells)
      .map((cell) => cell.textContent)
      .join("\t");
    tableContent += rowContent + "\n";
  });

  const subject = "Información de Cotizaciones";
  const body = `Hola ${name},\n\nAquí tienes la información de cotizaciones:\n\n${tableContent}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  modal.style.display = "none";
});


function dibujarGrafico(){
  const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
  // Ordenar los datos por fecha de la más actual a la menos actual
  cotizaciones.sort((a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion));

  // Preparar datos para Chart.js
  const data = {};
  cotizaciones.forEach(entry => {
    const key = `${entry.moneda}-${entry.casa}`; // Utilizamos moneda y casa como clave única
    if (!data[key]) {
      data[key] = {
        labels: [],
        prices: []
      };
    }
    data[key].labels.push(entry.fechaActualizacion);
    data[key].prices.push(entry.compra);
  });

  // Configurar datasets para Chart.js
  const datasets = Object.keys(data).map(key => {
    const [moneda, casa] = key.split('-'); // Separar moneda y casa de la clave
    return {
      label: `${moneda} (${casa})`,
      data: data[key].prices,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.4
    };
  });

  // Crear gráfico con Chart.js
  const ctx = document.getElementById('cotizaciones-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data[Object.keys(data)[0]].labels, // Usar las etiquetas de la primera moneda y casa como referencia
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Fecha de Actualización'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Precio de Compra'
          }
        }
      }
    }
  });

  // Función para generar colores aleatorios
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}