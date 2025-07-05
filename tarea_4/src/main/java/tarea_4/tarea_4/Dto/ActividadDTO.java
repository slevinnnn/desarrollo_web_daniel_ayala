package tarea_4.tarea_4.Dto;

import tarea_4.tarea_4.models.Actividad;

import java.time.LocalDate;

public class ActividadDTO {
    private Long id;
    private LocalDate fechaInicio;
    private String sector;
    private String nombre;
    private String tema;
    private String nota;
    private int comuna_id;

    public ActividadDTO(Actividad actividad) {
        this.id = actividad.getId();
        this.fechaInicio = actividad.getFechaInicio();
        this.sector = actividad.getSector();
        this.nombre = actividad.getNombre();
        this.tema = actividad.getTema();
        this.comuna_id=actividad.getComuna_id();
        double promedio = actividad.getPromedioNotas();
        this.nota = promedio == -1 ? "-" : String.format("%.2f", promedio);
    }

    // Getters...
     // Getters obligatorios para serializar como JSON
    public Long getId() {
        return id;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public String getSector() {
        return sector;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTema() {
        return tema;
    }

    public String getNota() {
        return nota;
    }
    public int getComuna_id(){
        return comuna_id;}
}

