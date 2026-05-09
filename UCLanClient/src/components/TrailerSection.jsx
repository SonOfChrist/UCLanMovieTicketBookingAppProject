import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import ReactPlayer from 'react-player'
import { dummyTrailers } from '../assets/assets'
import { PlayCircleIcon } from 'lucide-react'
import { ChevronRight, Play } from 'lucide-react'
import { assets } from '../assets/assets'

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
  <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
    <div className="flex items-center gap-4 mb-8">
      <Play className="w-10 h-10 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse fill-current" />
          <div>
            <h2 className="text-3xl md:text-4xl font-black italic text-transparent bg-clip-text bg-linear-to-r from-rose-500 via-rose-400 to-white tracking-tight drop-shadow-lg mb-2">
              Watch the Latest Trailers
            </h2>
            <p className="text-slate-400 text-sm font-medium">Experience the cinematic events of the year</p>
          </div>
    </div>

    <div id="trailer-player" className="relative flex justify-center items-center rounded-4xl overflow-hidden shadow-2xl border border-white/10 bg-black/80 backdrop-blur-3xl mb-12 aspect-video w-full max-w-6xl mx-auto group z-20">
        <div className="absolute top-0 right-0 w-125 h-125 bg-rose-500/20 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-500/20 rounded-full blur-[120px] -z-10 translate-y-1/3 -translate-x-1/2"></div>
          <ReactPlayer
            src={`https://www.youtube.com/embed/${currentTrailer.videoUrl}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              title={currentTrailer.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              controls={true}
              width="100%"
              height="540px"
              playIcon={
                <div className="w-20 h-20 bg-rose-600/80 backdrop-blur-md rounded-full flex items-center justify-center border border-rose-500/50 hover:scale-110 hover:bg-rose-500 transition-all shadow-[0_0_40px_rgba(244,63,94,0.4)] cursor-pointer">
                    <Play className="w-8 h-8 text-white ml-2 fill-current" />
                </div>
              }
        />
        
    </div>

    <div className="mt-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Trailers & Clips</h2>
            <p className="text-slate-400 text-sm">Watch the latest previews and teasers</p>
          </div>
          <button className="text-rose-500 hover:text-rose-400 font-medium text-sm flex items-center gap-1 group">
            See all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {dummyTrailers.map((trailer) => (
            <div key={trailer.id} className="min-w-70 md:min-w-100 snap-start group cursor-pointer" onClick={()=> setCurrentTrailer(trailer)}>
              <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 mb-3 relative overflow-hidden group-hover:border-rose-500/50 transition-all shadow-lg">
                <img src={trailer.image} alt={trailer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-rose-500/50 group-hover:border-rose-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Play className="w-5 h-5 text-white ml-1 fill-current opacity-80 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded tracking-widest uppercase">
                  Trailer
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{trailer.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrailersSection
