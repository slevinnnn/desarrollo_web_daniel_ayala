async function obtener_regiones_y_comunas() {
  try {
      const response = await fetch('static/public/region_comuna.json'); // Carga el archivo JSON
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
    document.getElementById("formulario_unico").style.transform = `translateX(-${contador * 37}%)`;
}
const  backStep = (step) => {
  /*console.log(contador)
  console.log(step)*/
    if (step <= 1) return;
    document.getElementById("formulario_unico").style.transform = `translateX(-${(step-2)* 37}%)`;
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
function contactarPorChange() {
  const temaSelect = document.getElementById("contactar_por");
  const reasonLabel = document.querySelector("label[for='reason3']");
  const reasonInput = document.getElementById("comments3");
  reasonInput.value = "";

  console.log("cambio a otros")
  reasonLabel.innerText = "Ingrese id de contacto o URL";
  reasonLabel.style.display = "";
  reasonInput.style.display = "";

}

document.getElementById("contactar_por").addEventListener("change", contactarPorChange);

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
  changeArguments();
}
poblarTema();

function changeArguments() {
  console.log("cambio de argumento")
  const temaSelect = document.getElementById("select_tema");
  const reasonLabel = document.querySelector("label[for='reason4']");
  const reasonTextarea = document.getElementById("comments4");
  console.log(temaSelect.value);
  if (temaSelect.value == "Otros") {
      console.log("cambio a otros")
      reasonLabel.innerText = "Especifique el tema de la actividad";
      reasonLabel.style.display = "";
      reasonTextarea.style.display = "";
  } else {
      reasonLabel.style.display = "none";
      reasonTextarea.style.display = "none";
  }
}


document.getElementById("select_tema").addEventListener("change", changeArguments);
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
  console.log(info)
  let lengthValid =info.length>4 && info.length <= 50 ;
  return lengthValid;

}

const validateRegion = (region) => {
  if(region){
  let valido=regionesComunas.regiones[Number(region)-1].nombre.length>0
  return valido;
  }
  return false;
};
const validateComuna = (comuna) => {
  let valido=false;
  if(comuna!=0) valido=true;
  return valido;
};

const esFormatoFechaValido = (valor) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return regex.test(valor);
};

const validateFechaInicio = (fecha_inicio) =>{
  if(!fecha_inicio) return false;
  return esFormatoFechaValido(fecha_inicio);

}

const validateFechaTermino = (fecha_inicio,fecha_termino) =>{
  if(!fecha_inicio) return false;
  if(fecha_termino){
    if (!esFormatoFechaValido(fecha_inicio) || !esFormatoFechaValido(fecha_termino)) {
      return false;
    }
    const fechaInicio = new Date(fecha_inicio);
    const fechaTermino = new Date(fecha_termino);

    return fechaTermino > fechaInicio;
  }
  return true
}

const validateTema = (tema) => {
  if(!tema) return false;
  if(tema=="Otros"){
    let textarea=document.getElementById("comments4").value;
    if(textarea.length<3 || textarea.length>15) return false;
  }
  return true

}

const validateFiles = (files) => {
  if (!files) return false;
  console.log(files)

  // validación del número de archivos
  let lengthValid = 1 <= files.length && files.length <= 5;
  console.log(lengthValid)

  // validación del tipo de archivo
  let typeValid = true;

  for (const file of files) {
    // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image";
  }

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && typeValid;
};


const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm_quien = document.forms["formulario_quien"];
  let myForm_donde = document.forms["formulario_donde"];
  let myForm_cuando = document.forms["formulario_cuando"];
  let email = myForm_quien["email"].value;
  let phoneNumber = myForm_quien["phone"].value;
  let name = myForm_quien["nombre"].value;
  let contactar = myForm_quien["contactar_por"].value;
  let region = myForm_donde["select_region"].value;
  let comuna = myForm_donde["select_comuna"].value;
  let sector = myForm_donde["sector"].value;
  let fecha_inicio = myForm_cuando["fecha_inicio"].value;
  let fecha_termino = myForm_cuando["fecha_termino"].value;
  let tema = myForm_cuando["select_tema"].value;
  let files = myForm_cuando["files"].files;

  console.log(fecha_inicio)
  console.log(fecha_termino)
  console.log(tema)

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
  if (!validateRegion(region)) {
    setInvalidInput("Region");
  }
  if (!validateComuna(comuna)) {
    setInvalidInput("Comuna");
  }
  if(!validateSector(sector)){
    setInvalidInput("Sector");
  }
  if (!validateFechaInicio(fecha_inicio)) {
    setInvalidInput("Fecha de inicio");
  }
  if (!validateFechaTermino(fecha_inicio,fecha_termino)) {
    setInvalidInput("Fecha de término");
  }
  if (!validateTema(tema)) {
    setInvalidInput("Tema");
  }
  if (!validateFiles(files)) {
    setInvalidInput("Archivos");
  }

  // finalmente mostrar la validación
  let validationBox = document.getElementById("contenedor_validador");
  let validationform = document.querySelector(".contenedor_formulario");
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
    formContainer.style.height ="650px";
    validationBox.style.height="250px"
    validationform.style.height="400px"
  } else {
    // Ocultar el formulario
    myForm_cuando.style.display = "none";
 

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Esta seguro que desea enviar esta actividad?";
    validationListElem.textContent = "";

    validationListElem.style.display = "flex";
    validationListElem.style.justifyContent = "space-between";
  

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";


    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.style.width="200px";
    submitButton.style.height="50px";
    submitButton.innerText = "Si, estoy seguro!";

    const confirmMessage = () => {
        validationMessageElem.innerText = "“Hemos recibido su información, muchas gracias y suerte en su actividad” ";
        validationBox.style.border="2px solid #4CAF50";
        validationBox.style.display="flex";
        validationBox.style.flexDirection="column";
        validationBox.style.alignItems="center";
        validationBox.style.padding="5px";
        validationListElem.removeChild(submitButton)
        validationListElem.removeChild(backButton)
        let returnHome=document.createElement("button");
        returnHome.innerText="Volver al inicio";
        //returnHome.style.width="200px";
        //returnHome.style.height="50px";
        returnHome.style.marginBottom="15px";
        returnHome.addEventListener("click", () => {
          window.location.href = "index.html";
        })

        validationBox.appendChild(returnHome);
    };
    submitButton.addEventListener("click", () => {
      confirmMessage();
    });


    let backButton = document.createElement("button");
    backButton.style.width="200px";
    backButton.style.height="50px";
    backButton.style.marginLeft="35px";
    backButton.innerText = "No,no estoy seguro,volver al formulario";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm_cuando.style.display = "";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


/*let submitBtn = document.getElementById("31");
submitBtn.addEventListener("click", validateForm);*/
const agregarActividad = () => {
  form_actividad = document.getElementById("formulario_unico");
  /*let { confText, isValid } = validadorConfesion(confTextArea.value);
  if (!isValid) {
    return;
  }*/
  form_actividad.submit();
};
let submitActividadBtn = document.getElementById("31");
submitActividadBtn.addEventListener("click", agregarActividad);





