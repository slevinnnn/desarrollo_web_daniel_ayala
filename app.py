from flask import Flask, request, render_template, redirect, url_for, session
from utils.validations import validate_login_user, validate_register_user, validate_confession
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
    
    return render_template("index.html")

@app.route("/estadisticas")
def estadisticas():

    return render_template("estadisticas.html")

@app.route("/actividades", methods=["GET"])
def actividades():
    actividades =[]
    for actividad in db.get_activities(5):
        actividad_id = actividad.id
        tema= db.get_temas_by_activity_id(actividad_id)
        comuna_id = actividad.comuna_id
        comuna = db.get_comuna_by_id(comuna_id)
        actividades.append({
            "comuna": comuna.nombre if comuna else "Desconocida",
            "nombre": actividad.nombre,
            "sector": actividad.sector,
            "tema": tema[0].tema if tema else "Sin Tema",
            "celular": actividad.celular,
            "dia_hora_inicio": actividad.dia_hora_inicio,
            "dia_hora_termino": actividad.dia_hora_termino,
            "descripcion": actividad.descripcion
        })
    return render_template("actividades.html",actividades=actividades)

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
    contactar_por = request.form.get('contactar_por')
    contacto_id = request.form.get('comments3')
    tema = request.form.get('select_tema')



    # Get uploaded files
    files = request.files.getlist('fotos[]')

    # Validate the form data
    #if not validate_confession(sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion):
    #    return "Invalid form data", 400

    # Save the files
    file_paths = []
    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        file_paths.append(file_path)

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

    return redirect(url_for('index'))

