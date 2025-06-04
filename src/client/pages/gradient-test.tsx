import { Link } from 'react-router'
import * as React from 'react'

export function getMeta() {
  return {
    title: 'Tailwind v4 Gradient Tests'
  }
}

export default function GradientTest() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tailwind v4 Gradient Tests</h1>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Standard gradient tests */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Standard Gradients (should work)</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">Linear Right (bg-linear-to-r from-blue-500 to-indigo-600)</p>
              <div className="h-16 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600"></div>
            </div>
            
            <div>
              <p className="text-sm text-gray-700 mb-2">Linear Bottom Right (bg-linear-to-br from-blue-500 to-indigo-600)</p>
              <div className="h-16 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600"></div>
            </div>
            
            <div>
              <p className="text-sm text-gray-700 mb-2">Button with gradient</p>
              <button className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium">
                Standard Gradient Button
              </button>
            </div>
          </div>
        </div>
        
        {/* Custom color gradient tests */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Custom Color Gradients</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">Primary to Secondary (bg-linear-to-r from-primary-500 to-secondary-500)</p>
              <div className="h-16 rounded-lg bg-linear-to-r from-primary-500 to-secondary-500"></div>
            </div>
            
            <div>
              <p className="text-sm text-gray-700 mb-2">Button with custom gradient</p>
              <button className="px-6 py-2 rounded-lg bg-linear-to-r from-primary-600 to-secondary-600 text-white font-medium">
                Custom Gradient Button
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
