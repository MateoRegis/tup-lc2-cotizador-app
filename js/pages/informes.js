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



////////////////////////////////////////////////////
////////////////////////Definimos variables globales///////////////////////////////////////////

//este iconito es el que voy a usar para indicar que una moneda esta seleccionada en el selector
let iconoCheck = `<i class="fa-solid fa-check"></i>`;
let monedaSeleccionada;



////////////////////////////////////////////////////////
//////////////////////////principal/////////////////////////////////////

//este evento se activa cuando se carga el  dom
//dibujamos el grafico y la tabla
document.addEventListener("DOMContentLoaded", () => {
  dibujarGrafico();
  const data = JSON.parse(localStorage.getItem("cotizaciones")) || [];
  // Ordenar los datos por fecha de la más actual a la menos actual
  data.sort(
    (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
  );

  // Generar filas de la tabla dependiendo de cuanta info hay en el local storage
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

    //en data previa vamos a filtrar las cotizaciones iguales (que coinciden moneda y casa) pero con fechas anteriores
    //data es el nombre que le pusimos a la variable donde almacenamos lo que recuperamos del local storage
    //m es como un elemento de la data
    //filter es un metodo de arrays que nos devuelve un nuevo array con los elementos del array original que pasa una "prueba"
    //en este caso la prueba que le ponemos es que coincidan la moneda y la casa y la fecha de Actualización sea anterior
    let dataPrevia = data.filter(
      (item) =>
        item.moneda === moneda.moneda &&
        item.casa === moneda.casa &&
        item.fechaActualizacion < moneda.fechaActualizacion
    );
    //validamos si se encontro elementos que cumplen con los requisitos, sinpo no tenemos con quien comparar
    if (dataPrevia.length > 0) {
      //en ultimo registro nos guardamos el ultimo elemento de data previa, que seria el mas reciente antes de moneda.fechaActualizacion
      let ultimoRegistro = dataPrevia[dataPrevia.length - 1];
      //comparamos si el precio de compra es mayor o menos
      //si es mayor le ponemos el iconito para arriba en verde
      //si es menor le ponemos el iconito para abajo en rojo
      if (moneda.compra > ultimoRegistro.compra) {
        icono.className = "fa-solid fa-arrow-up";
      } else if (moneda.compra < ultimoRegistro.compra) {
        icono.className = "fa-solid fa-arrow-down";
      }
    }
    //agregamos el icono a la celda
    celdaVariacion.appendChild(icono);
    //agregamos la celda a la fila
    fila.appendChild(celdaVariacion);
    //una vez que tenemos toda la fila cargada la agregamos a la tabla
    tableBody.appendChild(fila);
  });
});

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

//funcion para dibujar el grafico
function dibujarGrafico(){
  const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
  // Ordenar los datos por fecha de la más actual a la menos actual
  cotizaciones.sort((a, b) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion));

  // Preparar datos para Chart.js
  const data = {}; //inicializamos un objeto vacio en donde vamos a almacenar los datos que vamos a usar en el grafico

  //recorremos las cotizaciones que recuperamos del local storage
  cotizaciones.forEach(item => {
    //en key creamos una clave unica para cada combinacion combinando la moneda y la casa
    const key = `${item.moneda}-${item.casa}`; // Utilizamos moneda y casa como clave única
    //verificamos si la clave key ya existe en data, si no existe lo inicializamos con un objeto que contiene arreglos vacios para labels y prices
    if (!data[key]) {
      data[key] = {
        labels: [],
        prices: []
      };
    }
    //agregamos la fecha de actualizacion al areglo prices
    data[key].labels.push(item.fechaActualizacion);
    //agregamos el precio de compra al arreglo prices
    data[key].prices.push(item.compra);
  });

  // Configurar datasets para Chart.js
  //generamos un arreglo dataset utilizacion objets keys para iterar sobre las claves del objeto data (moneda y casa)
  const datasets = Object.keys(data).map(key => {
    //separamos en dos arreglos, uno llamado moneda, y otro llamado casa, esto lo hacemos mediante el split
    const [moneda, casa] = key.split('-'); // Separar moneda y casa de la clave
    //con return devolvemos un objeto para cada clave key en data, que representa un conjunto de datos para chart.js
    return {
      //con label definimos las etiquetas del conjunto de datos
      label: `${moneda} (${casa})`,
      //con data definimos los datos reales que mostramos en el grafico, que son los precios almacenados en data[key].prices
      data: data[key].prices,
      //con fill false le indicamos que el area bajo la linea del grafico no se debe rellenar
      fill: false,
      //asignamos un color aleatorio al borde de la linea usanod la funcion getrandomcolor
      borderColor: getRandomColor(),
      //con tension controlamos la curvatura de la linea del grafico, a menor tension la linea se hace mas recta
      tension: 0.4
    };
  });

  // Crear gráfico con Chart.js
  const ctx = document.getElementById('cotizaciones-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line', //especificamos que el tipo de grafico es lineal
    //data contiene los datos que se mostraran en el grafico
    //los labels dfinen las etiquetas del eje x
    //dataset contiene la configuracion y datos de cadfa conjunto de datos que mostramos en el graafico
    data: {
      labels: data[Object.keys(data)[0]].labels, // Usar las etiquetas de la primera moneda y casa como referencia
      datasets: datasets
    },
    //con options especificamos las opciones de configuracion del grafico.
    options: {
      //con responsive: true permitimos que el grafico se ajuste y sea responsive
      responsive: true,
      //con plugins vamos a definir configuraciones adicionales propocionadas por plugins de chatr.js
      plugins: {
        //con tooltip configuramos el comportamiento del cuaadrito que aparece al pasar el mouse sobre el grafico
        tooltip: {
          //mode index muestra un solo tooltip por cada punto del grafico
          mode: 'index',
          //con interset en false evitamos que los tooltips se intersecten, mostrando solo el mas cercano al cursor
          intersect: false,
        },
      },
      //con scales configuramos las escalas de los ejes del grafico
      scales: {
        //con x configuramos el eje x (horizontal)
        x: {
          //con display true mostramos el eje
          display: true,
          //con tittle configuramos el titulo el titulo del eje x
          //display true para mostrarlo y en text el txto que queremos que tenga
          title: {
            display: true,
            text: 'Fecha de Actualización'
          }
        },
        //y para la configuracion del eje y (vertical)
        y: {
          //las mismas configuraciones de antes
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

