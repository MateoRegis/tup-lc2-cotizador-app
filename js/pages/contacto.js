let nombre = document.getElementById("nombre");
let email = document.getElementById("email");
let mensaje = document.getElementById("mensaje");
let lblValidacion = document.getElementById("lblValidacion");

function EnviarFormulario() {
  if (ValidarFormulario()) {
    lblValidacion.innerHTML = "Todos los campos estan completos.";
    lblValidacion.style.color = "Green";
  } else {
    lblValidacion.innerText = "Debes completar todos los campos.";
    lblValidacion.style.color = "Red";
  }
}
function LimpiarFormulario(){
  nombre.value = "";
  email.value = "";
  mensaje.value = "";
  lblValidacion.innerText = "";
}
function ValidarFormulario() {
  if (nombre.value != "" && email.value != "" && mensaje.value != "") {
    return true;
  }
  return false;
}
