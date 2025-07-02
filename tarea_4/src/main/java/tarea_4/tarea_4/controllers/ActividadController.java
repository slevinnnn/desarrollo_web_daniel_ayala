package tarea_4.tarea_4.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tarea_4.tarea_4.models.Actividad;
import tarea_4.tarea_4.models.Nota;
import tarea_4.tarea_4.repository.ActividadRepository;
import tarea_4.tarea_4.repository.NotaRepository;
import tarea_4.tarea_4.Dto.ActividadDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    // 🟢 GET /api/actividades/evaluables
    @GetMapping("/evaluables")
    public List<ActividadDTO> listarEvaluables() {
        LocalDate hoy = LocalDate.now();
        List<Actividad> actividades = actividadRepository.findByFechaInicioBefore(hoy);
        return actividades.stream()
                .map(ActividadDTO::new)
                .collect(Collectors.toList());
    }
}

    // 🟢 POST /api/actividades/{id}/nota
    @PostMapping("/{id}/nota")
    public ResponseEntity<String> agregarNota(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Optional<Actividad> optActividad = actividadRepository.findById(id);
        if (optActividad.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        int valor = body.get("nota");
        if (valor < 1 || valor > 7) {
            return ResponseEntity.badRequest().body("La nota debe estar entre 1 y 7.");
        }

        Actividad actividad = optActividad.get();
        Nota nota = new Nota();
        nota.setValor(valor);
        nota.setActividad(actividad);
        notaRepository.save(nota);


