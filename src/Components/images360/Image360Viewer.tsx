
"use client"

import { useEffect, useRef } from "react"
import { Viewer } from "photo-sphere-viewer"
import "photo-sphere-viewer/dist/photo-sphere-viewer.css"

export default function PhotoSphereViewerContainer({ 
  imageUrl, 
  width = "100%", 
  height = "100%",
  className = "" 
}: { 
  imageUrl: string
  width?: string
  height?: string
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (containerRef.current && imageUrl) {
      // Destruir el viewer anterior si existe
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }

      try {
        // Crear nuevo viewer
        viewerRef.current = new Viewer({
          container: containerRef.current,
          panorama: imageUrl,
          navbar: [
            "zoom",
            "move",
            "fullscreen"
          ],
          size: {
            width: Number(width),
           height: Number(height)
          },
          // Configuraciones adicionales para mejor rendimiento
          loadingImg: undefined,
          loadingTxt: "Cargando imagen 360°...",
          useXmpData: false,
          fisheye: false,
          mousewheel: true,
          mousemove: true,
          captureCursor: false
        })

        console.log("✅ Viewer 360° creado exitosamente para:", imageUrl)
      } catch (error) {
        console.error("❌ Error creando PhotoSphere viewer:", error)
      }
    }

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy()
          viewerRef.current = null
        } catch (error) {
          console.warn("⚠️ Error destroying viewer:", error)
        }
      }
    }
  }, [imageUrl, width, height])

  // Si no hay imagen, mostrar placeholder
  if (!imageUrl) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <p className="text-gray-500 text-sm">No hay imagen 360° disponible</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ width, height }}
    />
  )
}