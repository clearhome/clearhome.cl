import React, { useState, useEffect } from 'react';

const REVIEWS = [
    {
        name: "María González",
        location: "La Serena",
        text: "¡Increíble servicio! Dejaron mi departamento impecable para la entrega. Muy puntuales y profesionales.",
        stars: 5
    },
    {
        name: "Carlos Tapia",
        location: "Coquimbo",
        text: "Llevo meses contratando la limpieza quincenal y no los cambio. Personal de total confianza.",
        stars: 5
    },
    {
        name: "Ana Pizarro",
        location: "Sindempart",
        text: "Me salvaron con una limpieza profunda post-remodelación. Quedó todo brillante. 100% recomendados.",
        stars: 5
    }
];

export default function ReviewCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % REVIEWS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-quote-right text-6xl text-brand-blue"></i>
            </div>

            <div className="relative min-h-[200px] flex items-center">
                {REVIEWS.map((review, index) => (
                    <div
                        key={index}
                        className={`absolute w-full transition-all duration-700 ease-in-out transform ${index === current ? 'opacity-100 translate-x-0' :
                                index < current ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10'
                            }`}
                    >
                        <div className="flex text-yellow-400 mb-3 gap-1">
                            {[...Array(review.stars)].map((_, i) => (
                                <i key={i} className="fas fa-star text-sm"></i>
                            ))}
                        </div>
                        <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">"{review.text}"</p>
                        <div>
                            <p className="font-bold text-brand-dark">{review.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <i className="fas fa-map-marker-alt text-xs"></i> {review.location}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-4 absolute bottom-4 left-0 w-full">
                {REVIEWS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === current ? 'bg-brand-blue w-6' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
