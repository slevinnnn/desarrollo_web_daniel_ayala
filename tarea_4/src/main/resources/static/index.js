let actividadIdSeleccionada = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchActividades();
});

function fetchActividades() {
    fetch("/api/actividades/evaluables")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#tabla-actividades tbody");
            tbody.innerHTML = "";

            data.forEach(actividad => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${actividad.id}</td>
                    <td>${actividad.fechaInicio}</td>
                    <td>${actividad.sector}</td>
                    <td>${actividad.nombre}</td>
                    <td>${actividad.tema}</td>
                    <td id="nota-${actividad.id}">${actividad.nota}</td>
                    <td><button onclick="abrirModal(${actividad.id})">Evaluar</button></td>
                `;

                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al obtener actividades:", error);
        });
}

function abrirModal(id) {
    actividadIdSeleccionada = id;
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal-actividad-id").textContent = `ID: ${id}`;
    document.getElementById("nota-select").value = "";
}

function cerrarModal() {
    document.getElementById("modal").classList.add("hidden");
    actividadIdSeleccionada = null;
}

function enviarNota() {
    const valor = parseInt(document.getElementById("nota-select").value);

    if (!valor || valor < 1 || valor > 7) {
        alert("Por favor, selecciona una nota válida entre 1 y 7.");
        return;
    }

    fetch(`/api/actividades/${actividadIdSeleccionada}/nota`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nota: valor })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text(); // promedio actualizado
    })
    .then(nuevoPromedio => {
        document.getElementById(`nota-${actividadIdSeleccionada}`).textContent = nuevoPromedio;
        cerrarModal();
        alert("¡Nota registrada correctamente!");
    })
    .catch(error => {
        console.error("Error al enviar la nota:", error);
        alert("Error al registrar la nota: " + error.message);
    });
}

