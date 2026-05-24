"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Share2, MapPin, Send, ShieldCheck } from "lucide-react";
import { submitContact } from "@/api/(public)/submitContact";
import FAQSection from "@/app/components/(public)/FAQ";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isSuccess, isPending, isError, error, reset } = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({ name: "", email: "", phone: "", topic: "", message: "" });
      setTimeout(() => setShowSuccess(false), 5000);
    },
  });

  const handleChange = (e) => {
    if (isSuccess || isError) reset();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <>
      <div className="min-h-screen pt-17 bg-white pb-20 w-full overflow-hidden font-[Sora,sans-serif]">

        {/* Header */}
        <div className="text-center pt-16 pb-5 px-8 sm:px-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0d2d3a] tracking-tight mb-4 leading-tight">
            Let&apos;s build something<br />extraordinary.
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Whether you have a specific project in mind, need technical consultation, or
            just want to discuss modern web architecture, I&apos;m ready to collaborate.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto mt-16 px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-[#0d2d3a] mb-4">Get in Touch</h2>
            <p className="text-gray-500 text-sm leading-7 mb-8">
              Whether you&apos;re looking to scale a SaaS brand or dominate E-commerce
              search results, I&apos;m here to help you build a data-driven strategy that
              delivers.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold tracking-widest text-gray-400 uppercase mb-0.5">EMAIL</p>
                  <a href="mailto:sushantadhikari060@gmail.com" className="text-sm font-medium text-[#0d2d3a] hover:text-[#1e6a7a] transition-colors">
                    sushantadhikari060@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Share2 size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold tracking-widest text-gray-400 uppercase mb-0.5">LINKEDIN</p>
                  <a href="https://www.linkedin.com/in/susan-adhikari-4a084936b" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0d2d3a] hover:text-[#1e6a7a] transition-colors">
                    linkedin.com/in/susan-adhikari-4a084936b
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold tracking-widest text-gray-400 uppercase mb-0.5">LOCATION</p>
                  <p className="text-sm font-medium text-[#0d2d3a]">Pokhara, Nepal</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-[#2a7a8a] pl-5 py-3 bg-[#eaf5f7] rounded-r-lg">
              <p className="text-gray-500 text-sm leading-relaxed italic">
                &ldquo;Expect a response within 24-48 hours. I prioritize deep work and client
                calls during the morning, responding to new inquiries every afternoon.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column — Form */}
          <div>
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                ✅ Message sent successfully! I&apos;ll get back to you within 24-48 hours.
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                ❌ {error?.response?.data?.message || "Something went wrong. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-[#2a7a8a] focus:ring-2 focus:ring-[#2a7a8a]/10 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-[#2a7a8a] focus:ring-2 focus:ring-[#2a7a8a]/10 transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="98077564567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-[#2a7a8a] focus:ring-2 focus:ring-[#2a7a8a]/10 transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Topic</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="SEO related"
                  value={formData.topic}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-[#2a7a8a] focus:ring-2 focus:ring-[#2a7a8a]/10 transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell me about your project and goals..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-[#2a7a8a] focus:ring-2 focus:ring-[#2a7a8a]/10 transition-all resize-vertical placeholder:text-gray-300 min-h-28"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-[#1e6a7a] hover:bg-[#16566a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <ShieldCheck size={16} className="text-[#2a7a8a]" />
                <span className="text-[0.68rem] font-bold tracking-widest text-gray-400 uppercase">
                  TRUSTED BY GLOBAL SAAS AND E-COMMERCE BRANDS
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FAQSection />
    </>
  );
}