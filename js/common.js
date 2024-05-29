//voy a agregar el menu directamente desde el js a todas las paginas
let header = document.getElementById("header");
let menu = `<div id="menu">
<div class="icono-container">
  <a href="index.html"><img src="img/bullCoinIcono.jpg" alt="" /></a>
</div>
<ul>
  <li>
    <a href="index.html"><i class="fa-solid fa-house"></i> Inicio</a>
  </li>
  <li>
    <a href="Miarchivo.html"
      ><i class="fa-solid fa-folder-open"></i> Mi Archivo</a
    >
  </li>
  <li>
    <a href="informes.html"
      ><i class="fa-solid fa-file"></i> Informes</a
    >
  </li>
  <li>
    <a href="contacto.html"
      ><i class="fa-solid fa-address-book"></i> Contáctenos</a
    >
  </li>
</ul>
</div>
<button class="btn-mnu" onclick="eventoMenu()" id="btnMnu">≡</button>`;

header.innerHTML = menu;

//el footer tambien lo voy a agregar mediante js
let footer = document.getElementById("footer");
let footerContent = `<div class="footer-container">
<div class="institucional-container item-footer">
  <h3>INSTITUCIONAL</h3>
  <ul class="lista-institucional">
    <li class="lista-institucional-item">
      <a href="">¿Quiénes Somos?</a>
    </li>
    <li class="lista-institucional-item">
      <a href="">Socios Estratégicos</a>
    </li>
    <li class="lista-institucional-item">
      <a href="">Trabaje con Nosotros</a>
    </li>
    <li class="lista-institucional-item"><a href="">Ayuda</a></li>
  </ul>
</div>
<div class="accesos-container item-footer">
  <h3>ACCESOS</h3>
  <ul class="lista-accesos">
    <li class="lista-accesos-item"><a href="index.html">Inicio</a></li>
    <li class="lista-accesos-item">
      <a href="Miarchivo.html">Mi Archivo</a>
    </li>
    <li class="lista-accesos-item">
      <a href="informes.html">Informes</a>
    </li>
    <li class="lista-accesos-item">
      <a href="contacto.html">Contáctenos</a>
    </li>
  </ul>
</div>
<div class="contacto-container item-footer">
  <h3>CONTACTO</h3>
  <ul class="lista-contacto">
    <li class="lista-contacto-item">
      Universidad Tecnológica Nacional
    </li>
    <li class="lista-contacto-item">
      ZEBALLOS 1341 - S2000BQA - ROSARIO
    </li>
    <li class="lista-contacto-item">0341 - 4481871</li>
    <li class="lista-contacto-item">
      <a href="contacto.html">!Escríbanos!</a>
    </li>
  </ul>
</div>
<div class="desarrollado-container item-footer">
  <h3>DESARROLLADO POR</h3>
  <ul class="lista-desarrollo">
    <li class="lista-desarrollo-item">
      <a href="https://github.com/JensonMedina" target="_blank"
        >Jenson Medina (53338)</a
      >
    </li>
    <li class="lista-desarrollo-item">
      <a href="https://github.com/MateoRegis" target="_blank"
        >Mateo Regis (48963)</a
      >
    </li>
    <li class="lista-desarrollo-item">
      <a href="https://github.com/BrunoRubini" target="_blank"
        >Bruno Rubini(53367)</a
      >
    </li>
    <li class="lista-desarrollo-item">TUP06 - 2024</li>
  </ul>
</div>
</div>
<div class="nombre-materia">
<span>Tup - Cátedra de Laboratorio de Computación 2 - Año 2024</span>
</div>`;
footer.innerHTML = footerContent;


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
    console.log("El ancho de la ventana ha cambiado a: " + nuevoAncho);
    if(nuevoAncho>768){
        menu.style.transform = 'translateX(0%)';
		contador=0;
    }else{
        menu.style.transform = 'translateX(-120%)';
        contador=1;
    }
});
/**************************************************/
/* Background Imagen Dinámico     */
/**************************************************/
const imagenes = [                                                     // Arreglo de imágenes que se mostrarán en el fondo
        'url("img/fondo1.jpg")',
        'url("img/fondo2.jpg")',
        'url("img/fondo3.jpg")',
        'url("img/fondo4.jpg")',
        'url("img/fondo5.jpg")',
        'url("img/fondo6.jpg")',
    ];


let indiceActual = 0;                                                    // Índice inicial para el arreglo de imágenes    
const elementoFondo = document.getElementById("BackgroundDinamico");    // Elemento del DOM cuyo fondo se actualizará
function actualizarFondo() {
    elementoFondo.style.opacity = "0";                                    //Establece la opacidad del fondo a 0 (transparente)
    elementoFondo.style.backgroundImage = imagenes[indiceActual];    // Cambia la imagen de fondo
    elementoFondo.style.transition = "opacity 4s ease-in-out";
    elementoFondo.style.opacity = "1";                               // La hacemos totalmente visible
    elementoFondo.style.transition = "2s ease-in";                  
    
    setInterval(()=>{
        indiceActual++;
        if (indiceActual >= imagenes.length) {
            indiceActual = 0;
        }
    }, 3000)                        
}
// Intervalo para cambiar automáticamente las imágenes
setInterval(actualizarFondo, 4000);
