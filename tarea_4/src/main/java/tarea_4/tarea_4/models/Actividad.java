@Entity
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;
    private LocalDate fechaTermino;

    private String nombre;
    private String sector;
    private String tema;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nota> notas = new ArrayList<>();

    // Getters y setters

    public double getPromedioNotas() {
        if (notas.isEmpty()) return -1;
        return notas.stream().mapToInt(Nota::getValor).average().orElse(-1);
    }
}

