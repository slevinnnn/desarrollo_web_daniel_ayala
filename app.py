from flask import Flask, request, render_template, redirect, url_for, session
from utils.validations import actividad_valida
from database import db 
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}


# --- Routes ---
@app.route("/")
def index():
    actividades = db.get_historial_actividades()
    return render_template("index.html", actividades=actividades)

@app.route("/estadisticas")
def estadisticas():

    return render_template("estadisticas.html")

@app.route("/actividades", methods=["GET"])
def actividades():
    # Obtener el número de página desde la URL, por defecto la 1
    page = request.args.get("page", default=1, type=int)
    per_page = 5
    offset = (page - 1) * per_page
    actividades =[]
    total_actividades = db.get_total_activities()
    for actividad in db.get_activities(per_page, offset):
        actividad_id = actividad.id
        temas= db.get_temas_by_activity_id(actividad_id)
        if temas[0].tema != "otro":
            tema = temas[0].tema
        else:
            tema = temas[0].glosa_otro
        comuna_id = actividad.comuna_id
        comuna = db.get_comuna_by_id(comuna_id)
        actividades.append({
            "comuna": comuna.nombre if comuna else "Desconocida",
            "nombre": actividad.nombre,
            "sector": actividad.sector,
            "tema": tema if temas else "Sin Tema",
            "celular": actividad.celular,
            "dia_hora_inicio": actividad.dia_hora_inicio,
            "dia_hora_termino": actividad.dia_hora_termino,
            "descripcion": actividad.descripcion
        })
        total_pages = (total_actividades + per_page - 1) // per_page  # redondeo hacia arriba
    return render_template("actividades.html",actividades=actividades,page=page, total_pages=total_pages)

@app.route("/agregar_actividad")
def agregarActividad():
    return render_template("agregar_actividad.html")


@app.route('/post-actividad', methods=['POST'])
def post_actividad():
    # Get form data
    sector = request.form.get('sector')
    nombre = request.form.get('nombre')
    email = request.form.get('email')
    celular = request.form.get('phone')
    dia_hora_inicio = request.form.get('fecha_inicio')
    dia_hora_termino = request.form.get('fecha_termino')
    descripcion = request.form.get('descripcion')
    comuna_id= request.form.get('select_comuna')
    region_id= request.form.get('select_region')
    contactar_por = request.form.get('contactar_por')
    contacto_id = request.form.get('comments3')
    tema = request.form.get('select_tema')
    foto = request.files.get('files')
    tema_otro = request.form.get('comments4')

    region= db.get_region_by_id(region_id).nombre
    comuna= db.get_comuna_by_id(comuna_id).nombre

    data_validadora={
        "region": region,
        "comuna": comuna,
        "sector": sector,
        "nombre": nombre,
        "email": email,
        "celular": celular,
        "contacto": contacto_id,
        "dia_hora_inicio": dia_hora_inicio,
        "dia_hora_termino": dia_hora_termino,
        "tema": tema,
        "glosa_otro": tema_otro,
        "fotos": foto
    }

    # Get uploaded files
    files = request.files.getlist('fotos[]')

    #Validate the form data
    if not actividad_valida(data_validadora):
       return "Invalid form data", 400

    # Save the files
    _filename = hashlib.sha256(
        secure_filename(foto.filename) # nombre del archivo
        .encode("utf-8") # encodear a bytes
        ).hexdigest()
    _extension = filetype.guess(foto).extension
    img_filename = f"{_filename}.{_extension}"

    # 2. save img as a file
    foto.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))

    '''
    file_paths = []
    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        file_paths.append(file_path)
    '''

    # Save the activity to the database
    actividad_id=db.create_actividad(comuna_id,sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion)

    if contactar_por:
        db.create_contactar_por(actividad_id,contactar_por, contacto_id)
    else:
        db.create_contactar_por(actividad_id)

    if tema!="otro":
        db.create_tema(tema, actividad_id)
    else:
        tema_otro = request.form.get('comments4')
        db.create_tema(tema,actividad_id,tema_otro)

    # Save the photos to the database
    db.create_foto(actividad_id, img_filename, foto.filename)
   

    return redirect(url_for('index'))

