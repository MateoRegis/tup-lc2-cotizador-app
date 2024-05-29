//me traigo el boton de selector moneda
let btnSelectorMoneda = document.getElementById("btn-selector-moneda");

//cuando se haga click en este boton quiero que se agregue un select
let selectorDesplegable = document.getElementById("selector-container");

//aca guardo el codigo html que voy a insertar en el contenedor, todo este codigo despues lo voy a modificar, la idea es que se cargue el selector con los datos que se traen de la api.
let selectorDesplegableOptions = `<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Oficial</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Blue</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Bolsa</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar CCL</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Tarjeta</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Mayorista</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/usd.svg" alt="">
    </div>
    <h4>Dólar Cripto</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/eur.svg" alt="">
    </div>
    <h4>Eur</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/brl.svg" alt="">
    </div>
    <h4>Real Brasileño</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/clp.svg" alt="">
    </div>
    <h4>Peso Chileno</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>
<div class="selector-option-container">
<div class="selector-option">
    <div class="flag-img">
        <img src="img/uyu.svg" alt="">
    </div>
    <h4>Peso Uruguayo</h4>
</div>
<span><i class="fa-solid fa-check"></i></span>
</div>`;

btnSelectorMoneda.addEventListener("click", function () {
    //lo primero que hago es limpiar el contenedor para que no se dupliquen las inserciones
  selectorDesplegable.innerHTML = "";
  //muestro en la consola el valor de la propiedad display del selector desplegable
  console.log(getComputedStyle(selectorDesplegable).display);
  //si el valor de la propiedad esta en none al hacer click significa que tengo que mostrar el selector, entonces lo que hago es agregar las opciones y setear el valor de display en flex
  if (getComputedStyle(selectorDesplegable).display == "none") {
    selectorDesplegable.innerHTML = selectorDesplegableOptions;
    selectorDesplegable.style.display = "flex";
  } else if (getComputedStyle(selectorDesplegable).display == "flex") {
    //por otro lado si el valor de la propiedad display es flex al momento de hacer click significa que tengo que ocultar el selector, entonces seteo el display en none
    selectorDesplegable.style.display = "none";
  }
});
