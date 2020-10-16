# TP2 Clinica

## Clinica descripcion
La clinica Cuenta con:
 - Consultorios (6 actualmente)
 - Laboratorios 2
 - Sala de espera

 Horarios 
  - lu a vi 8:00 a 19:00
  - sa 8:00 a 14:00

## Tipos de usuario
Profesional: 
 - Especialidad (puede ser mas de una)
 - Necesita aprobacion del admin para poder atender (por especialidad).

Paciente:
 - Necesita 2 imagenes de perfil
 - Verificar direccion de mail

Administrados:
 - Solo un admin puede cargar un admin.
 - puede agregar especialidades a profesionales
 - autoriza profesionales a atender pacientes

## DBs
Profesionales:
 - id: autogenerado
 - nombre: string
 - apellido: string
 - especialidad: array
 - tiempoTurno: 30m o mas
 - horarios de atencion: dentro del rango
 - estaAceptado: booleano
 - valoracion: 1 a 5 ()

EspaciosDeAtencion:
 - id: autogenerado
 - tipo: (consultorio, laboratiorio)
 - nombre: x

Turnos:
 - id: autogenerado
 - tipo: (consultorio, laboratiorio)
 - profesional: listado de la tabla profesionales
 - horario: dentro del siguiente rango (lu a vi 8:00 a 19:00 && sa 8:00 a 14:00) y con el tiempo que cargo el profesional para esa especialidad
 - aceptacion: el profesional debe aceptar el turno (se avisa al cliente el resultado) 
    puede cancelar la aceptacion

Encuesta:
 - id: autogenerado
 - profesional: id profesional
 - especialidad: (una del array de profesional)
 - puntuacion: 1 a 5
 - Comentarios: string 

ReseñaTurno/historiaClínica:
 - id: autogenerado
 - profesional: id profesional
 - paciente: id paciente
 - especialidad: la del turno 
 - fecha: la del turno
 - edad
 - temperaturaCorporal
 - presión
 - datosExtra: map(string, string)
 - texto: string

### Encuesta de atencion
    se le da una encuesta al cliente para evaluar a los profesionales


# Turnos
Los consultorios se ocupan por disponibilidad por especialistas de diferentes areas
se ocupan para consulta o tratamiento.
el turno se pide seleccionando profesional o especialidad. La duracion minima del turno es 30m
el profesional puede cambiar la duracion por especialidad
un profesional puede tener mas de una especialidad

### Paciente
Se ven los turnos solo de 15 dias desde la fecha
Se puede filtrar listado de profesionales por 
- apellido
- especialidad
- dia de la semana

Los turnos se pueden pedir y cancelar
se pueden ver los turnos anteriores

### Profesional





## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).