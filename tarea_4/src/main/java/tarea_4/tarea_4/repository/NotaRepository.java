package tarea_4.tarea_4.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tarea_4.tarea_4.models.Nota;

public interface NotaRepository extends JpaRepository<Nota, Long> {
}
