import React from 'react'

const Title = ({title, description}) => {
  return (
    <div className='text-center mt-4 text-slate-700'>
        <h2 className='text-2xl sm:text-3xl font-medium'>{title}</h2>
        <p className='max-sm max-w-2xl mt-2 text-slate-500'>{description}</p>
        
    </div>
  )
}

export default Title