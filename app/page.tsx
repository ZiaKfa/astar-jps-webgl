'use client'

import { useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createUnityInstance: (canvas: HTMLCanvasElement, config: any, progressCallback: (progress: number) => void) => Promise<void>
  }
}

export default function UnityResearchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    if (!canvasRef.current || !window.createUnityInstance) return

    window.createUnityInstance(
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
        devicePixelRatio: 1,
      },
      (progressValue: number) => {
        setProgress(progressValue)
      }
    ).then(() => {
      setIsLoaded(true)
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">

      <Script
        src="/Build/BuildWeb.loader.js"
        strategy="afterInteractive"
        onLoad={handleLoad}
      />

      <div className="w-[800px] h-[600px] relative bg-black rounded-xl overflow-hidden shadow-2xl">

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
            <p className="mb-4 text-sm text-gray-400">
              Loading Simulation...
            </p>

            <div className="w-64 h-3 bg-gray-700 rounded">
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
  )
}