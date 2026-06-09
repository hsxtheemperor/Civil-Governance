export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Built by the community. All data stored publicly on GitHub.
          </p>
          <a
            href="https://github.com/hsxtheemperor/Civil-Governance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 transition text-sm font-semibold"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </footer>
  )
}
