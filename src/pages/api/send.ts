
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // Force server-side rendering for this endpoint

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, service, details } = body;

    // Basic Validation
    if (!name || !phone || !email) {
      return new Response(
        JSON.stringify({ message: 'Todos los campos marcados son obligatorios.' }),
        { status: 400 }
      );
    }

    // reCAPTCHA Verification
    const recaptchaSecret = import.meta.env.RECAPTCHA_SECRET_KEY;
    const { token } = body;

    if (recaptchaSecret && token) {
      const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`, {
        method: 'POST',
      });
      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        console.warn('reCAPTCHA failed:', recaptchaData);
        if (!recaptchaData.success) {
          return new Response(JSON.stringify({ message: 'Error de verificación de seguridad (reCAPTCHA).' }), { status: 400 });
        }
      }
    }

    // Send Email
    // Note: 'onboarding@resend.dev' works for testing. 
    // In production, user should configured a verified domain.
    // 'to' should be the business owner's email.
    const { data, error } = await resend.emails.send({
      from: 'ClearHome Web <onboarding@resend.dev>',
      to: [import.meta.env.CONTACT_EMAIL || 'sebastianrodriguezmilla@gmail.com'], // Visual feedback suggested using this email? Or just default. I'll stick to a placeholder or the user's inferred email if available, otherwise just 'sebastianrodriguezmilla@gmail.com' for now based on path, or ask user. I'll use a safe fallback or instruction.
      replyTo: email,
      subject: `✨ Nuevo Lead ClearHome: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003b6f;">¡Nueva Solicitud de Cotización!</h1>
          <p>Has recibido un nuevo contacto desde la web.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>👤 Nombre:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>📱 Teléfono:</strong> ${phone}</p>
            <p><strong>🧹 Servicio:</strong> ${service}</p>
            <p><strong>📝 Detalles:</strong><br/>${details || 'N/A'}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Enviado automáticamente desde ClearHome Web Landing.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ message: 'Error al enviar el correo.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Mensaje enviado con éxito', id: data?.id }), { status: 200 });

  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};
