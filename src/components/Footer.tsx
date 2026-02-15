export default function Footer() {
  return (
    <footer className="border-t border-dark-border py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-light-text text-sm">
          &copy; {new Date().getFullYear()} Dr. Jeff Daniels. All rights
          reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-light-text hover:text-gold text-sm transition-colors duration-300"
          >
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
}
