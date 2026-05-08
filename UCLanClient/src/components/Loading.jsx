import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

  const {nextUrl} = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(nextUrl) {
      setTimeout(() => {
        navigate('/' + nextUrl)
      },5000)
    }

  },[])
  
  {/* Adding a Loading Animation */}
  return (
    <div className='flex items-center justify-center h-[80vh]'>
      <div className='animate-spin rounded-full h-14 w-14 border-2  border-t-primary'></div>
    </div>
  )
}

export default Loading
