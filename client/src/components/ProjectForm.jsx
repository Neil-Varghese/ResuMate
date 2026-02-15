import { Plus, Trash2, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'

const ProjectForm = ({data, onChange}) => {
    const { token } = useSelector(state => state.auth)
    const [loadingIndex, setLoadingIndex] = useState(null)

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: "",
        };
        onChange([...data, newProject])
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateProject = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated)
    }

    const handleEnhance = async (index) => {
        if (loadingIndex !== null) return;
        const project = data[index];
        const content = project?.description || '';
        if (!content || content.trim().length === 0) {
            toast.error('Please enter a project description to enhance')
            return
        }
        setLoadingIndex(index)
        try {
            // reuse the job description enhancement endpoint
            const { data: res } = await api.post('/api/ai/enhance-job-desc', { userContent: content }, { headers: { Authorization: token } })
            if (res && res.enhancedContent) {
                updateProject(index, 'description', res.enhancedContent)
                toast.success('Project description enhanced')
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message)
        }
        setLoadingIndex(null)
    }

  return (
    <div>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Projects </h3>
                    <p className='text-sm text-gray-500'>Add your projects</p>
                </div>
                <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors'>
                    <Plus className="size-4"/>
                    Add Project
                </button>
            </div>


                <div className='space-y-4 mt-6'>
                    {data.map((project, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <div className='flex justify-between items-start'>
                                <h4>Project #{index + 1}</h4>
                                <button onClick={() => removeProject(index)}
                                    className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className="size-4"/>
                                </button>
                            </div>

                            <div className='grid gap-3'>

                                <input value={project.name || ""} onChange={ (e) => updateProject(index, "name", e.target.value) }
                                    type="text" placeholder="Project Name" className="px-3 py-2 text-sm rounded-lg"/>

                                <input value={project.type || ""} onChange={ (e) => updateProject(index, "type", e.target.value) }
                                    type="text" placeholder="Project Type" className="px-3 py-2 text-sm rounded-lg"/>

                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <label className='text-sm font-medium text-gray-700'>Project Description</label>
                                        <button onClick={() => handleEnhance(index)} disabled={loadingIndex === index} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                            <Sparkles className='w-3 h-3'/>
                                            {loadingIndex === index ? 'Enhancing...' : 'AI Enhance'}
                                        </button>
                                    </div>
                                    <textarea rows={4} value={project.description || ""} onChange={ (e) => updateProject(index, "description", e.target.value) }
                                        placeholder="Describe your project..." className="w-full px-3 py-2 text-sm rounded-lg resize-none"/>
                                </div>

                            </div>
                                
                            

                        </div>
                    ))}
                </div>


    </div>
  )
}

export default ProjectForm