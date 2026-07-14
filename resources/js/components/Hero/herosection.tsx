import { Link } from '@inertiajs/react';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden min-h-[60vh] flex items-center py-12 sm:py-16 lg:py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url("https://www.bracu.ac.bd/sites/default/files/news-image/2023/October/Road%20Safety%20Awareness%20Seminar.jpg")`,
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-[float_4s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-[float_5s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-[float_6s_ease-in-out_infinite_2s]" />
      <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-white/15 rounded-full animate-[float_7s_ease-in-out_infinite_0.5s]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-[fadeInDown_0.8s_ease-out]">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="text-sm font-medium text-white/90">
              National Security Initiative
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <div className="flex flex-col gap-4 items-center">
              <span>
                Nexus Driving Education and{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
                    Road
                  </span>
                  <span className="absolute inset-0 blur-xl opacity-50" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
                </span>
              </span>
              <span>Safety Organization</span>
            </div>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            Nexus Driving Instructor Foundation (NDIF) and National Road Safety Volunteer Grid (NRSVG) are working together to build a safer driving environment across the nation through professional training and volunteer engagement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
            <Link href="/membership/register" className="group w-full sm:w-auto px-8 py-4 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
               Apply Now
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
