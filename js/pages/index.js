//me traigo el boton de selector moneda
let btnSelectorMoneda = document.getElementById("btn-selector-moneda");

//cuando se haga click en este boton quiero que se agregue un select
let selectorDesplegable = document.getElementById("selector-container");

//en HTMLResponse me traigo el contenedor donde voy a ir agregando las tarjetas
const HTMLResponse = document.getElementById("monedas-container");

//en opciones moneda me voy aguardar la lista de las opciones
let opcionesMonedas;

let monedaSeleccionada;
let monedaAGuardar;

let nombreBandera = document.getElementById("nombre-bandera");

let nombreBanderaFlagImg = nombreBandera.querySelector(".flag img");
let nombreBanderaNombre = nombreBandera.querySelector(".nombre");

console.log(nombreBanderaFlagImg);
console.log(nombreBanderaNombre);

let fechaHora = document.getElementById("fecha-hora");
let spanFechaHora = fechaHora.querySelector("span");

console.log(spanFechaHora);

let listaCotizacionesGuardadas = [];

//este iconito es el que voy a usar para indicar que una moneda esta seleccionada en el selector
let iconoCheck = `<i class="fa-solid fa-check"></i>`;

//como voy a manejar estos divs para seleccionar las monedas ? con data-currency
// let selectorDesplegableOptions = `<div class="selector-option-container" data-currency="0">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/noun-world-2699516.svg" alt="">
//     </div>
//     <h4>Todas</h4>
// </div>
// <span><i class="fa-solid fa-check"></i></span>
// </div>
// <div class="selector-option-container" data-currency="1">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Oficial</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="2">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Blue</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="3">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Bolsa</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="4">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar CCL</h4>
// </div>
// <span></span>
// </div>

// <div class="selector-option-container" data-currency="5">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Mayorista</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="6">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Cripto</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="7">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/usd.svg" alt="">
//     </div>
//     <h4>Dólar Tarjeta</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="8">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/eur.svg" alt="">
//     </div>
//     <h4>Eur</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="9">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/brl.svg" alt="">
//     </div>
//     <h4>Real Brasileño</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="10">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/clp.svg" alt="">
//     </div>
//     <h4>Peso Chileno</h4>
// </div>
// <span></span>
// </div>
// <div class="selector-option-container" data-currency="11">
// <div class="selector-option">
//     <div class="flag-img">
//         <img src="img/uyu.svg" alt="">
//     </div>
//     <h4>Peso Uruguayo</h4>
// </div>
// <span></span>
// </div>`;

btnSelectorMoneda.addEventListener("click", function () {
  console.log(getComputedStyle(selectorDesplegable).display);
  //si el valor de la propiedad esta en none al hacer click significa que tengo que mostrar el selector, entonces lo que hago es  setear el valor de display en flex
  if (getComputedStyle(selectorDesplegable).display == "none") {
    selectorDesplegable.style.display = "flex";
    //ahora que se desplego el selector aprovecho para guardarme todas las opciones de monedas
    opcionesMonedas = document.querySelectorAll(".selector-option-container");

    //como esto me devuelve una lista de nodos, tengo que recorrer nodo por nodo, le agrego un evento click y me guardo el valor del atributo data currency del div clickeado
    opcionesMonedas.forEach((opcion) => {
      opcion.addEventListener("click", function () {
        console.log("Nodo: " + opcion);
        console.log("nodo html: " + opcion.innerHTML);
        //obtengo el elemento span en la opcion
        let span = opcion.querySelector("span");
        //al span de la opcion seleccionada le agrego el icono de iconoCheck

        // Agregar el icono de check al span
        span.innerHTML = iconoCheck;

        //en moneda seleccionada obtengo el valor del atributo data currency de la opcion clickeada
        monedaSeleccionada = opcion.getAttribute("data-currency");
        console.log(typeof monedaSeleccionada);
        //ahora lo que voy a hacer es que voy a llamar a la funcion MostrarTarjetas y le paso el valor de monedaSeleccionada
        MostrarTarjetas(monedaSeleccionada);
        //despues de mostrar las tarjetas oculto el desplegable
        selectorDesplegable.style.display = "none";
        //si la moneda seleccionada es distinta de cero, significa que se eligio una opcion distinta de Todas, por lo que en el contenedor de monedas solo se va a mostrar una cotizacion, entonces modifico el template columns para que quede bien, en caso de que la opcion seleccionada sea Todas entonces vuelvo a dejar el template columns como estaba originalmente en el css
        // if (monedaSeleccionada != "0") {
        //   HTMLResponse.style.gridTemplateColumns = "400px";
        // } else {
        //   HTMLResponse.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
        // }
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

//estas variables las voy a usar para almacenar los datos traidos de la api
let dolaresData, eurosData, realBrasileño, pesoChileno, pesoUruguayo;

// Array para almacenar las URLs de las cotizaciones
const cotizacionesURLs = [
  "https://dolarapi.com/v1/dolares",
  "https://dolarapi.com/v1/cotizaciones/eur",
  "https://dolarapi.com/v1/cotizaciones/brl",
  "https://dolarapi.com/v1/cotizaciones/clp",
  "https://dolarapi.com/v1/cotizaciones/uyu",
];

// Realizo todas las solicitudes fetch simultáneamente
Promise.all(
  cotizacionesURLs.map((url) => fetch(url).then((response) => response.json()))
)
  .then((data) => {
    dolaresData = data[0];
    eurosData = data[1];
    realBrasileño = data[2];
    pesoChileno = data[3];
    pesoUruguayo = data[4];

    // Llamo a la funcion MostrarTarjetas una vez que todos los datos estén disponibles
    MostrarTarjetas(
      dolaresData,
      eurosData,
      realBrasileño,
      pesoChileno,
      pesoUruguayo
    );
  })
  .catch((error) => console.error("Error al obtener datos:", error));

//en este funcion lo que hago es retornar la tarjeta de la moneda, le paso por parametro la moneda, y con eso cargos los datos
let index = -1;
function construirTarjeta(datosMoneda, rutaImagen) {
  index += 1;
  return `<div class="moneda-container" >
    <div class="moneda-card">
      <div class="moneda-title">
        <div class="flag-container">
          <img src="img/${rutaImagen}" alt="" />
        </div>
        <h4>${datosMoneda.moneda} ${datosMoneda.nombre}</h4>
      </div>
      <div class="moneda-body">
        <div class="moneda-compra">
          <div class="compra">
            <h5>COMPRA</h5>
            <span>$${datosMoneda.compra}</span>
          </div>
        </div>
        <div class="moneda-venta">
          <div class="venta">
            <h5>VENTA</h5>
            <span>$${datosMoneda.venta}</span>
          </div>
        </div>
      </div>
      <div class="moneda-footer">
        <div class="favoritos">
          <button class="btn-favorito" id="${index}" onClick=GuardarMoneda(this)>
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

//en esta funcion lo que hago es con un switch evaluar el valor seleccionado en el selector de moneda para mostrar la moneda que corresponde
function MostrarTarjetas(selectedOption) {
  selectedOption = parseInt(selectedOption);
  let rutaImagen = "usd.svg";
  HTMLResponse.innerHTML = "";
  //como para los primeros 7 casos hago lo mismo, por eso lo hago de esta manera
  switch (selectedOption) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      HTMLResponse.innerHTML += construirTarjeta(
        dolaresData[selectedOption - 1],
        rutaImagen
      );
      nombreBanderaFlagImg.src = "img/" + rutaImagen;
      nombreBanderaNombre.textContent = dolaresData[selectedOption - 1].nombre;
      monedaAGuardar = dolaresData[selectedOption - 1];
      spanFechaHora.textContent = dolaresData[
        selectedOption - 1
      ].fechaActualizacion.substring(0, 10);
      break;
    case 8:
      rutaImagen = "eur.svg";
      HTMLResponse.innerHTML += construirTarjeta(eurosData, rutaImagen);
      nombreBanderaFlagImg.src = "img/" + rutaImagen;
      nombreBanderaNombre.textContent = eurosData.moneda;
      spanFechaHora.textContent = eurosData.fechaActualizacion.substring(0, 10);
      monedaAGuardar = eurosData;
      break;
    case 9:
      rutaImagen = "brl.svg";
      HTMLResponse.innerHTML += construirTarjeta(realBrasileño, rutaImagen);
      nombreBanderaFlagImg.src = "img/" + rutaImagen;
      nombreBanderaNombre.textContent = realBrasileño.moneda;
      spanFechaHora.textContent = realBrasileño.fechaActualizacion.substring(
        0,
        10
      );
      monedaAGuardar = realBrasileño;
      break;
      break;
    case 10:
      rutaImagen = "clp.svg";
      HTMLResponse.innerHTML += construirTarjeta(pesoChileno, rutaImagen);
      nombreBanderaFlagImg.src = "img/" + rutaImagen;
      nombreBanderaNombre.textContent = pesoChileno.moneda;
      spanFechaHora.textContent = pesoChileno.fechaActualizacion.substring(
        0,
        10
      );
      monedaAGuardar = pesoChileno;
      break;
    case 11:
      rutaImagen = "uyu.svg";
      HTMLResponse.innerHTML += construirTarjeta(pesoUruguayo, rutaImagen);
      nombreBanderaFlagImg.src = "img/" + rutaImagen;
      nombreBanderaNombre.textContent = pesoUruguayo.moneda;
      spanFechaHora.textContent = pesoUruguayo.fechaActualizacion.substring(
        0,
        10
      );
      monedaAGuardar = pesoUruguayo;
      break;
    default:
      dolaresData.forEach((dolar) => {
        HTMLResponse.innerHTML += construirTarjeta(dolar, rutaImagen);
      });
      HTMLResponse.innerHTML += construirTarjeta(eurosData, "eur.svg");
      HTMLResponse.innerHTML += construirTarjeta(realBrasileño, "brl.svg");
      HTMLResponse.innerHTML += construirTarjeta(pesoChileno, "clp.svg");
      HTMLResponse.innerHTML += construirTarjeta(pesoUruguayo, "uyu.svg");
      nombreBanderaFlagImg.src = "img/noun-world-2699516.svg";
      nombreBanderaNombre.textContent = "Todas";
      spanFechaHora.textContent = dolaresData[0].fechaActualizacion.substring(
        0,
        10
      );
      break;
  }
 
}

function GuardarMoneda(data) {
  console.log(data);
  console.log(data.getAttribute("id"));
  data = parseInt(data.getAttribute("id"));

  if (data <= 10) {
    switch (data) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        monedaAGuardar = dolaresData[data];
        break;
      case 7:
        monedaAGuardar = eurosData;
        break;
      case 8:
        monedaAGuardar = realBrasileño;
        break;
      case 9:
        monedaAGuardar = pesoChileno;
        break;
      case 10:
        monedaAGuardar = pesoUruguayo;
        break;
      default:
        break;
    }
  }

  console.log(monedaAGuardar);

  let monedaExiste = false;

  if (listaCotizacionesGuardadas.length > 0) {
    for (let element of listaCotizacionesGuardadas) {
      if (
        element.moneda === monedaAGuardar.moneda &&
        element.nombre === monedaAGuardar.nombre &&
        element.fechaActualizacion === monedaAGuardar.fechaActualizacion
      ) {
        monedaExiste = true;
        break;
      }
    }

    if (!monedaExiste) {
      listaCotizacionesGuardadas.push(monedaAGuardar);
    } else {
      console.log("La moneda ya existe.");
    }
  } else {
    listaCotizacionesGuardadas.push(monedaAGuardar);
  }

  localStorage.setItem(
    "cotizacion",
    JSON.stringify(listaCotizacionesGuardadas)
  );
}
