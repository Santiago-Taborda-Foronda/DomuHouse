import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';

export const RateAgentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleStarClick = useCallback((starIndex) => {
    setRating(starIndex + 1);
  }, []);

  const handleStarHover = useCallback((starIndex) => {
    setHoveredRating(starIndex + 1);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    setIsOpen(false);
    // Aquí puedes agregar la lógica para enviar la calificación
  }, [rating, comment]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const ratingText = useMemo(() => {
    switch(rating) {
      case 1: return "Muy malo";
      case 2: return "Malo";
      case 3: return "Regular";
      case 4: return "Bueno";
      case 5: return "Excelente";
      default: return "";
    }
  }, [rating]);

  const stars = useMemo(() => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarHover(i)}
        className="transition-transform hover:scale-110 focus:outline-none"
        type="button"
      >
        <Star 
          className={`w-8 h-8 transition-colors ${
            i < (hoveredRating || rating)
              ? 'text-[#2F8EAC] fill-[#2F8EAC]'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  }, [rating, hoveredRating, handleStarClick, handleStarHover]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full mt-4 bg-[#2F8EAC] text-white py-3 rounded-lg hover:bg-[#287b93] transition-all duration-200 font-medium"
        type="button"
      >
        Calificar Agente
      </button>
      
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-80"
          onClick={handleBackdropClick}
        >
          <div className="bg-white w-full max-w-md mx-4 p-8 rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Calificar Agente</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-sm text-center mb-6">
              Tu calificación es importante para nosotros.
            </p>

            {/* Stars */}
            <div 
              className="flex justify-center gap-1 my-6"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {stars}
            </div>

            {/* Rating text */}
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mb-4">
                {ratingText}
              </p>
            )}

            {/* Comment textarea */}
            <div className="mb-6">
              <textarea
                rows={4}
                value={comment}
                onChange={handleCommentChange}
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2F8EAC] focus:border-transparent"
                placeholder="Agrega un comentario (opcional)"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 border border-[#2F8EAC] text-[#2F8EAC] rounded-lg hover:bg-[#e6f3f6] transition-colors"
                onClick={handleClose}
                type="button"
              >
                Cancelar
              </button>
              <button 
                className="px-6 py-2 bg-[#2F8EAC] text-white rounded-lg hover:bg-[#287b93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={rating === 0}
                type="button"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default RateAgentModal;