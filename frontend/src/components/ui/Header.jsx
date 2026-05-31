import { Salad, Bell, Settings } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
          <Salad size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800 leading-none tracking-tight">
            The Routine Plate
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">食事ルーティン管理</p>
        </div>
      </div>

      <nav className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <Settings size={18} />
        </button>
        <div className="ml-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ring-2 ring-green-200">
          <span className="text-xs font-bold text-green-700">S</span>
        </div>
      </nav>
    </header>
  )
}

export default Header
