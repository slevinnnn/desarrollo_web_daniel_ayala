from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

from sqlalchemy import DateTime,Enum
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class Region(Base):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'))

    region = relationship("Region", back_populates="comunas")
    actividades = relationship("Actividad", back_populates="comuna")


class Actividad(Base):
    __tablename__ = 'actividad'
    id = Column(Integer, primary_key=True)
    comuna_id = Column(Integer, ForeignKey('comuna.id'))
    sector = Column(String(100))
    nombre = Column(String(200))
    email = Column(String(100))
    celular = Column(String(15))
    dia_hora_inicio = Column(DateTime)
    dia_hora_termino = Column(DateTime)
    descripcion = Column(String(500),nullable=True)

    comuna = relationship("Comuna", back_populates="actividades")
    fotos = relationship("Foto", back_populates="actividad")
    formas_contacto = relationship("ContactarPor", back_populates="actividad")
    temas = relationship("ActividadTema", back_populates="actividad")


class Foto(Base):
    __tablename__ = 'foto'
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300))
    nombre_archivo = Column(String(300))
    actividad_id = Column(Integer, ForeignKey('actividad.id'))

    actividad = relationship("Actividad", back_populates="fotos")


class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True)
    nombre = Column(Enum("Whatsapp","Telegram","X","Instagram","TikTok","Otra")) 
    identificador = Column(String(150))
    actividad_id = Column(Integer, ForeignKey('actividad.id'))

    actividad = relationship("Actividad", back_populates="formas_contacto")


class ActividadTema(Base):
    __tablename__ = 'actividad_tema'
    id = Column(Integer, primary_key=True)
    tema = Column(Enum('música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 'juegos', 'baile', 'comida', 'otro'))
    glosa_otro = Column(String(15))
    actividad_id = Column(Integer, ForeignKey('actividad.id'))

    actividad = relationship("Actividad", back_populates="temas")



def get_comuna_by_id(comuna_id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter(Comuna.id == comuna_id).first()
    session.close()
    return comuna


def get_activities(page_size):
    session = SessionLocal()
    actividades = session.query(Actividad).limit(page_size).all()
    session.close()
    return actividades

def get_temas_by_activity_id(activity_id):
    session = SessionLocal()
    temas = session.query(ActividadTema).filter(ActividadTema.actividad_id == activity_id).all()
    session.close()
    return temas

def get_activity_by_id(activity_id):
    session = SessionLocal()
    actividad = session.query(Actividad).filter(Actividad.id == activity_id).first()
    session.close()
    return actividad

def create_actividad(comuna_id, sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion):
    #session = SessionLocal()
    new_actividad = Actividad(comuna_id=comuna_id, sector=sector, nombre=nombre, email=email, celular=celular,
                              dia_hora_inicio=dia_hora_inicio, dia_hora_termino=dia_hora_termino, descripcion=descripcion)
    
    with SessionLocal() as session:
        session.add(new_actividad)
        session.commit()
        session.refresh(new_actividad)  # ← Esto garantiza que el ID esté cargado
        actividad_id = new_actividad.id  # ← Accede aquí, dentro del `with`
    print(f"Actividad ID: {actividad_id}")  # Imprime el ID de la actividad creada   
    return actividad_id


def create_tema(tema, actividad_id, glosa_otro=None):
    session = SessionLocal()
    new_tema = ActividadTema(tema=tema, actividad_id=actividad_id, glosa_otro=glosa_otro)
    session.add(new_tema)
    session.commit()
    session.close()

def create_contactar_por(actividad_id, nombre=None, identificador=None):
    session = SessionLocal()
    new_contactar_por = ContactarPor(actividad_id=actividad_id,nombre=nombre, identificador=identificador )
    session.add(new_contactar_por)
    session.commit()
    session.close()


