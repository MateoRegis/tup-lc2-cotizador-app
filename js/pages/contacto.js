
const btn_enviar = document.getElementById("btn-enviar");
const btn_limpiar = document.getElementById("btn-limpiar");
var respuesta = document.getElementById("respuesta");
function enviar_formulario(){
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let mensaje = document.getElementById("mensaje").value;
    validar_formulario(nombre,email,mensaje);
    console.log(nombre.value);
    console.log(email.value);
    console.log(mensaje.value);
}
function validar_formulario(nombre,email,mensaje) {
    
    if (nombre === '' || email === '' || mensaje === '') {
        respuesta.innerHTML = "Debes completar formularios";
        alert('Falta completar el formulario. Por favor, asegúrate de rellenar todos los campos.');
        return false;
    }
    else {
        alert('ENVIO CORRECTO')
        return true;
    }
    
}
