import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Header />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="w-full space-y-6">
          <div className="rounded-[32px] border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.02] p-6 shadow-[0_35px_120px_-35px_rgba(15,23,42,0.8)]">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
