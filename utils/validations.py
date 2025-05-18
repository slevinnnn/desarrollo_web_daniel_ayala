import re
from datetime import datetime
import filetype

# 1. Validación región

def validar_region(region):
    return region is not None and region.strip() != ""

# 2. Validación comuna

def validar_comuna(comuna):
    return comuna is not None and comuna.strip() != ""

# 3. Validación sector (opcional, máx 100)

def validar_sector(sector):
    return sector is None or len(sector.strip()) <= 100

# 4. Validación nombre (obligatorio, máx 200)

def validar_nombre(nombre):
    return nombre and len(nombre.strip()) <= 200

# 5. Validación email (obligatorio, máx 100, formato válido)

def validar_email(email):
    if not email or len(email.strip()) > 100:
        return False
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

# 6. Validación celular (opcional, formato +NNN.NNNNNNNN)

def validar_celular(celular):
    if not celular:
        return True
    return bool(re.match(r"^\+\d{3}\.\d{8}$", celular))

# 7. Validación contactos (opcional, máx 5, cada uno entre 4 y 50 chars)

def validar_contacto(contacto):
    #if len(lista_contactos) > 5:
        #return False
    if not (4 <= len(contacto) <= 50):
            print(f"Contacto inválido: {contacto}")
            return False
    return True

# 8. Fecha de inicio obligatoria

def validar_fecha_inicio(fecha_str):
    try:
        datetime.strptime(fecha_str, "%Y-%m-%dT%H:%M")
        return True
    except:
        return False

# 9. Fecha de término opcional, debe ser posterior a inicio si se da

def validar_fecha_termino(inicio_str, termino_str):
    if not termino_str:
        return True
    try:
        inicio = datetime.strptime(inicio_str, "%Y-%m-%dT%H:%M")
        termino = datetime.strptime(termino_str, "%Y-%m-%dT%H:%M")
        return termino > inicio
    except:
        print(f"Error en la validación de fecha de término: {termino_str}")
        return False

# 10. Validación tema y glosa_otro

def validar_tema(tema, glosa_otro):
    temas_validos = ['música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 'juegos', 'baile', 'comida', 'otro']
    if tema not in temas_validos:
        print(f"Tema inválido")
        return False
    if tema == "otro":
        return bool(glosa_otro and 3 <= len(glosa_otro.strip()) <= 15)
    return True

def validar_img(act_img):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}

    # check if a file was submitted
    if act_img is None:
        return False

    # check if the browser submitted an empty file
    if act_img.filename == "":
        print("No se subió ninguna imagen.")
        return False
    
    # check file extension
    ftype_guess = filetype.guess(act_img)
    if  not ftype_guess:
        print("No se pudo determinar el tipo de archivo.")
        return False
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        print(f"Extensión de archivo no permitida: {ftype_guess.extension}")
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        print(f"Mimetype no permitido: {ftype_guess.mime}")
        return False
    return True

# 11. Validación fotos (entre 1 y 5)

#def validar_fotos(fotos):
   # return 1 <= len(fotos) <= 5

# 12. Función general

def actividad_valida(data):
    print('data validadora:', data)
    return (
        validar_region(data.get("region")) and
        validar_comuna(data.get("comuna")) and
        validar_sector(data.get("sector")) and
        validar_nombre(data.get("nombre")) and
        validar_email(data.get("email")) and
        validar_celular(data.get("celular")) and
        validar_contacto(data.get("contacto")) and
        validar_fecha_inicio(data.get("dia_hora_inicio")) and
        validar_fecha_termino(data.get("dia_hora_inicio"), data.get("dia_hora_termino")) and
        validar_tema(data.get("tema"), data.get("glosa_otro")) and
        validar_img(data.get("fotos"))
    )

