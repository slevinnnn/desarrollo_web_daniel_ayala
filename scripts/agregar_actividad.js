async function obtener_regiones_y_comunas() {
  try {
      const response = await fetch('region_comuna.json'); // Carga el archivo JSON
      if (!response.ok) throw new Error('Error al cargar el JSON'); // Manejo de errores
      const data = await response.json(); // Convierte la respuesta en un objeto JS
      return data
     /* console.log(data.regiones[0].nombre);
      console.log(data.regiones[1].id);
      console.log(data.regiones);*/
  } catch (error) {
      console.error(error);
  }
}

const regionesComunas=await obtener_regiones_y_comunas();
console.log(regionesComunas.regiones[0].comunas[0].nombre)


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

const poblarRegion = async () => {
  let regionSelect = document.getElementById("select_region");
  let regiones= regionesComunas.regiones;
  //console.log(regiones)
  for(let i=0;i<regiones.length;i++){
    //console.log(regiones[i].nombre)
    let option = document.createElement("option");
    option.value = regiones[i].id;
    option.textContent = regiones[i].nombre;
    regionSelect.appendChild(option);
  }

}
await poblarRegion();

const poblarComuna =  () => {
  let regionSelect = document.getElementById("select_region");
  let comunaSelect = document.getElementById("select_comuna");
  //este codigo borra las previas comunas de la region seleccionada
  comunaSelect.innerHTML='';
  let placeholderOption = document.createElement("option");
  placeholderOption.textContent = 'Seleccione una comuna';
  placeholderOption.disabled = true;
  placeholderOption.selected = true;  
  comunaSelect.appendChild(placeholderOption);
  //fin del codigo de borrado

  let regionValue = Number(regionSelect.value)-1;
  if(regionValue){
    console.log(regionValue)
    let comunas=regionesComunas.regiones[regionValue].comunas
    for(let i=0;i<comunas.length;i++){
      let option = document.createElement("option");
      option.value = comunas[i].id;
      option.textContent = comunas[i].nombre;
      comunaSelect.appendChild(option);
    }

  }
  

}
document.getElementById("select_region").addEventListener("change",poblarComuna);





