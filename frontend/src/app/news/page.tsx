export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "Major Platform Update Released",
      date: "April 30, 2025",
      summary: "We're excited to announce our latest platform update featuring enhanced network monitoring capabilities and improved user interface.",
      category: "Product Update"
    },
    {
      id: 2,
      title: "New Security Features Implementation",
      date: "April 25, 2025",
      summary: "Introducing advanced security features to better protect your network monitoring data and ensure compliance with industry standards.",
      category: "Security"
    },
    {
      id: 3,
      title: "CyberMamba Community Growing",
      date: "April 20, 2025",
      summary: "Our user community has reached a significant milestone. Thank you for being part of our journey in making network monitoring more accessible.",
      category: "Company News"
    }
  ];

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      
      <div className="space-y-8">
        {newsItems.map((item) => (
          <article key={item.id} className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full">
                {item.category}
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}