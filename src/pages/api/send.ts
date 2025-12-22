import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // Force server-side rendering for this endpoint

export const POST: APIRoute = async ({ request }) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY);

    const body = await request.json();
    const { name, email, phone, service, details, token } = body;

    // Basic Validation
    if (!name || !phone || !email || !service) {
      return new Response(
        JSON.stringify({ message: 'Todos los campos marcados son obligatorios.' }),
        { status: 400 }
      );
    }

    // reCAPTCHA Verification
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || import.meta.env.RECAPTCHA_SECRET_KEY;

    if (recaptchaSecret && token) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`;
      const recaptchaResponse = await fetch(verifyUrl, { method: 'POST' });
      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        console.warn('reCAPTCHA failed:', recaptchaData);
        if (!recaptchaData.success) {
          return new Response(JSON.stringify({ message: 'Error de verificación de seguridad (reCAPTCHA).' }), { status: 400 });
        }
      }
    } else {
      console.warn("RECAPTCHA_SECRET_KEY is missing or token not provided.");
    }

    // Send Email via Resend
    // Important: 'onboarding@resend.dev' allows sending ONLY to the verified email in your Resend account (usually the one you signed up with).
    // To send to any email or use a custom 'from', you must verify a domain in Resend Dashboard.
    const { data, error } = await resend.emails.send({
      from: 'ClearHome Web <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'contacto@clearhome.cl'],
      replyTo: email,
      subject: `✨ Nuevo Lead ClearHome: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #003b6f; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">¡Nueva Cotización Recibida!</h1>
          </div>
          
          <div style="padding: 24px; background-color: #ffffff;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hola, has recibido una nueva solicitud de contacto desde el sitio web <strong>clearhome.cl</strong>.
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;"><strong>Nombre:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Teléfono:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Servicio:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${service}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Mensaje:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; line-height: 1.5;">${details || 'Sin detalles adicionales'}</td>
                </tr>
              </table>
            </div>
            
            <p style="margin-top: 24px; font-size: 14px; color: #64748b; text-align: center;">
              Responde a este correo directamente para contactar al cliente.
            </p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} ClearHome Servicios. Todos los derechos reservados.
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ message: 'Error al enviar el correo con Resend.', debug: error }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Mensaje enviado con éxito', id: data?.id }), { status: 200 });

  } catch (error: any) {
    console.error('Server Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      message: 'Error interno del servidor.',
      debug: errorMessage
    }), { status: 500 });
  }
};
