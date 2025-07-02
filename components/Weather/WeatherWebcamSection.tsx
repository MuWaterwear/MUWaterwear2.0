import { useState } from 'react'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import { WeatherDisplay } from '@/components/Weather/WeatherDisplay'

interface WeatherWebcamSectionProps {
  location: string // zip or query for weather API
  webcamSrc: string
  webcamTitle: string
  lakemonsterUrl?: string // URL for water temperature data
}

export default function WeatherWebcamSection({ location, webcamSrc, webcamTitle, lakemonsterUrl }: WeatherWebcamSectionProps) {
  const [activeTab, setActiveTab] = useState<'weather' | 'webcam'>('weather')

  return (
    <>
      {/* Desktop: show weather and webcam side by side */}
      <DesktopOnly>
        <div className="grid grid-cols-2 gap-8">
          <WeatherDisplay location={location} lakemonsterUrl={lakemonsterUrl} className="shadow-lg bg-slate-800 border-slate-700 self-start h-auto" />
          <div className="w-full h-full rounded-lg overflow-hidden">
            {/* Webcam Wrapper with 4:3 aspect ratio for better visibility */}
            <div className="w-full rounded-lg overflow-hidden relative pb-[75%]">{/* 4/3 */}
              {webcamSrc.match(/\.jpg|\.png|\.jpeg|\.gif|\.mjpg|\.mjpeg$/i) ? (
                <img
                  src={webcamSrc}
                  alt={webcamTitle}
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={webcamSrc}
                  title={webcamTitle}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  scrolling="no"
                  style={{ overflow: 'hidden' }}
                />
              )}
            </div>
          </div>
        </div>
      </DesktopOnly>

      {/* Mobile: tabbed interface */}
      <MobileOnly>
        <div>
          <div className="flex border-b border-gray-700 text-sm">
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'weather' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('weather')}
            >
              Weather
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'webcam' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('webcam')}
            >
              Webcam
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'weather' ? (
              <WeatherDisplay location={location} lakemonsterUrl={lakemonsterUrl} className="shadow-lg bg-slate-800 border-slate-700" />
            ) : (
              <div className="w-full rounded-lg overflow-hidden relative pb-[75%]">
                {webcamSrc.match(/\.jpg|\.png|\.jpeg|\.gif|\.mjpg|\.mjpeg$/i) ? (
                  <img
                    src={webcamSrc}
                    alt={webcamTitle}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={webcamSrc}
                    title={webcamTitle}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    scrolling="no"
                    style={{ overflow: 'hidden' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </MobileOnly>
    </>
  )
} 