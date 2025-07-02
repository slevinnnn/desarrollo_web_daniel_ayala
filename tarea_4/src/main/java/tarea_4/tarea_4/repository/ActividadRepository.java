package tarea_4.tarea_4.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tarea_4.tarea_4.models.Actividad;

import java.time.LocalDate;
import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByFechaInicioBefore(LocalDate fecha);
}

