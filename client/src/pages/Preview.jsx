import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const Preview = () => {
  const { resumeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async() => {
    try{
      const { data } = await api.get(`/api/resumes/public/${resumeId}`)
      if(data && data.resume){
        setResumeData(data.resume)
      } else {
        setResumeData(null)
      }
    }catch(error){
      console.error('Failed to load public resume');
      setResumeData(null)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResume()
  }, [resumeId])

  if (isLoading) return <Loader />

  if (!resumeData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
        <Link to='/' className='mt-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-purple-400 flex items-center transition-colors'>
          <ArrowLeftIcon className='mr-2 size-4'/> Go to home page
        </Link>
      </div>
    )
  }

  return (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white' />
      </div>
    </div>
  )
}

export default Preview