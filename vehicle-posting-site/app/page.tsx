import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      {/* ✅ Navbar at top */}
      <Navbar />

      {/* ✅ Main content */}
      <main className="p-6">
        <h1 className="text-3xl font-bold">Welcome to Vehicle Ad Posting Site</h1>
        <p className="mt-4 text-gray-600">
          Post your Cars, SUVs, Vans, Trucks, Bikes, Three-Wheels, and Lorries easily!
        </p>
      </main>
   </div>
  );
}