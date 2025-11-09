import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* ✅ Left side brand or categories */}
      <div className="flex space-x-6">
        
        <Link href="/cars" className="hover:text-gray-200">Cars</Link>
        <Link href="/suv" className="hover:text-gray-200">SUV</Link>
        <Link href="/van" className="hover:text-gray-200">Van</Link>
        <Link href="/bikes" className="hover:text-gray-200">Bikes</Link>
        <Link href="/Three Wheel" className="hover:text-gray-200">Three Wheel</Link>
        <Link href="/Trucks" className="hover:text-gray-200">Trucks</Link>
      </div>

      {/* ✅ Right side buttons */}
      <div className="flex space-x-4">
        <Link href="/post">
          <button className="bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition">
            🚗 Post Your Vehicle
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-gray-200 text-purple-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
            🔑 Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
            📝 Register
          </button>
        </Link>
      </div>
    </nav>
  );
}