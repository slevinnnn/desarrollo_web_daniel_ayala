const btn_agregar_comentario = document.getElementById("contenedor_agregar_comentario");
btn_agregar_comentario.addEventListener("click", function () {
   const formulario = document.getElementById("formulario_comentario");
   formulario.style.display = "";
   formulario.scrollIntoView({ behavior: "smooth" });
});