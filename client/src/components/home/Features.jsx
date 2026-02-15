import React from 'react'
import { Download, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Title from './Title';

const Features = () => {
    const [isHover, setIsHover] = React.useState(false);
  return (
    <div id = 'features' className='flex flex-col items-center my-8 scroll-mt-10'>

        <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-400/10 border border-purple-200 rounded-full px-5 py-1">
            <Zap width={14}/>
            <span>Simple Process</span>
        </div>
        <Title title='Build your resume' description='Create a standout resume in minutes with guided steps, smart tips,
        and easy customization built for job seekers.'/>

            <div className="flex flex-col md:flex-row items-center xl:-mt-10">
                <img className="max-w-2xl w-full xl:-ml-32" src="/person6.png" alt="" />
                <div className="px-4 md:px-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                    <div className={"flex items-center justify-center gap-6 max-w-md group cursor-pointer"}>
                        <div className={`p-4 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300  flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <Sparkles className="size-5 text-violet-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Smart Content Guidance</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Get tailored suggestions to describe your experience clearly and professionally.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-4 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
                            <ShieldCheck className="size-5 text-green-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">ATS-Friendly Templates</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Choose clean, recruiter-ready templates that pass applicant tracking systems.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-4 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <Download className="size-5 text-orange-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Easy Export and Share</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Download, print, or share a public link to your resume in one click.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
  )
}

export default Features