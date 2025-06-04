
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/estadisticas");
        const data = await response.json();

        renderGraficoLineas(data.actividades_por_dia);
        renderGraficoTorta(data.actividades_por_tipo);
        renderGraficoBarras(data.actividades_por_mes_y_turno);
    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    }

    function renderGraficoLineas(data) {
        const ctx = document.getElementById("graficoLineas").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map(d => d.fecha),
                datasets: [{
                    label: "Cantidad de Actividades",
                    data: data.map(d => d.cantidad),
                    fill: false,
                    borderColor: "blue",
                    tension: 0.1
                }]
            },
            options:{
                responsive: false
            }
        });
    }

    function renderGraficoTorta(data) {
        const ctx = document.getElementById("graficoTorta").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: data.map(d => d.tipo),
                datasets: [{
                    data: data.map(d => d.cantidad),
                    backgroundColor: [
                        "red", "orange", "yellow", "green", "blue", "purple", "pink", "cyan", "gray", "brown"
                    ]
                }]
            },
            options: {
                responsive: false
            }
        });
    }

    function renderGraficoBarras(data) {
        const ctx = document.getElementById("graficoBarras").getContext("2d");

        const meses = data.map(d => d.mes);
        const manana = data.map(d => d["mañana"]);
        const medio = data.map(d => d["mediodía"]);
        const tarde = data.map(d => d["tarde"]);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: meses,
                datasets: [
                    {
                        label: "Mañana",
                        data: manana,
                        backgroundColor: "rgba(255, 206, 86, 0.7)"
                    },
                    {
                        label: "Mediodía",
                        data: medio,
                        backgroundColor: "rgba(54, 162, 235, 0.7)"
                    },
                    {
                        label: "Tarde",
                        data: tarde,
                        backgroundColor: "rgba(255, 99, 132, 0.7)"
                    }
                ]
            },
            options: {
                responsive: false,
                scales: {
                    x: {
                        stacked: false
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

