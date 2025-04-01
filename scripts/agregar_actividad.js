let contador=0;
const  nextStep = (step) => {
  console.log(contador)
  console.log(step)
    if (step >= 3) return;
    contador++;
    document.getElementById("contenedor_formulario").style.transform = `translateX(-${contador * 33.33}%)`;
}

document.querySelectorAll(".btn_siguiente").forEach((button) => {
  button.addEventListener("click", () => {
    let button_id=Number(button.id)
    nextStep(button_id);
  });
}
);
