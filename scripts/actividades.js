document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("mi_tabla");
  const resumen = document.getElementById("resumen");
  const contenedorResumen=document.getElementById("contenedor_resumen")

  tabla.querySelectorAll("tbody tr").forEach((fila) => {
    fila.addEventListener("click", function () {
      const celdas = this.querySelectorAll("td");
      const encabezados = ["Inicio", "Término", "Comuna", "Sector", "Tema", "Nombre Organizador", "Total Fotos"];

      let htmlResumen = "<h2 class='res_acti'>Resumen de la Actividad</h2><ul>";
      celdas.forEach((celda, i) => {
        htmlResumen += `<li><strong>${encabezados[i]}:</strong> ${celda.textContent}</li>`;
      });
      htmlResumen += "</ul>";

      resumen.innerHTML = htmlResumen;
      contenedorResumen.style.display = "";
    });
  });
});

const contenedorResumen=document.getElementById("contenedor_resumen")
const home_btn=document.getElementById("home_btn");
const back_btn=document.getElementById("back_btn");

back_btn.addEventListener("click",function(){
  contenedorResumen.style.display="none";
  resumen.innerHTML="";
});

home_btn.addEventListener("click",function(){
  contenedorResumen.style.display="none";
  resumen.innerHTML="";
  window.location.href="index.html";
});