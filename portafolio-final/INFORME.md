# INFORME DEL PROYECTO
## Portafolio Web - Plataforma de Gestión de Programadores

---

## 1. Inicio

<div align="center">

![Universidad Politécnica Salesiana](/public/imagenes/ups.webp)

### Universidad Politécnica Salesiana
### Carrera de Computación

<br>

### 🚀 Portafolio Web
#### Sistema de Gestión de Programadores y Asesorías Técnicas

</div>

---

## 2. Integrantes

| Nombre Completo | GitHub Personal | LinkedIn |
| :--- | :--- | :--- |
| **Alexander Chuquipoma** | [github.com/AlexChuquipoma](https://github.com/AlexChuquipoma) | [LinkedIn Profile](https://www.linkedin.com/in/alexander-chuquipoma-a62686220/) |
| **Juan Fernández** | [github.com/Juan0Fernandez](https://github.com/Juan0Fernandez) | [LinkedIn Profile](https://www.linkedin.com/in/juan-fernandez-074a3734b/) |

**Correo de contacto del proyecto:** achuquipoma@est.ups.edu.ec

**Repositorio del Proyecto:** [Ver Repositorio](https://portafolio-b7410.web.app/portfolio)

---

## 3. Tecnologías Utilizadas

<div align="center">

### Stack Tecnológico Principal

<table>
  <tr>
    <td align="center" width="150">
      <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="80" height="80"/><br/>
      <strong>Angular 21</strong><br/>
      <sub>Framework Frontend</sub>
    </td>
    <td align="center" width="150">
      <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="80" height="80"/><br/>
      <strong>Firebase</strong><br/>
      <sub>Backend Serverless</sub>
    </td>
    <td align="center" width="150">
      <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" width="80" height="80"/><br/>
      <strong>TypeScript</strong><br/>
      <sub>Lenguaje Principal</sub>
    </td>
    <td align="center" width="150">
      <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="80" height="80"/><br/>
      <strong>Tailwind CSS</strong><br/>
      <sub>Framework de Estilos</sub>
    </td>
  </tr>
</table>

</div>



### 🔧 Tecnologías Frontend

- **Angular 21.0.0:** Framework principal para la construcción de la SPA (Single Page Application).
- **TypeScript 5.9.2:** Lógica de programación tipada y robusta.
- **Tailwind CSS 4.1.12:** Diseño rápido y responsive mediante clases utilitarias.
- **Angular Router:** Gestión eficiente de la navegación entre vistas.

### 🗄️ Backend y Almacenamiento

- **Firebase Authentication:** Gestión segura de identidad (Login, Registro, Sesiones persistentes).
- **Cloud Firestore:** Base de datos NoSQL en tiempo real para usuarios, proyectos y asesorías.
- **Cloudinary:** Servicio especializado para la gestión, optimización y almacenamiento de imágenes.

### 📧 Servicios Externos

- **EmailJS:** Automatización de correos electrónicos transaccionales (notificaciones de asesoría).
- **WhatsApp Integration:** Generación de enlaces dinámicos para contacto directo e inmediato.

### 🛠️ Herramientas de Desarrollo

- **Angular CLI, RxJS, npm:** Suite completa para desarrollo, manejo de asincronía (Reactive), testing y gestión de paquetes.

---

## 4. Descripción del Proyecto

> **Portafolio Web** es una plataforma integral que centraliza la gestión de portafolios profesionales. Permite a los **administradores** controlar el sistema, a los **programadores** exhibir su trabajo y gestionar asesorías, y a los **usuarios** buscar talento y solicitar mentorías técnicas.
>
> La arquitectura se basa en servicios modulares y reutilizables, garantizando escalabilidad y una experiencia de usuario fluida mediante actualizaciones en tiempo real.

### Objetivos del Proyecto

1. **Centralizar** la exposición de portafolios de programadores en un entorno unificado.
2. **Gestionar** eficientemente el ciclo de vida de las solicitudes de asesorías técnicas.
3. **Notificar** en tiempo real y por correo electrónico los cambios de estado importantes.
4. **Administrar** roles y permisos mediante un panel de control robusto y seguro.
5. **Ofrecer** una interfaz moderna, responsive y amigable para todo tipo de dispositivo.

---

## 5. Roles y Funcionalidades

### 👤 **Usuario (USER)**
*Rol básico asignado por defecto a clientes y visitantes.*
- ✅ **Visualización:** Acceso completo a portafolios, proyectos académicos/profesionales y habilidades.
- 📋 **Asesorías:** Capacidad para agendar citas técnicas, describir necesidades y ver el historial de solicitudes.
- 👥 **Perfil:** Gestión autónoma de datos personales, cambio de contraseña y foto de perfil.
- 🔔 **Notificaciones:** Alertas visuales y por correo sobre la aprobación o rechazo de sus solicitudes.

### 💻 **Programador (PROGRAMMER)**
*Rol especializado para desarrolladores que ofrecen servicios.*
- ✨ **Todas las funciones de Usuario** incluidas.
- 📊 **Dashboard:** Panel con estadísticas de desempeño y resumen de actividad (pendientes, aprobadas).
- 🎯 **Gestión de Asesorías:** Capacidad para aceptar o rechazar solicitudes, con envío automático de respuestas.
- 💼 **Proyectos:** Control total sobre su catálogo de proyectos, incluyendo enlaces y demos.
- 🌐 **Portafolio:** Personalización de su página pública.

### 🔴 **Administrador (ADMIN)**
*Rol de control total y mantenimiento del sistema.*
- 🌟 **Todas las funciones de Programador y Usuario** incluidas.
- 🎛️ **Dashboard Global:** Vista omnisciente con métricas generales del sistema.
- 👥 **Gestión de Usuarios:** Facultad para crear, editar y eliminar cualquier cuenta; asignación y cambio de roles.
- ⏰ **Horarios:** Configuración de la disponibilidad horaria general del sistema.
- 🔐 **Supervisión:** Acceso irrestricto a todas las colecciones de datos para mantenimiento.

---

## 6. Módulos y Pantallas del Sistema

### 🔐 **Módulo de Autenticación**
- **Login:** Acceso seguro con validación de credenciales en tiempo real y redirección inteligente según el rol del usuario.
- **Registro:** Creación de nuevas cuentas con validación de formularios y asignación automática del rol básico.

### 🏠 **Módulo de Portafolios**
- **Home:** Vista de bienvenida con presentación del equipo y acceso general.
- **Portafolios Personales:** Vistas modulares para cada desarrollador (Alexander y Juan) que integran componentes reutilizables para mostrar biografía, skills y proyectos destacados.

### 👤 **Módulo de Perfil**
- **Gestión Personal:** Interfaz para la actualización de información de contacto.
- **Seguridad y Avatar:** Herramientas para el cambio seguro de contraseña y subida de foto de perfil con previsualización.

### 💻 **Dashboard de Programador**
- **Panel de Control:** Visualización rápida de métricas clave.
- **Administrador de Solicitudes:** Bandeja de entrada de asesorías con acciones rápidas de respuesta.
- **Editor de Proyectos:** Formularios validados para agregar o modificar proyectos del portafolio.

### 🔴 **Dashboard de Administrador**
- **Gestión Global:** Tablas avanzadas con filtros y búsqueda para administrar la base de usuarios.
- **Control de Horarios:** Interfaz para definir los bloques horarios disponibles para asesorías.
- **Auditoría:** Vista general de todas las asesorías del sistema.

---

## 7. Flujos Principales del Usuario (Resumen)

### 🔹 1. Registro e Inicio de Sesión
El usuario completa el formulario de registro; Firebase crea la cuenta y la entrada en la base de datos. Al iniciar sesión, el sistema verifica las credenciales y, mediante "Guards" de seguridad, redirige al usuario a su panel correspondiente (Admin, Programador o Usuario).

### 🔹 2. Solicitud de Asesoría
El usuario selecciona un programador, fecha y tema. El sistema guarda la solicitud como "pendiente" y dispara automáticamente un correo electrónico al programador notificando la nueva petición.

### 🔹 3. Gestión de Asesoría
El programador revisa la solicitud en su dashboard. Al **Aprobar**, el sistema actualiza el estado, crea una notificación interna y envía un correo de confirmación al usuario. Al **Rechazar**, el proceso es similar, notificando la negativa.

### 🔹 4. Gestión de Proyectos
El programador ingresa los detalles de un nuevo proyecto (repositorio, demo, imagen). El sistema valida las URLs y la integridad de los datos antes de publicar el proyecto en el portafolio público en tiempo real.

---

## 8. Resumen Técnico de Implementación

### 📧 Integración de Email (EmailJS)
Se implementó un servicio dedicado que conecta la aplicación con EmailJS. Esto permite enviar correos transaccionales automáticos (confirmaciones, alertas) sin necesidad de un backend propio, utilizando plantillas predefinidas.

### 💬 Integración con WhatsApp
El sistema genera enlaces inteligentes que abren directamente la API de WhatsApp. Estos enlaces incluyen el número del programador y un mensaje pre-redactado con el nombre del usuario, facilitando el contacto inmediato.

### 🔔 Notificaciones en Tiempo Real
Mediante el uso de **suscripciones a Firestore** (snapshots), la aplicación escucha cambios en la colección de notificaciones. Esto permite que el contador de "no leídos" y la lista de alertas se actualicen instantáneamente en la interfaz sin necesidad de recargar la página.

### 🔒 Seguridad y Roles (Guards)
La seguridad se maneja a nivel de enrutamiento. Los `AuthGuards` verifican que exista una sesión activa, mientras que los `RoleGuards` comprueban si el usuario tiene los permisos necesarios (Admin/Programmer) para acceder a una ruta específica, bloqueando accesos no autorizados.

### 📸 Manejo de Archivos
La subida de imágenes se gestiona con **Cloudinary**. El proceso incluye validación del tipo de archivo y tamaño en el cliente antes de subirlo a la nube y obtener la URL pública optimizada para su visualización.

---

## 9. Conclusiones

### 🎯 Logros del Proyecto
1. **Arquitectura Modular:** Se logró una estructura de código limpia y mantenible, reduciendo la redundancia mediante componentes reutilizables.
2. **Sistema Robusto:** La integración de autenticación, base de datos en tiempo real y almacenamiento funciona de manera cohesiva y segura.
3. **Experiencia de Usuario:** Se consiguió un flujo de trabajo intuitivo para la gestión de asesorías, apoyado por notificaciones efectivas (email y visuales).
4. **Diseño Moderno:** La interfaz es completamente responsive y estéticamente agradable gracias a Tailwind CSS.

### 📚 Aprendizajes Clave
- Dominio de la **arquitectura Standalone** de las últimas versiones de Angular.
- Comprensión profunda del ecosistema **Serverless** con Firebase.
- Manejo avanzado de **flujos asíncronos** y programación reactiva.
- Importancia de la **validación de datos** tanto en frontend como en reglas de seguridad.

---

## 📞 Contacto y Soporte

Para consultas, sugerencias o reportes de bugs:

| Contacto | Email | GitHub |
| :--- | :--- | :--- |
| **Alexander Chuquipoma** | achuquipoma@est.ups.edu.ec | [AlexChuquipoma](https://github.com/AlexChuquipoma) |
| **Juan Fernández** | jfernandezl6@est.ups.edu.ec | [Juan0Fernandez](https://github.com/Juan0Fernandez) |

<br>

<div align="center">

### 🎓 Universidad Politécnica Salesiana
### Carrera de Computación

**Proyecto Académico - 2025**

---

**Desarrollado por Alexander Chuquipoma y Juan Fernández**

</div>
