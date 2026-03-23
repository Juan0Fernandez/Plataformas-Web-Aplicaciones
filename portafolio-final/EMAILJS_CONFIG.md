# 📧 Configuración de EmailJS para Notificaciones de Asesorías

Este documento te guía paso a paso para configurar EmailJS y hacer funcionar las notificaciones por correo electrónico.

## 📋 Requisitos Previos

- Cuenta de EmailJS (ya la tienes en https://dashboard.emailjs.com)
- Service ID de Gmail: `service_0eplwcm` (ya configurado)

---

## Paso 1: Obtener tu Public Key de EmailJS

1. Ve a: https://dashboard.emailjs.com/admin/account
2. En la sección **"API Keys"**, encontrarás tu **Public Key** (algo como `YOUR_PUBLIC_KEY_HERE`)
3. **Copia** este valor, lo necesitarás más adelante

---

## Paso 2: Configurar Template 1 - Notificación al Programador

### 2.1 Crear el Template

1. Ve a: https://dashboard.emailjs.com/admin/templates
2. Haz clic en **"Create New Template"**
3. Dale un nombre: `Nueva Solicitud de Asesoría`

### 2.2 Configurar Email Settings

En la pestaña **"Settings"**:

- **From Name:** `PortafolioWeb`
- **From Email:** Tu email verificado en EmailJS
- **Reply To:** `{{user_email}}`
- **To Email:** `{{to_email}}`

### 2.3 Configurar Subject

```
🔔 Nueva Solicitud de Asesoría
```

### 2.4 Configurar Content (HTML)

Pega este contenido en el editor HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .info-box {
            background: white;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #667eea;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Nueva Solicitud de Asesoría</h1>
        </div>
        <div class="content">
            <p>Hola <strong>{{programmer_name}}</strong>,</p>

            <p>Has recibido una nueva solicitud de asesoría:</p>

            <div class="info-box">
                <p><span class="label">👤 Solicitante:</span> {{user_name}}</p>
                <p><span class="label">📧 Email:</span> {{user_email}}</p>
                <p><span class="label">📅 Fecha:</span> {{advisory_date}}</p>
                <p><span class="label">⏰ Hora:</span> {{advisory_time}}</p>
                <p><span class="label">💬 Comentario:</span><br>{{advisory_comment}}</p>
            </div>

            <p>Por favor, ingresa a tu dashboard para aprobar o rechazar esta solicitud.</p>

            <a href="{{dashboard_link}}" class="button">Ir al Dashboard</a>

            <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Este es un mensaje automático, por favor no respondas a este correo.
            </p>
        </div>
    </div>
</body>
</html>
```

### 2.5 Guardar y Copiar Template ID

1. Haz clic en **"Save"**
2. **Copia** el **Template ID** que aparece arriba (algo como `template_abc123`)
3. Guárdalo en un lugar seguro

---

## Paso 3: Configurar Template 2 - Respuesta al Usuario

### 3.1 Crear el Template

1. Haz clic en **"Create New Template"** otra vez
2. Dale un nombre: `Respuesta a Solicitud de Asesoría`

### 3.2 Configurar Email Settings

En la pestaña **"Settings"**:

- **From Name:** `PortafolioWeb`
- **From Email:** Tu email verificado en EmailJS
- **Reply To:** `{{programmer_email}}`
- **To Email:** `{{to_email}}`

### 3.3 Configurar Subject

```
{{status_emoji}} {{status_text}} - Tu Solicitud de Asesoría
```

### 3.4 Configurar Content (HTML)

Pega este contenido en el editor HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header-approved {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .header-rejected {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .info-box {
            background: white;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #667eea;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            color: white;
            border-radius: 20px;
            font-weight: bold;
        }
        .badge-approved {
            background: #10b981;
        }
        .badge-rejected {
            background: #ef4444;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header {{#if status_approved}}header-approved{{else}}header-rejected{{/if}}">
            <h1>{{status_emoji}} {{status_text}}</h1>
        </div>
        <div class="content">
            <p>Hola <strong>{{user_name}}</strong>,</p>

            <p>Tu solicitud de asesoría ha sido <span class="status-badge {{#if status_approved}}badge-approved{{else}}badge-rejected{{/if}}">{{status_text}}</span></p>

            <div class="info-box">
                <p><span class="label">👨‍💻 Programador:</span> {{programmer_name}}</p>
                <p><span class="label">📅 Fecha:</span> {{advisory_date}}</p>
                <p><span class="label">⏰ Hora:</span> {{advisory_time}}</p>
                {{#if rejection_reason}}
                <p><span class="label">📝 Motivo:</span><br>{{rejection_reason}}</p>
                {{/if}}
            </div>

            {{#if status_approved}}
            <p>🎉 ¡Excelente! Tu asesoría ha sido confirmada. Te esperamos en la fecha y hora indicadas.</p>
            <p><strong>Importante:</strong> Si necesitas reprogramar o cancelar, por favor contacta lo antes posible.</p>
            {{else}}
            <p>Lamentablemente, tu solicitud no pudo ser aceptada en esta ocasión. Puedes intentar agendar en otro horario disponible.</p>
            {{/if}}

            <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Si tienes alguna pregunta, puedes responder a este correo.
            </p>
        </div>
    </div>
</body>
</html>
```

### 3.5 Guardar y Copiar Template ID

1. Haz clic en **"Save"**
2. **Copia** el **Template ID** (algo como `template_xyz789`)
3. Guárdalo en un lugar seguro

---

## Paso 4: Configurar las Claves en el Código

Ahora necesitas actualizar el archivo `email.service.ts` con tus claves:

1. Abre el archivo: `src/app/core/services/email.service.ts`

2. Encuentra estas líneas al inicio:

```typescript
private readonly PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI';
private readonly SERVICE_ID = 'service_0eplwcm';
private readonly TEMPLATE_NEW_ADVISORY = 'TEMPLATE_ID_SOLICITUD';
private readonly TEMPLATE_ADVISORY_RESPONSE = 'TEMPLATE_ID_RESPUESTA';
```

3. **Reemplaza** los valores con los que copiaste:

```typescript
private readonly PUBLIC_KEY = 'tu_public_key_de_paso_1';  // Del Paso 1
private readonly SERVICE_ID = 'service_0eplwcm';  // Ya está correcto
private readonly TEMPLATE_NEW_ADVISORY = 'template_id_del_paso_2';  // Template 1
private readonly TEMPLATE_ADVISORY_RESPONSE = 'template_id_del_paso_3';  // Template 2
```

### Ejemplo con valores reales:

```typescript
private readonly PUBLIC_KEY = 'TBqG9xK3jL2pF5mN8';
private readonly SERVICE_ID = 'service_0eplwcm';
private readonly TEMPLATE_NEW_ADVISORY = 'template_xoqq0bc';
private readonly TEMPLATE_ADVISORY_RESPONSE = 'template_abc123xyz';
```

4. **Guarda** el archivo

---

## Paso 5: Verificar la Configuración

### 5.1 Probar Template 1 (Notificación al Programador)

1. En EmailJS, ve al template "Nueva Solicitud de Asesoría"
2. Haz clic en **"Test It"**
3. Completa los campos de prueba:
   - `programmer_name`: Tu Nombre
   - `to_email`: tu-email@example.com
   - `user_name`: Usuario de Prueba
   - `user_email`: usuario@test.com
   - `advisory_date`: 15 de enero de 2025
   - `advisory_time`: 10:00
   - `advisory_comment`: Necesito ayuda con Angular
   - `dashboard_link`: http://localhost:4200/programmer-dashboard

4. Haz clic en **"Send Test Email"**
5. Revisa tu bandeja de entrada

### 5.2 Probar Template 2 (Respuesta al Usuario)

1. En EmailJS, ve al template "Respuesta a Solicitud de Asesoría"
2. Haz clic en **"Test It"**
3. Completa los campos de prueba:
   - `to_email`: tu-email@example.com
   - `user_name`: Tu Nombre
   - `programmer_name`: Programador de Prueba
   - `programmer_email`: programador@test.com
   - `advisory_date`: 15 de enero de 2025
   - `advisory_time`: 10:00
   - `status_text`: APROBADA
   - `status_emoji`: ✅
   - `status_approved`: true
   - `header_color`: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
   - `border_color`: #667eea
   - `badge_color`: #10b981
   - `rejection_reason`: (dejar vacío)

4. Haz clic en **"Send Test Email"**
5. Revisa tu bandeja de entrada

---

## Paso 6: Probar en la Aplicación

### 6.1 Compilar el Proyecto

```bash
npm run build
```

Si hay errores, revísalos y corrígelos.

### 6.2 Iniciar el Servidor de Desarrollo

```bash
ng serve
```

### 6.3 Probar el Flujo Completo

**Prueba 1: Usuario agenda asesoría**

1. Inicia sesión como **Usuario** (no programador)
2. Haz clic en "Agendar Asesoría"
3. Selecciona un programador
4. Elige fecha y hora
5. Agrega un comentario
6. Haz clic en "Enviar Solicitud"
7. **Verifica** que el programador reciba un email

**Prueba 2: Programador aprueba asesoría**

1. Inicia sesión como **Programador**
2. Ve al dashboard de programador
3. Busca la asesoría pendiente
4. Haz clic en "Aprobar"
5. **Verifica** que el usuario reciba un email de aprobación

**Prueba 3: Programador rechaza asesoría**

1. Inicia sesión como **Programador**
2. Ve al dashboard de programador
3. Busca una asesoría pendiente
4. Escribe un motivo de rechazo
5. Haz clic en "Rechazar"
6. **Verifica** que el usuario reciba un email de rechazo

---

## 🔍 Troubleshooting (Solución de Problemas)

### Problema: No llegan los emails

**Solución 1:** Verifica la consola del navegador (F12)
- Busca mensajes de error que empiecen con "❌ Error al enviar email"
- Si ves errores de CORS o API Key, revisa que las claves sean correctas

**Solución 2:** Verifica en EmailJS
- Ve a https://dashboard.emailjs.com/admin/history
- Aquí verás el historial de emails enviados
- Si no aparece nada, el problema está en el código
- Si aparece pero con error, el problema está en la configuración del template

**Solución 3:** Revisa la carpeta de SPAM
- A veces los emails llegan a spam
- Marca como "No es spam" para futuros emails

**Solución 4:** Verifica las claves
- Abre `email.service.ts`
- Asegúrate de que las 4 claves estén correctas:
  - PUBLIC_KEY
  - SERVICE_ID
  - TEMPLATE_NEW_ADVISORY
  - TEMPLATE_ADVISORY_RESPONSE

### Problema: Los emails llegan sin formato

**Solución:** Verifica el contenido HTML
- En EmailJS, asegúrate de que el contenido esté en formato HTML (no texto plano)
- Revisa que no haya errores en el HTML

### Problema: Faltan variables en el email

**Solución:** Verifica los nombres de variables
- En EmailJS, los nombres deben coincidir exactamente con los del código
- Ejemplo: `{{programmer_name}}` en el template debe recibir `programmer_name` desde el código

---

## 📊 Variables Disponibles

### Template 1 (Nueva Solicitud)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `programmer_name` | Nombre del programador | "Alexander Chuquipoma" |
| `to_email` | Email del programador | "programador@example.com" |
| `user_name` | Nombre del usuario | "Juan Pérez" |
| `user_email` | Email del usuario | "usuario@example.com" |
| `advisory_date` | Fecha formateada | "lunes, 15 de enero de 2025" |
| `advisory_time` | Hora | "10:00" |
| `advisory_comment` | Comentario del usuario | "Necesito ayuda con Angular" |
| `dashboard_link` | Link al dashboard | "http://localhost:4200/programmer-dashboard" |

### Template 2 (Respuesta)

| Variable | Descripción | Ejemplo (Aprobada) | Ejemplo (Rechazada) |
|----------|-------------|-------------------|---------------------|
| `to_email` | Email del usuario | "usuario@example.com" | "usuario@example.com" |
| `user_name` | Nombre del usuario | "Juan Pérez" | "Juan Pérez" |
| `programmer_name` | Nombre del programador | "Alexander Chuquipoma" | "Alexander Chuquipoma" |
| `programmer_email` | Email del programador | "programador@example.com" | "programador@example.com" |
| `advisory_date` | Fecha formateada | "lunes, 15 de enero de 2025" | "lunes, 15 de enero de 2025" |
| `advisory_time` | Hora | "10:00" | "10:00" |
| `status_text` | Texto del estado | "APROBADA" | "RECHAZADA" |
| `status_emoji` | Emoji del estado | "✅" | "❌" |
| `status_approved` | Boolean aprobada | `true` | `false` |
| `header_color` | Color del header | gradient purple | gradient red |
| `border_color` | Color del borde | "#667eea" | "#f5576c" |
| `badge_color` | Color del badge | "#10b981" (verde) | "#ef4444" (rojo) |
| `rejection_reason` | Motivo de rechazo | "" (vacío) | "Horario no disponible" |

---

## ✅ Checklist Final

Antes de dar por terminada la configuración, verifica:

- [ ] Obtuve mi Public Key de EmailJS
- [ ] Creé el Template 1 (Nueva Solicitud)
- [ ] Creé el Template 2 (Respuesta)
- [ ] Copié los 2 Template IDs
- [ ] Actualicé el archivo `email.service.ts` con las 4 claves
- [ ] Probé el Template 1 desde EmailJS
- [ ] Probé el Template 2 desde EmailJS
- [ ] Compilé el proyecto sin errores
- [ ] Probé agendar una asesoría y recibí el email
- [ ] Probé aprobar una asesoría y recibí el email
- [ ] Probé rechazar una asesoría y recibí el email

---

## 🎉 ¡Listo!

Si completaste todos los pasos y el checklist, tu sistema de notificaciones por email está funcionando correctamente.

### Siguientes Pasos

- Puedes personalizar los templates desde EmailJS
- Puedes agregar más variables si lo necesitas
- Puedes cambiar los colores y estilos del email

### Soporte

Si tienes problemas, revisa:
- La consola del navegador (F12)
- El historial de EmailJS: https://dashboard.emailjs.com/admin/history
- Los logs en la consola de tu aplicación

¡Disfruta de tu sistema de notificaciones! 📧✨
