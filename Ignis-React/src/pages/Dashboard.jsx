export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="bg-white p-6 shadow-lg rounded-lg dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold dark:text-gray-100">Card {n}</h2>
          <p className="text-lg p-1 text-gray-700 dark:text-gray-100">
            Example content…
          </p>
        </div>
      ))}
    </div>
  );
}
