import { FilePenIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api.js'
import pdfToText from 'react-pdftotext'
import { all } from 'axios'

const Dashboard = () => {


  const {user, token} = useSelector(state => state.auth);

  const colors = [
    "#7C3AED",
    "#2563EB",
    "#0EA5E9",
    "#14B8A6",
    "#22C55E",
    "#F97316",
    "#EF4444",
    "#F59E0B",
    "#EC4899",
    "#64748B",
  ]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async() => {
    try{
      const {data} = await api.get('/api/users/resumes', {headers: {Authorization: token}});
      setAllResumes(data.resumes)

    } catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
    
    try{
      event.preventDefault()
      const {data} = await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}});
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try{
      const resumeText = await pdfToText(resume);
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText} , {headers: {Authorization: token}});
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
        // add new resume to the list so it shows immediately on the dashboard
        if(data && data.resume){
          setAllResumes(prev => [...prev, data.resume]);
        }
      navigate(`/app/builder/${data.resume._id}`)
    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false) 
  }

  const editTitle = async (event) => {
    try{
      event.preventDefault()
      const {data} = await api.put(`/api/resumes/update/${editResumeId}`, {resumeId: editResumeId, resumeData: {title}}, {headers: {Authorization: token}});
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume,title: title} : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message);
    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }  
  }

  const deleteResume = async(resumeId) => {
    try{
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if(confirm){
        const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: {Authorization: token}});
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message);
      }
    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }

  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>

        <p className='text-xl font-medium mb-4 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Hi, {user?.name}</p>
        
        <div className='flex gap-3'>
          <button onClick = {() => setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-40 flex flex-col items-center justify-center rounded-lg gap-1.5 text-slate-600 border-2 border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-9 transition-all duration-300 p-2 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">Create Resume</p>
          </button>


          <button onClick = {() => setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-40 flex flex-col items-center justify-center rounded-lg gap-1.5 text-slate-600 border-2 border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className='size-9 transition-all duration-300 p-2 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
            <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
          </button>
        </div>


      <hr className='border-slate-300 my-4 sm:w-[305px]'/>

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-3">
        {(allResumes || []).map((resume, index) => {
          const baseColor = colors[index% colors.length];
          return (
            <button key={index} onClick={() => resume && resume._id && navigate(`/app/builder/${resume._id}`)} 
            className='relative w-full sm:max-w-36 h-40 flex
            flex-col items-center justify-center rounded-lg gap-1.5 border group
            hover:shadow-lg transition-all duration-300 cursor-pointer' style=
            {{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)
            `,borderColor: baseColor + '40'}}>

              <FilePenIcon className="size-6 group-hover:scale-105
              transition-all " style={{color: baseColor}}/>
              <p className='text-sm group-hover:scale-105 transition-all px-2
              text-center' style={{ color: baseColor }}>{resume.title}</p>
              <p className='absolute bottom-1 text-[11px] text-slate-400
              group-hover:text-slate-500 transition-all duration-300 px-2
              text-center' style={{ color: baseColor + '90' }}>
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              <div onClick = {e=> e.stopPropagation()} className='absolute top-0.5 right-0.5 group-hover:flex items-center hidden'>
                <TrashIcon onClick = {() => deleteResume(resume._id)} className="size-5 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                <PencilIcon onClick={() => {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-5 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors"/>

              </div>
            </button>
          )
        })}
      </div>

        {showCreateResume && (
          <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-5'>
              <h2 className='text-lg font-bold mb-3'>Create a Resume</h2>
              <input onChange = {(e) => setTitle(e.target.value)} value = {title} type="text" placeholder='Enter resume title' className='w-full px-3 py-1 mb-3 focus:border-purple-600 ring-purple-600' required/>
            
              <button className='w-full py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm'>Create Resume</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick = {() =>
                {setShowCreateResume(false); setTitle('') }}/>

            </div>
          </form>
        )
        }

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-5'>
              <h2 className='text-lg font-bold mb-3'>Create a Resume</h2>
              <input  onChange = {(e) => setTitle(e.target.value)} value = {title} type="text" placeholder='Enter resume title' className='w-full px-3 py-1 mb-3 focus:border-purple-600 ring-purple-600' required/>
                <div>
                  <label htmlFor = "resume-input" className = "block text-xs text-slate-700">
                    Select resume file
                    <div className='flex flex-col items-center justify-center gap-1.5 border group text-slate-400 border-slate-400 border-dashed rounded-md p-3 py-6 my-3 hover:border-purple-500 hover:text-purple-700 cursor-pointer transition-colors'>
                      {resume ? (
                        <p className='text-purple-700 text-sm'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-10 stroke-1'/>
                          <p className='text-xs'>Upload resume</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id="resume-input" accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])}/>
                </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-1.5 bg-purple-600 text-white rounded transition-colors flex items-center justify-center gap-2 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'}`}>
                {isLoading && <LoaderCircleIcon className='animate-spin w-3 h-3 text-white' />}
                <span>{isLoading ? 'Uploading...' : 'Upload Resume'}</span>
              </button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick = {() =>
                {setShowUploadResume(false); setTitle('') }}/>
            </div>
          </form>
        )
        }

        {editResumeId && (
          <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} 
          className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-5'>
              <h2 className='text-lg font-bold mb-3'>Edit Resume Title</h2>
              <input onChange = {(e) => setTitle(e.target.value)} value = {title} type="text" placeholder='Enter resume title' className='w-full px-3 py-1 mb-3 focus:border-purple-600 ring-purple-600' required/>
            
              <button className='w-full py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm'>Update</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick = {() =>
                {setEditResumeId(''); setTitle('') }}/>

            </div>
          </form>
        )
        }

      </div>
    </div>
  )
}

export default Dashboard
