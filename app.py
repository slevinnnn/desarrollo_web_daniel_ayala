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

@app.route("/actividades")
def actividades():
    return render_template("actividades.html")

@app.route("/agregar_actividad")
def agregarActividad():
    return render_template("agregar_actividad.html")

