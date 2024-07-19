

////////////////////////////// Obtener elementos del DOM  ///////////////////////////////////////////////////////////////////////////////

//boton que expande el selector de tipo de divisas
const btnSelectorMoneda = document.getElementById("btn-selector-moneda");

//contenedor slider de los comentarios
const slider = document.querySelector('.slider');

//tarjeta de comentarios
const cards = document.querySelectorAll('.card-comentarios');

//boton de mover hacia izquierda los comentarios
const prevButton = document.querySelector('.prev');

//boton de mover a la derecha los comentarios
const nextButton = document.querySelector('.next');

//cuando se haga click en este boton quiero que se agregue un select
const selectorDesplegable = document.getElementById("selector-container");

const nombreBandera = document.getElementById("nombre-bandera");

//en HTMLResponse me traigo el contenedor donde voy a ir agregando las tarjetas
const HTMLResponse = document.getElementById("monedas-container");

const nombreBanderaFlagImg = nombreBandera.querySelector(".flag img");

const nombreBanderaNombre = nombreBandera.querySelector(".nombre");

const fechaHora = document.getElementById("fecha-hora");
const spanFechaHora = fechaHora.querySelector("span");


//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////Definicion de variables globales /////////////////////////////////////


//en opciones moneda me voy aguardar la lista de las opciones
let opcionesMonedas;

//en moneda seleccionada me voy a guardar el tipo de divisa selccionada por un usuario
let monedaSeleccionada;


//esta lista la voy a usar para almacenar las cotizaciones guardadas por un usuario
let listaCotizacionesGuardadas = [];

//este iconito es el que voy a usar para indicar que una moneda esta seleccionada en el selector
let iconoCheck = `<i class="fa-solid fa-check"></i>`;

//estas variables las voy a usar para almacenar los datos traidos de la api
let dolaresData, eurosData, realBrasileño, pesoChileno, pesoUruguayo;

let currentIndex = 0;

//////////////////////////////////////////////////////////////////

///////////////////////principal//////////////////////////////////////////

// cargo las monedas guardadas desde localStorage al inicio
function cargarMonedasGuardadas() {
  const monedasGuardadas = localStorage.getItem("cotizaciones");
  if (monedasGuardadas) {
    listaCotizacionesGuardadas = JSON.parse(monedasGuardadas);
  }
}
// llamo a la función para cargar las monedas guardadas al inicio
cargarMonedasGuardadas();



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
        //ahora lo que voy a hacer es que voy a llamar a la funcion MostrarTarjetas y le paso el valor de monedaSeleccionada
        MostrarTarjetas(monedaSeleccionada);
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
function construirTarjeta(datosMoneda, rutaImagen) {
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
          <button class="btn-favorito" data-moneda= '${JSON.stringify(
    datosMoneda
  )}' onClick=GuardarMoneda(this)>
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
  //como para los primeros 7 casos hago lo mismo (se evaluan los usd), por eso lo hago de esta manera
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

function GuardarMoneda(boton) {
  let monedaAGuardar = JSON.parse(boton.getAttribute("data-moneda"));


  // verifico si la moneda ya está guardada
  if (!monedaYaGuardada(monedaAGuardar)) {
    //si no esta guardada la agrego en la lista
    listaCotizacionesGuardadas.push(monedaAGuardar);
    //imprimo un msjito para corroborar que si se guardo
    console.log("Moneda guardada:", monedaAGuardar);

    Swal.fire({
      title: "¡Cotización guardada!",
      text: "Cotización guardada correctamente.",
      icon: "success",
      confirmButtonText: "OK"
    });

  } else {
    //si ya existe le informo al usuario que no se puede guardar, despues esto lo vamos a informar con un cartelito en pantalla
    console.log("La moneda ya existe. No se puede guardar.");
    Swal.fire({
      title: "Error",
      text: "Ya existe esta cotización en favoritos.",
      icon: "error",
      confirmButtonText: "OK",
    });

  }

  // finalmente guardo la lista en el localStorage
  localStorage.setItem(
    "cotizaciones",
    JSON.stringify(listaCotizacionesGuardadas)
  );
}

// funcion que me va a servir para verificar si una moneda ya existe
function monedaYaGuardada(moneda) {
  //el metodo some es un metodo de arrays, y basicamente devuelve true si un array pasa un "test" o false si no lo pasa.
  //se recorre la lista elemento por elemento comparando los atributos con la moneda que pasamos por parametro, 
  //si algun (some significa algun/alguna) elemento del array pasa el test entonces se devuelve true, lo que estaria indicando que ya existe una moneda como la que se paso por parametro
  return listaCotizacionesGuardadas.some(
    (element) =>
      element.moneda === moneda.moneda &&
      element.nombre === moneda.nombre &&
      extraerFechaSinHora(element.fechaActualizacion) === extraerFechaSinHora(moneda.fechaActualizacion)
  );
}

function extraerFechaSinHora(fechaISO) {
  return fechaISO.split("T")[0];
}



//con esta funcion actualizamos la posicion del slider en funcion del indice actual y el ancho de la primera tarjeta
function updateSlider() {
  const cardWidth = cards[0].clientWidth;
  slider.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
}

//este evento se activa cuando hacemos click en el boton de la izquierda de la seccion de los comentarios, primero verificamos que el indice actual sea mayor que cero para asegurarnos de que no se vaya mas alla de la primera tarjeta
//decrementamos el indice actual en 1, porque nos estamos moviendo hacia la izquierda
//actualizamos la posicion del slider llamando la funcion creada anteriormente
prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

//este evento se activa cuando hacemos click en el boton de la derecha de la seccion de comentarios.
//verificamos que el indice actual sea menor que la longitud de las card menos 1 para asegurarmos que no nos vamos mas alla de la ultima tarjeta
//incrementamos el indice actual porque nos estamos moviendo a la derecha y por ultimo llamamos la funcion para actualizar la posicion del slider
nextButton.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSlider();
  }
});

//cada vez que se redimensiona la pantalla actualizamos la posicion del slider
window.addEventListener('resize', updateSlider);