import { Head } from '@inertiajs/react';
import {
    Eye,
    Target,
    Shield,
    HeartHandshake,
    Award,
    Star,
    Users,
    Lightbulb,
    Globe,
} from 'lucide-react';

const missions = [
    'Ensure safe and quality driving training.',
    'Increase public awareness on road safety.',
    'Create skilled driving instructors.',
    'Build a volunteer network at the national level.',
    'Create employment and self-employment through job-oriented skill development training.',
    'Develop a domestic and international quality training and certification system.',
];

const values = [
    { label: 'Safety', Icon: Shield },
    { label: 'Integrity', Icon: HeartHandshake },
    { label: 'Professionalism', Icon: Award },
    { label: 'Excellence', Icon: Star },
    { label: 'Service', Icon: Users },
    { label: 'Innovation', Icon: Lightbulb },
    { label: 'Social responsibility', Icon: Globe },
];

const galleryImages = [
    {
        src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
        alt: 'Driving training session',
        caption: 'Driving training',
    },
    {
        src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
        alt: 'Skill development workshop',
        caption: 'Skill development',
    },
    {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        alt: 'Volunteer network gathering',
        caption: 'Volunteer network',
    },
];

export default function About() {
    return (
        <>
            <Head title="About Us – NDIF" />

            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Hero — two-column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
                    <div>
                        <p className="text-[11px] tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                            Nexus Driving Instructor Foundation
                        </p>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 leading-snug">
                            About Us
                        </h1>
                        <span className="inline-block text-xs font-medium text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1 mb-4">
                            Non-profit · Non-political · Public welfare
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            NDIF aims to build a safe road system, create skilled and responsible
                            drivers, and generate employment through skill development — uniting
                            drivers, instructors, volunteers and the public on a single platform.
                        </p>
                    </div>
                    <div className="rounded-xl overflow-hidden h-56 md:h-64 bg-gray-100 dark:bg-neutral-800">
                        <img
                            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
                            alt="Driver on road"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Body text */}
                <div className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 mb-8">
                    <p>
                        Nexus Driving Instructor Foundation (NDIF) is a non-profit, non-political and
                        public welfare organization which believes that ensuring safe roads requires
                        the collective participation of not only skilled drivers, but also conscious
                        pedestrians, trained instructors and active volunteers.
                    </p>
                    <p>
                        To implement this goal, NDIF is working on road safety education, driving
                        training, instructor development, public awareness activities and the
                        formation of a volunteer network — including the{' '}
                        <span className="font-medium text-gray-900 dark:text-white">National Road Safety Volunteer Grid</span>,{' '}
                        <span className="font-medium text-gray-900 dark:text-white">Nexus Road Safety TV</span> and{' '}
                        <span className="font-medium text-gray-900 dark:text-white">Nexus Skills Development Institute</span>.
                    </p>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {galleryImages.map((img) => (
                        <div key={img.caption}>
                            <div className="rounded-xl overflow-hidden h-32 bg-gray-100 dark:bg-neutral-800">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-1">{img.caption}</p>
                        </div>
                    ))}
                </div>

                <hr className="border-t border-gray-200 dark:border-neutral-700 mb-7" />

                {/* Vision + Mission cards */}
                <p className="text-[11px] tracking-widest uppercase text-gray-400 dark:text-gray-500 font-medium mb-4">
                    Our vision and mission
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-5">
                        <Eye size={20} className="text-primary mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Our vision</h3>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            To build a safe, efficient and responsible road transport system in Bangladesh
                            and to contribute to national economic progress through the development of
                            skilled human resources.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-5">
                        <Target size={20} className="text-primary mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Our mission</h3>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            To ensure safe training, increase awareness, develop skilled instructors,
                            build a national volunteer network and create employment through
                            skill development.
                        </p>
                    </div>
                </div>

                {/* Mission detail list */}
                <p className="text-[11px] tracking-widest uppercase text-gray-400 font-medium mb-3">
                    Mission in detail
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-1 mb-8">
                    {missions.map((m, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-2.5 py-2.5 ${i !== missions.length - 1 ? 'border-b border-gray-200 dark:border-neutral-700' : ''
                                }`}
                        >
                            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug">{m}</span>
                        </div>
                    ))}
                </div>

                <hr className="border-t border-gray-200 dark:border-neutral-700 mb-7" />

                {/* Core values */}
                <p className="text-[11px] tracking-widest uppercase text-gray-400 dark:text-gray-500 font-medium mb-4">
                    Our core values
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8">
                    {values.map(({ label, Icon }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-xl py-3 px-2"
                        >
                            <Icon size={18} className="text-primary mb-1.5" />
                            <span className="text-[11px] font-medium text-primary dark:text-primary-foreground text-center leading-tight">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Motto */}
                <div className="rounded-xl border border-primary/30 dark:border-primary/40 bg-primary/10 dark:bg-primary/20 px-6 py-5 text-center">
                    <p className="text-base font-medium text-primary dark:text-primary-foreground italic">
                        "Skilled Drivers, Safe Roads, Prosperous Bangladesh."
                    </p>
                </div>

            </div>
        </>
    );
}
