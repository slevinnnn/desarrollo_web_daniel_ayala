async function obtener_regiones_y_comunas() {
  try {
      const response = await fetch('region_comuna.json'); // Carga el archivo JSON
      if (!response.ok) throw new Error('Error al cargar el JSON'); // Manejo de errores
      const data = await response.json(); // Convierte la respuesta en un objeto JS
      console.log(data.regiones[0].nombre);
      console.log(data.regiones[1].id);   // 25
  } catch (error) {
      console.error(error);
  }
}

// Llamar a la función
obtener_regiones_y_comunas();


let contador=0;
const  nextStep = (step) => {
  console.log(contador)
  console.log(step)
    if (step >= 3) return;
    contador=step;
    document.getElementById("contenedor_formulario").style.transform = `translateX(-${contador * 33.33}%)`;
}
const  backStep = (step) => {
  console.log(contador)
  console.log(step)
    if (step <= 1) return;
    document.getElementById("contenedor_formulario").style.transform = `translateX(-${(step-2)* 33.33}%)`;
}

document.querySelectorAll(".btn_siguiente").forEach((button) => {
  button.addEventListener("click", () => {
    let button_id=Number(button.id)
    nextStep(button_id);
  });
}
);
document.querySelectorAll(".btn_atras").forEach((button) => {
  button.addEventListener("click", () => {
    let button_id=Number(button.id)
    backStep(button_id);
  });
}
);

const poblarRegionComuna = () => {
  let regionSelect = document.getElementById("select_region");




}





