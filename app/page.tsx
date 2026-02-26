/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import Image from 'next/image'

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
                    This game runs best in landscape mode.
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

      <section className="mt-10 px-4 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tentang Penelitian</h2>
          <p className="text-gray-400 leading-relaxed text-justify">
        Penelitian ini bertujuan untuk membandingkan performa algoritma 
        <strong> A* </strong> dan 
        <strong> A* dengan Jump Point Search (JPS) </strong> 
        pada lingkungan game berbasis grid movement. 
        Evaluasi dilakukan berdasarkan metrik completeness, optimality, 
        time complexity, dan space complexity.
          </p>
          <p className="text-gray-400 leading-relaxed text-justify">
        Game ini berfungsi sebagai media benchmarking untuk menguji 
        efisiensi algoritma dalam kondisi peta berbeda
          </p>
        <p>Link Kuisioner Beta Testing :</p>
        <a href="https://forms.gle/gefJXzmMr3SUZ3LHA" target="_blank" className="text-blue-400 hover:underline">Klik Disini!</a>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Apa itu Algoritma A* ?</h2>
          <p className="text-gray-400 leading-relaxed text-justify">
        Algoritma A* adalah algoritma pencarian yang digunakan untuk menemukan 
        jalur terpendek antara dua titik dalam sebuah graf. A* menggunakan 
        fungsi heuristik untuk memperkirakan biaya dari titik saat ini ke tujuan, 
        sehingga dapat mengarahkan pencarian secara lebih efisien dibandingkan 
        algoritma pencarian lainnya.
          </p>
          <Image src="/astar.webp" alt="Visualisasi Algoritma A*" width={500} height={400} className="w-full max-w-md mx-auto mt-4 rounded-lg shadow-lg" />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Apa itu Algoritma A* dengan Jump Point Search (JPS) ?</h2>
          <p className="text-gray-400 leading-relaxed text-justify">
        Algoritma A* dengan Jump Point Search (JPS) adalah versi optimasi dari algoritma A* yang dirancang untuk meningkatkan efisiensi pencarian jalur dalam
         peta berbasis grid. JPS mengurangi jumlah node yang perlu diproses dengan memanfaatkan struktur grid untuk &quot;melompat&quot; langsung ke titik-titik penting, 
         sehingga menghindari eksplorasi node-node yang tidak perlu. Hasilnya, JPS dapat secara signifikan mempercepat pencarian jalur dibandingkan dengan A* standar, 
         terutama pada peta yang memiliki banyak ruang terbuka.
        
          </p>
          <Image src="/jps.webp" alt="Visualisasi Algoritma A*" width={500} height={400} className="w-full max-w-md mx-auto mt-4 rounded-lg shadow-lg" />
        </div>
                <div className="space-y-4">
          <h2 className="text-xl font-semibold">Perbandingan</h2>
          <p className="text-gray-400 leading-relaxed text-justify">
          Berikut ini adalah visualisasi perbandingan antara algoritma A* standar dan A* dengan Jump Point Search (JPS) dalam lingkungan game berbasis grid.
          Pada gambar pertama, kita dapat melihat jalur yang dihasilkan oleh algoritma A* standar. Algoritma ini mengeksplorasi lebih banyak node di sekitar jalur optimal,
          Sedangkan pada gambar kedua, kita dapat melihat jalur yang dihasilkan oleh algoritma A* dengan JPS. Algoritma ini mengeksplorasi lebih sedikit node karena menggunakan 
          teknik jump point search untuk menghindari eksplorasi node-node yang tidak perlu.
          </p>         
          <Image src="/vs.jpg" alt="Visualisasi Algoritma A*" width={500} height={400} className="w-full max-w-md mx-auto mt-4 rounded-lg shadow-lg" />
        </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Tutorial Penggunaan Halaman Benchmark
        </h2>

        <p className="text-gray-400 leading-relaxed text-justify">
          Halaman benchmark digunakan untuk melakukan pengujian performa serta
          visualisasi algoritma pathfinding <b>A*</b> dan{" "}
          <b>A* dengan Jump Point Search (JPS)</b> pada peta berbasis grid.
        </p>

        <Image
          src="/tutor.png"
          alt="Tutorial Halaman Benchmark"
          width={500}
          height={400}
          className="w-full max-w-md mx-auto mt-4 rounded-lg shadow-lg"
        />

        {/* 1 */}
        <h3 className="text-lg font-semibold mt-4">
          Memilih Map Benchmark
        </h3>
        <ol className="list-decimal pl-6 text-gray-400 space-y-1 text-justify">
          <li>
            Pada panel benchmark di sebelah kiri layar, pilih map yang ingin
            digunakan melalui <b>dropdown pilihan map</b>.
          </li>
          <li>
            Setelah memilih map, tekan tombol <b>Render Map</b> untuk menampilkan
            peta pada area utama.
          </li>
        </ol>

        {/* 2 */}
        <h3 className="text-lg font-semibold mt-4">
          Menentukan Titik Start dan Goal
        </h3>
        <ol className="list-decimal pl-6 text-gray-400 space-y-1 text-justify">
          <li>
            Masukkan koordinat posisi awal pada bagian <b>Start (X, Y)</b>.
          </li>
          <li>
            Masukkan koordinat tujuan pada bagian <b>Goal (X, Y)</b>.
          </li>
          <li>
            Pastikan koordinat berada pada area yang dapat dilalui (walkable).
          </li>
        </ol>

        {/* 3 */}
        <h3 className="text-lg font-semibold mt-4">
          Menjalankan Benchmark Algoritma
        </h3>
        <ol className="list-decimal pl-6 text-gray-400 space-y-1 text-justify">
          <li>
            Tekan tombol <b>Benchmark Map</b> untuk menjalankan proses benchmark.
          </li>
          <li>
            Sistem akan menjalankan pengujian algoritma A* dan A* dengan JPS secara berurutan pada map yang telah dipilih.
          </li>
            <li>
            Selama proses berlangsung, progres benchmark dapat dilihat pada{" "}
            <b>panel loading progress</b> di bagian tengah layar. 
            (<b>Hati-hati, proses benchmark pada map yang kompleks dapat memakan waktu yang lama, 
            hanya lakukan pada map arena yang sederhana untuk hasil yang lebih cepat)</b>
            </li>
          <li>
            Setelah selesai, hasil benchmark akan ditampilkan pada{" "}
            <b>panel hasil benchmark</b> di bagian bawah layar.
          </li>
        </ol>

        {/* 4 */}
        <h3 className="text-lg font-semibold mt-4">
          Visualisasi Algoritma Pathfinding
        </h3>
        <p className="text-gray-400 text-justify">
          Untuk melihat proses pencarian jalur secara visual:
        </p>
        <ol className="list-decimal pl-6 text-gray-400 space-y-1 text-justify">
          <li>
            Tekan tombol <b>Render AStar</b> untuk menampilkan visualisasi
            algoritma A*.
          </li>
          <li>
            Tekan tombol <b>Render JPS</b> untuk menampilkan visualisasi algoritma
            A* dengan Jump Point Search.
          </li>
          <li>
            Jalur hasil pencarian akan divisualisasikan langsung pada map.
          </li>
        </ol>

        {/* 5 */}
        <h3 className="text-lg font-semibold mt-4">
          Menghapus Jalur Visualisasi
        </h3>
        <ul className="list-disc pl-6 text-gray-400 text-justify">
          <li>
            Gunakan tombol <b>Clear Path</b> untuk menghapus jalur yang telah
            divisualisasikan sebelum melakukan percobaan berikutnya.
          </li>
        </ul>

        {/* 6 */}
        <h3 className="text-lg font-semibold mt-4">
          Kembali ke Menu Utama
        </h3>
        <ul className="list-disc pl-6 text-gray-400 text-justify">
          <li>
            Tekan tombol <b>Main Menu</b> di pojok kanan atas layar untuk kembali
            ke halaman utama aplikasi.
          </li>
        </ul>

        <hr className="border-gray-700 my-4" />

        <p className="text-gray-400 leading-relaxed text-justify">
          Halaman benchmark ini memungkinkan pengguna untuk membandingkan
          performa serta memahami perbedaan proses pencarian jalur antara
          algoritma A* dan A* dengan Jump Point Search melalui pengujian dan
          visualisasi secara langsung.
        </p>
      </div>
      </section>
      <footer className="text-center text-gray-600 py-6 border-t border-gray-800 text-sm mt-10">
        © 2026 Pathfinding Optimization Research
      </footer>
    </div>
  )
}