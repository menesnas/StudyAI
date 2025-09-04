// LandingPage.jsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-400">StudyAI</h1>
        <div className="space-x-4">
          <button 
            onClick={() => navigate("/login")} 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            Giriş Yap
          </button>
          <button 
            onClick={() => navigate("/register")} 
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition">
            Kayıt Ol
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center py-20"
        style={{
          backgroundImage: "url('/stars.gif')", // public klasörüne koyduğun gif
        }}
      >
        {/* Overlay (arka planı karartmak için) */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl font-bold mb-8"
          >
            Sonsuz Öğrenme Yolculuğu <br />
            <span className="text-indigo-400">StudyAI</span> ile Başlasın
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-300 text-xl max-w-3xl mx-auto mb-12"
          >
            Yapay zekâ destekli kişisel öğrenme planları, görevler ve kaynak önerileri.
            Eğitimini yıldızların ötesine taşı!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-6 justify-center"
          >
            <button 
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition text-lg font-medium">
              Hemen Başla <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition text-lg font-medium">
              Daha Fazla Bilgi
            </button>
          </motion.div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="px-6 py-12 bg-gray-900">
        <h3 className="text-3xl font-bold text-center mb-8">Neden StudyAI?</h3>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-5 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold mb-1">📘 Kişisel Planlar</h4>
            <p className="text-gray-400 text-sm">
              Seviyene uygun öğrenme planları oluştur.
            </p>
          </div>
          <div className="p-5 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold mb-1">🤖 AI Destekli Chat</h4>
            <p className="text-gray-400 text-sm">
              StudyAI sana adım adım yol göstersin.
            </p>
          </div>
          <div className="p-5 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold mb-1">🔗 Kaynak Önerileri</h4>
            <p className="text-gray-400 text-sm">
              En uygun kaynakları senin için seçer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} StudyAI Tüm Hakları Saklıdır.
      </footer>
    </div>
  );
}



