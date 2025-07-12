
import ShortestPathForm from "./components/ShortestPathForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center p-6 sm:p-12 space-y-10">
      
      <div className="text-center">
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-700 drop-shadow-lg">
          Navigation Portal
        </h1>
        <p className="text-lg text-gray-700 mt-2">Find the safest and shortest path around campus 🌐</p>
      </div>

      {/* Form */}
      <ShortestPathForm />

    

      {/* Footer */}
      <footer className="text-sm text-gray-600 mt-10 opacity-75">
        &copy; {new Date().getFullYear()} SUCA Path Finder · Built with ❤️
      </footer>
    </main>
  );
}




