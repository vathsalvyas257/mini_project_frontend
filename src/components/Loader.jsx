import React from 'react'
import { useSelector } from 'react-redux'

const Loader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="animate-spin h-12 w-12 rounded-full border-4 border-white border-t-blue-500"></div>
    </div>
  )
}

export default Loader
