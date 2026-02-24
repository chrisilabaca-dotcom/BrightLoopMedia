import { SEO } from "../components/ui/SEO";
import { Phone, Mail, Clock, MessageSquare } from "lucide-react";

export function Contact() {
    return (
        <div className="pt-32 pb-32 px-6 container mx-auto min-h-screen relative overflow-hidden bg-[#030305]">
            <SEO
                title="Contact Us | Book a Call or Send an Enquiry | Bright Loop Media"
                url="https://brightloop.co.uk/contact"
                description="Get in touch with Bright Loop Media. Book a free 15 minute call or send us an enquiry. Based on the Wirral, working with clients across the UK."
            />

            {/* Deep Intense Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-500/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        Get In Touch
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto">
                        Whether you're ready to start a project or just exploring your options, we're happy to have a conversation. No pressure, no obligation.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                            <Phone className="w-8 h-8 text-cyan-400 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <a href="tel:07859986848" className="text-2xl font-light text-white/90 hover:text-cyan-300 transition-colors block mb-2">07859 986848</a>
                            <p className="text-sm text-white/60">Available Monday - Friday: 8am - 5pm</p>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                            <Mail className="w-8 h-8 text-cyan-400 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <a href="mailto:brightloopuk@gmail.com" className="text-lg font-light text-white/90 hover:text-cyan-300 transition-colors block mb-2">brightloopuk@gmail.com</a>
                            <p className="text-sm text-white/60">We respond within 24 hours</p>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                            <Clock className="w-8 h-8 text-cyan-400 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
                            <p className="text-white/90 mb-1">Monday - Friday: 8am - 5pm</p>
                            <p className="text-white/90 mb-1">Saturday: 10am - 4pm</p>
                            <p className="text-cyan-400 text-sm mt-3">24 hour online support</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors cursor-pointer" onClick={() => document.getElementById("chat-widget-trigger")?.click()}>
                            <MessageSquare className="w-8 h-8 text-cyan-400 mb-6" />
                            <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
                            <p className="text-white/90 mb-2">Get instant answers 24/7. Click to start chatting!</p>
                            <p className="text-cyan-400 text-sm mt-3 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">Start Chat →</p>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-8">
                        <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-[#050508]/90 border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                                <p className="text-white/60 mb-10">We'll get back to you within 24 hours. Alternatively, chat instantly with our AI assistant in the bottom right corner.</p>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/70">Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 text-white transition-all placeholder:text-white/20"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-white/70">Email</label>
                                            <input
                                                type="email"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 text-white transition-all placeholder:text-white/20"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white/70">How can we help?</label>
                                        <textarea
                                            rows={5}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 text-white transition-all resize-none placeholder:text-white/20"
                                            placeholder="Tell us about your project or current setup..."
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full bg-white text-black px-8 py-5 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 mt-8"
                                    >
                                        <MessageSquare className="w-5 h-5" /> Send Enquiry
                                    </button>

                                    <p className="text-xs text-center text-white/40 mt-6">
                                        By submitting this form, you agree to be contacted regarding your enquiry.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
