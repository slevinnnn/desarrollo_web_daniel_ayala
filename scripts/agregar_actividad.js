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

//data para todos los selects del formulario
const regionesComunas=await obtener_regiones_y_comunas();
const formaDeContacto=["Whatsapp","Telegram","X","Instagram","TikTok","Otra"];
const temas=["Musica","Deportes","Ciencias","Religion","Politica","Tecnologia","Juegos","Baile","Comida","Otros"];
// fin de la data para todos los selects del formulario

//funcionalidad de avanzar,retroceder y enviar  en los botones del formulario
let contador=0;
const  nextStep = (step) => {
  /*console.log(contador)
  console.log(step)*/
    if (step >= 3) return;
    contador=step;
    document.getElementById("contenedor_formulario").style.transform = `translateX(-${contador * 33.33}%)`;
}
const  backStep = (step) => {
  /*console.log(contador)
  console.log(step)*/
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
//fin de la funcionalidad de avanzar y retroceder en los botones del formulario


//funcionalidad para poblar los selects del formulario
const poblarContactar =  () => {
  let contactarSelect = document.getElementById("contactar_por");
  formaDeContacto.forEach(contacto =>{
    let option = document.createElement("option");
    option.value = contacto;
    option.textContent = contacto;
    contactarSelect.appendChild(option);
  })
}
poblarContactar();

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

const poblarTema =  () => {
  let temaSelect = document.getElementById("select_tema");
  temas.forEach(tema =>{
    let option = document.createElement("option");
    option.value = tema;
    option.textContent = tema;
    temaSelect.appendChild(option);
  })
}
poblarTema();
document.getElementById("select_region").addEventListener("change",poblarComuna);
//fin de la funcionalidad para poblar los selects del formulario


//funcionalidad para poblar datetime-local
const poblarFechaInicio = () => {
  const dateInput = document.getElementById("fecha_inicio");
  const now = new Date();

  // Formatear fecha y hora a YYYY-MM-DDTHH:MM
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
  dateInput.value = formatted;
}
poblarFechaInicio();

const poblarFechaTermino = () => {
  const dateInput = document.getElementById("fecha_termino");
  const now = new Date();

  // Formatear fecha y hora a YYYY-MM-DDTHH:MM
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()+3).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
  dateInput.value = formatted;
}
poblarFechaTermino();

//

//funcionalidad para validar el formulario
const validateName = (name) => {
  if(!name) return false;
  let lengthValid = name.trim().length <= 200;
  return lengthValid;
}

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length <= 100;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  // validación de longitud
  let lengthValid = phoneNumber.length >= 8;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(phoneNumber);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateSector = (sector) =>{
  let valido=true;
  if(sector.length>100) valido=false;
  return valido;

}
const validateInfoContacto = (info) =>{
  let lengthValid =info.length>4 && info.length <= 50 ;
  return lengthValid;

}

const validateFechaTermino = (fecha_inicio,fecha_termino) =>{
}

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm = document.forms["formulario_quien"];
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value;
  let name = myForm["nombre"].value;
  let contactar = myForm["contactar_por"].value;
  /*let region = myForm["select_region"].value;
  let comuna = myForm["select_comuna"].value;*/

  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    setInvalidInput("Número");
  }
  if (!validateInfoContacto(contactar)) {
    setInvalidInput("Forma de contacto");
  }
  /*if (!validateSelect(region)) {
    setInvalidInput("Region");
  }
  if (!validateSelect(comuna)) {
    setInvalidInput("Comuna");
  }*/

  // finalmente mostrar la validación
  let validationBox = document.getElementById("contenedor_validador");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");
  let formContainer = document.querySelector(".contenedor_principal");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    invalidInputs.forEach((input) => {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    })
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      // myForm.submit();
      // no tenemos un backend al cual enviarle los datos
    });

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


let submitBtn = document.getElementById("31");
submitBtn.addEventListener("click", validateForm);




