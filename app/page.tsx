/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState, useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any,
      onProgress?: (progress: number) => void
    ) => Promise<any>
    Module?: any
  }
}

export default function UnityResearchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const unityInstanceRef = useRef<any>(null)

  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const handleLoad = () => {
    if (!canvasRef.current || !window.createUnityInstance) return

    window.Module = {
      keyboardListeningElement: '#unity-canvas',
    }

    window
      .createUnityInstance(
        canvasRef.current,
        {
          dataUrl: '/Build/BuildWeb.data',
          frameworkUrl: '/Build/BuildWeb.framework.js',
          codeUrl: '/Build/BuildWeb.wasm',
          streamingAssetsUrl: 'StreamingAssets',
          companyName: 'Research Project',
          productName: 'A* vs JPS Benchmark',
          productVersion: '1.0',
          matchWebGLToCanvasSize: true,
          devicePixelRatio: isMobile ? 5 : window.devicePixelRatio,
        },
        (p: number) => setProgress(p)
      )
      .then((unityInstance) => {
        unityInstanceRef.current = unityInstance
        setIsLoaded(true)
      })
      .catch((err) => console.error(err))
  }

  const handleFullscreen = () => {
    if (!unityInstanceRef.current) return

    // 🔥 TRUE FULLSCREEN
    unityInstanceRef.current.SetFullscreen(1)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">

      <Script
        src="/Build/BuildWeb.loader.js"
        strategy="afterInteractive"
        onLoad={handleLoad}
      />

      <header className="py-6 text-center border-b border-gray-800">
        <h1 className="text-xl md:text-3xl font-bold">
          Optimalisasi Algoritma Pathfinding A* dengan Jump Point Search
        </h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base">
          Benchmark pada Game 2D Grid-Based Movement
        </p>
      </header>

      <section className="flex justify-center mt-6 px-4">
        <div
          className={`
            relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700
            ${isMobile ? 'w-[95%] max-w-[420px]' : 'w-[800px]'}
          `}
        >
          <div className="flex justify-between items-center bg-gray-900 px-4 py-2 text-sm text-gray-300">
            <span>Interactive Benchmark Environment</span>
            <button
              onClick={handleFullscreen}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
            >
              Fullscreen
            </button>
          </div>

          <div
            className={`
              relative
              ${isMobile ? 'w-full h-[400px]' : 'w-full h-[450px]'}
            `}
          >
            {isMobile && isPortrait && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black text-white text-center p-6">
                <div>
                  <p className="text-lg font-semibold mb-2">
                    Rotate Your Device
                  </p>
                  <p className="text-sm text-gray-400">
                    This simulation runs best in landscape mode.
                  </p>
                </div>
              </div>
            )}

            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                <p className="mb-4 text-sm text-gray-400">
                  Initializing WebGL Environment...
                </p>
                <div className="w-48 h-3 bg-gray-700 rounded">
                  <div
                    className="h-3 bg-blue-500 rounded transition-all duration-200"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {Math.round(progress * 100)}%
                </p>
              </div>
            )}

            <canvas
              id="unity-canvas"
              ref={canvasRef}
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      
      <footer className="text-center text-gray-600 py-6 border-t border-gray-800 text-sm mt-10">
        © 2026 Pathfinding Optimization Research
      </footer>
    </div>
  )
}