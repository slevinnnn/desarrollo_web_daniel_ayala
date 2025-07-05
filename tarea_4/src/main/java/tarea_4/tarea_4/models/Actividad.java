package tarea_4.tarea_4.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;
    private String nombre;
    private String sector;
    private String tema;
    private int comuna_id;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas = new ArrayList<>();

    public double getPromedioNotas() {
        if (notas == null || notas.isEmpty()) return -1;
        return notas.stream().mapToInt(Nota::getValor).average().orElse(-1);
    }

    // Getters y setters
    public Long getId() { return id; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public String getNombre() { return nombre; }
    public String getSector() { return sector; }
    public String getTema() { return tema; }
    public int getComuna_id(){return comuna_id;}
    public List<Nota> getNotas() { return notas; }

    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setSector(String sector) { this.sector = sector; }
    public void setTema(String tema) { this.tema = tema; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
    public void setComuna_id(int comuna_id){this.comuna_id=comuna_id;}
}


