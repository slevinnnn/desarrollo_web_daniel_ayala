package tarea_4.tarea_4.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;

    private String nombre;
    private String sector;
    private String tema;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas = new ArrayList<>();

        // Constructor
    public Actividad(Actividad actividad) {
        this.id = actividad.getId();
        this.fechaInicio = actividad.getFechaInicio();
        this.sector = actividad.getSector();
        this.nombre = actividad.getNombre();
        this.tema = actividad.getTema();

    }

    // Getters y setters

    public double getPromedioNotas() {
        if (notas.isEmpty()) return -1;
        return notas.stream().mapToInt(Nota::getValor).average().orElse(-1);
    }

        // Getters
    public Long getId() { return id; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public String getSector() { return sector; }
    public String getNombre() { return nombre; }
    public String getTema() { return tema; }
}

