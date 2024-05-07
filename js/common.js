/**************************************************/
/* Evento menu desplegable  */
/**************************************************/
let contador = 1;
function eventoMenu(){
    const menu = document.querySelector('#menu');
    const btnMnu = document.querySelector('#btnMnu');
	if(contador==1){
		//menu.style='left: 0';
        menu.style.transform = 'translateX(-0%)';
		contador=0;
        btnMnu.innerHTML='x';
	}else{
		//menu.style='left:-100%';
        menu.style.transform = 'translateX(-120%)';
		contador=1;
        btnMnu.innerHTML='≡';
	};
};

/**************************************************/
/* Detectar el cambio de tamaño de la ventana     */
/**************************************************/
window.addEventListener('resize', function() {
    // Obtener el nuevo ancho de la ventana
    var nuevoAncho = window.innerWidth;
    const menu = document.querySelector('#menu');
    // Hacer lo que necesites con el nuevo ancho
    console.log("El ancho de la ventana ha cambiado a: " + nuevoAncho);
    if(nuevoAncho>1000){
        menu.style.transform = 'translateX(0%)';
		contador=0;
    }else{
        menu.style.transform = 'translateX(-120%)';
        contador=1;
    }
});