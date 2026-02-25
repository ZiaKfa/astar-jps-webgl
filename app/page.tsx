/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: any) => Promise<any>
  }
}

export default function UnityResearchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleLoad = () => {
    if (!canvasRef.current || !window.createUnityInstance) return

    window.createUnityInstance(canvasRef.current, {
      dataUrl: '/Build/BuildWeb.data',
      frameworkUrl: '/Build/BuildWeb.framework.js',
      codeUrl: '/Build/BuildWeb.wasm',
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'Research Project',
      productName: 'A* vs JPS Benchmark',
      productVersion: '1.0',
      matchWebGLToCanvasSize: true,
      devicePixelRatio: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">

      {/* Load Unity */}
      <Script
        src="/Build/BuildWeb.loader.js"
        strategy="afterInteractive"
        onLoad={handleLoad}
      />

      {/* Header */}
      <header className="py-8 text-center border-b border-gray-800">
        <h1 className="text-3xl font-bold">
          Optimalisasi Algoritma Pathfinding A* dengan Jump Point Search
        </h1>
        <p className="mt-2 text-gray-400">
          Implementasi dan Benchmark pada Game 2D Grid-Based Movement
        </p>
      </header>
        <section className="flex justify-center">
          <div className="w-[800px] bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            
            <div className="bg-gray-900 px-4 py-2 text-sm text-gray-300">
              Interactive Benchmark Environment
            </div>

            <div className="w-full h-[600px]">
              <canvas
                id="unity-canvas"
                ref={canvasRef}
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Penjelasan Penelitian */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tentang Penelitian</h2>
          <p className="text-gray-400 leading-relaxed">
            Penelitian ini bertujuan untuk membandingkan performa algoritma 
            <strong> A* </strong> dan 
            <strong> A* dengan Jump Point Search (JPS) </strong> 
            pada lingkungan game berbasis grid movement. 
            Evaluasi dilakukan berdasarkan metrik completeness, optimality, 
            time complexity, dan space complexity.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Game ini berfungsi sebagai media benchmarking untuk menguji 
            efisiensi algoritma dalam kondisi peta berbeda: open map, 
            structured map, dan obstacle-dense map.
          </p>
        </section>

        {/* Penjelasan Gameplay */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Gameplay Singkat</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Game 2D top-down action survival berbasis grid.</li>
            <li>Player bergerak otomatis mengikuti path hasil klik.</li>
            <li>Musuh mengejar player menggunakan algoritma pathfinding.</li>
            <li>Perbandingan algoritma dapat dianalisis melalui performa pergerakan musuh.</li>
          </ul>
        </section>

        {/* Game Window */}


      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 border-t border-gray-800">
        © 2026 Research Project – Pathfinding Optimization Study
      </footer>
    </div>
  )
}