# ClearHome Web

Landing page de alta conversión desarrollada para servicios de limpieza profesional. Proyecto construido con **Astro** y **React**, optimizado para SEO, rendimiento y captación de leads mediante Google Ads.

## Stack Tecnológico

*   **Core**: [Astro 5.0](https://astro.build) (Rendering híbrido / SSG + SSR).
*   **UI/Componentes**: React, Tailwind CSS 3.4.
*   **Animaciones**: CSS Nativo, FontAwesome.
*   **Backend/API**: Astro Server Endpoints (SSR) ejecutándose en Vercel Serverless Functions.
*   **Email**: Integración con [Resend](https://resend.com) para envío transaccional.
*   **Seguridad**: Google reCAPTCHA v3 (Invisible).
*   **Infraestructura**: Vercel (Frontend/Edge) + hosting externo para correo corporativo.

## Estructura del Proyecto

```text
/
├── src/
│   ├── components/    # Componentes UI (React islands & Astro components)
│   ├── layouts/       # Layout principal (Head, SEO, Global CSS)
│   ├── pages/
│   │   ├── api/       # Endpoints del servidor (send.ts)
│   │   └── index.astro
│   └── env.d.ts       # Definiciones de tipos
├── public/            # Assets estáticos
├── astro.config.mjs   # Configuración de Astro + Vercel Adapter
└── tailwind.config.mjs
```

## Instalación y Desarrollo Local

1.  **Clonar repositorio**:
    ```bash
    git clone https://github.com/srwebcl/clearhome.cl.git
    cd clearhome.cl
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crear un archivo `.env` en la raíz basado en el siguiente esquema:
    ```bash
    # Resend API (Emails transaccionales)
    RESEND_API_KEY=re_123456...
    CONTACT_EMAIL=contacto@clearhome.cl

    # Google reCAPTCHA v3
    PUBLIC_RECAPTCHA_SITE_KEY=6Ld...
    RECAPTCHA_SECRET_KEY=6Ld...
    ```

4.  **Ejecutar entorno de desarrollo**:
    ```bash
    npm run dev
    ```
    El sitio estará disponible en `http://localhost:4321`.

## Despliegue en Vercel

El proyecto está configurado para desplegarse automáticamente en Vercel.

1.  Conectar el repositorio de GitHub a Vercel.
2.  En la configuración del proyecto en Vercel, ir a **Settings > Environment Variables**.
3.  Añadir las mismas variables definidas en el punto 3 de desarrollo local.
4.  El `vercel.json` y `astro.config.mjs` ya incluyen la configuración necesaria para el adaptador `serverless`.

## Notas de Configuración DNS

Para mantener el correo corporativo (cPanel) funcionando mientras se aloja la web en Vercel:

*   **Dominio (A Record)**: Apuntar a `76.76.21.21` (Vercel).
*   **Correo (MX Record)**: Apuntar al servidor de hosting original (NO a Vercel).
*   **SPF/DKIM**: Configurar en cPanel los registros TXT proporcionados por Resend para el subdominio de notificaciones (ej: `notificaciones.clearhome.cl`) para evitar Spam.

---
Desarrollado por [srwebcl](https://github.com/srwebcl).
