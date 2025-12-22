import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactFormContent() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: 'Limpieza de Casas / Deptos',
        details: ''
    });

    const services = [
        'Limpieza de Casas / Deptos',
        'Limpieza de Oficinas',
        'Alfombras y Tapices',
        'Reparación Línea Blanca',
        'Otro'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!executeRecaptcha) {
                console.error("Execute recaptcha not yet available");
                return;
            }

            const token = await executeRecaptcha('submit_form');

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, token }),
            });

            const result = await response.json();

            if (response.ok) {
                // Redirect to Thank You Page for Conversion Tracking
                window.location.href = '/gracias';
            } else {
                alert(result.message || "Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Error de conexión. Revisa tu internet e intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nombre</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder-gray-400 text-gray-800"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Teléfono</label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder-gray-400 text-gray-800"
                        placeholder="+56 9..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Correo Electrónico</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder-gray-400 text-gray-800"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Servicio de Interés</label>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all appearance-none text-gray-800 cursor-pointer"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                        {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Detalles / Comuna</label>
                <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder-gray-400 text-gray-800 h-24 resize-none"
                    placeholder="Cuéntanos qué necesitas y dónde..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-4 rounded-xl text-white shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-dark'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i> Enviando...
                    </>
                ) : (
                    <>
                        ENVIAR COTIZACIÓN <i className="fas fa-paper-plane"></i>
                    </>
                )}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2 leading-tight">
                Este sitio está protegido por reCAPTCHA y se aplican la
                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline hover:text-brand-blue"> Política de Privacidad</a> y
                <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline hover:text-brand-blue"> Términos de Servicio</a> de Google.
            </p>
        </form>
    );
}

export default function ContactForm() {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY_HERE"}>
            <ContactFormContent />
        </GoogleReCaptchaProvider>
    );
}
