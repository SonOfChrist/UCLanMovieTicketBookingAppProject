import React, { useState } from 'react';
import { assets } from '../../../UCLanClient/src/assets/assets'
import { Link } from 'react-router-dom';
import { Mail, Film, ArrowUp, Phone, MapPin } from 'lucide-react';
import { FaGithub, FaTwitter, FaFacebook, FaEnvelope, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          setError('Please enter a valid email address.');
          return;
        }
        
        setSubscribed(true);
        setEmail('');
    };

    const scrollToTop = () => {
         window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full mt-20 border-t border-white/10 bg-[#050505]/80 backdrop-blur-xl relative z-10 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between gap-12 border-b border-white/10 pb-12">

              {/* Column 1: Brand & Sub */}
              <div className="lg:max-w-sm">
                <Link to="/" className="flex items-center gap-2 mb-6">
                  <Film className="w-8 h-8 text-rose-500" />
                  <img className="w-30 h-auto drop-shadow-xl" src={assets.LogoWhite} alt="StanShow Logo" />
                </Link>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  StanShow (University of Lancashire) is your ultimate movie ticket companion—discover, book, and enjoy the latest blockbusters with ease. Experience seamless booking, exclusive offers, and a world of entertainment at your fingertips!
                </p>
                <div className="flex items-center gap-3 mt-6">
                    <img src={assets.googlePlay} alt="Google Play" className="h-10 w-auto hover:scale-105 transition" />
                    <img src={assets.appStore} alt="App Store" className="h-10 w-auto hover:scale-105 transition" />
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-4 mb-8 text-slate-400 mt-6">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10">
                        <FaInstagram className="w-4 h-4" /> 
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10">
                        <FaFacebook className="w-4 h-4" /> 
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10">
                        <FaTwitter className="w-4 h-4" /> 
                    </a>
                </div>

                {/* Newsletter Signup */}
                <div>
                    <h3 className="text-[10px] font-black tracking-widest text-white uppercase mb-4">Subscribe for updates</h3>
                    {subscribed ? (
                      <div className="text-green-400 font-bold py-2 text-sm uppercase tracking-wider bg-green-500/10 px-4 rounded-xl border border-green-500/20 text-center">Thank you for subscribing!</div>
                    ) : (
                      <form className="flex gap-2" onSubmit={handleSubscribe}>
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email address..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                          />
                          <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg shadow-rose-900/20 shrink-0"> Subscribe </button>
                      </form>
                    )}
                    {error && <div className="text-rose-400 text-xs mt-2 font-medium">{error}</div>}
                </div>
              </div>

              {/* Columns 2-4: Links */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-[14px] font-black tracking-widest text-white uppercase mb-6">Navigation</h3>
                    <ul className="text-sm space-y-4 text-slate-400">
                        <li><Link to="/" className="hover:text-rose-400 transition-colors">Home</Link></li>
                        <li><Link to="/" className="hover:text-rose-400 transition-colors">About</Link></li>
                        <li><Link to="/" className="hover:text-rose-400 transition-colors">Contact</Link></li>
                        <li><Link to="/" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/" className="hover:text-rose-400 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-[14px] font-black tracking-widest text-white uppercase mb-6">Connect</h3>
                    <ul className="text-sm space-y-4 text-slate-400">
                        <li>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-400 transition-colors"><FaGithub className="w-4 h-4" /><span>GitHub</span></a>
                        </li>
                        <li>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-400 transition-colors"><FaTwitter className="w-4 h-4" /><span>Twitter</span></a>
                        </li>
                        <li>
                            <a href="mailto:mochogestanley80@gmail.com" className="flex items-center gap-2 hover:text-rose-400 transition-colors"><FaEnvelope className="w-4 h-4" /> <span>Mail</span></a>
                        </li>
                        <li>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-400 transition-colors"><FaFacebook className="w-4 h-4" /> <span>Facebook</span></a>
                        </li>
                    </ul>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <h3 className="text-[14px] font-black tracking-widest text-white uppercase mb-6">Contact Us</h3>
                    <div className="text-sm space-y-4 text-slate-400">
                      <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                        <Phone className="w-4 h-4 text-rose-500" />
                        <span className="font-mono">+254-743-587-157</span>
                      </p>
                      <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                        <Mail className="w-4 h-4 text-rose-500" />
                        <span>mochogestanley80@gmail.com</span>
                      </p>
                      <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Nairobi, Kenya<br/>14252 - 00200</span>
                      </p>
                    </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-4 flex md:flex-row items-center justify-between gap-4 text-center">
              <div className="text-center">
                <p className="text-slate-500">
                    © {new Date().getFullYear()} StanShow Movie Ticket App. All rights reserved.
                </p>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                    Powered by <a href="https://www.themoviedb.org/"  target='_blank' className="text-rose-500/80 hover:text-rose-400 transition-colors">Stanley Mochoge (+254743587157)</a>
                </p>
              </div>
              <div className="text-xs font-mono text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">v8.0.0</div>
            </div>

          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="absolute -top-6 right-8 md:right-10 bg-rose-500 border border-rose-500 hover:bg-rose-500 text-white p-3 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all z-50 group hover:-translate-y-1"
            aria-label="Back to top">
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </footer>
    );
}

export default Footer