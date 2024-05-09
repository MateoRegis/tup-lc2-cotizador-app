document.addEventListener("DOMContentLoaded", function () {               //funcion que se ejecutara cuando el evento DOMContentLoaded ocurra
  
  const imagenes = [                                                          // Arreglo de imágenes que se mostrarán en el fondo
    'url("img/fondo1.jpg")',
    'url("img/fondo2.jpg")',
    'url("img/fondo3.jpg")',
    'url("img/fondo4.jpg")',
    'url("img/fondo5.jpg")',
    'url("img/fondo6.jpg")',
  ];

 
  let indiceActual = 0;                                                    // Índice inicial para el arreglo de imágenes
  
  const elementoFondo = document.getElementById("BackgroundDinamico");    // Elemento del DOM cuyo fondo se actualizará

  // Función para actualizar la imagen de fondo
  function actualizarFondo() {
    elementoFondo.style.opacity = "0";                                    //Establece la opacidad del fondo a 0 (transparente)

    // Espera a que la transición de opacidad termine antes de cambiar la imagen
    setTimeout(() => {
      elementoFondo.style.backgroundImage = imagenes[indiceActual];    // Cambia la imagen de fondo
      elementoFondo.style.opacity = "1";                               // Establece la opacidad a 1 (visible)
    }, 2000);                                                         // Tiempo de espera corresponde al tiempo de la transición de opacidad
  }

  // Establece un intervalo para cambiar las imágenes automáticamente
  setInterval(() => {
    indiceActual = (indiceActual + 1) % imagenes.length;   // Actualiza el índice al siguiente, y vuelve al inicio después de la última
    actualizarFondo();                                    // Llama a la función para actualizar el fondo
  }, 7000);                                              // Tiempo total del intervalo incluyendo la transición (2s de desvanecimiento + 5s de imagen visible)
});
