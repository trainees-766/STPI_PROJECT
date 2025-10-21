import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex-none absolute bottom-0 w-full border-t bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-6 px-6 flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/stpilogo.png"
            alt="STPI"
            className="h-10 w-10 object-contain scale-150"
          />
          <div>
            <div className="text-sky-700 font-semibold">STPI KKD</div>
            <div className="text-sm text-sky-600/80">Innovation and Growth</div>
          </div>
        </div>

        <nav className="flex gap-4">
          <Link to="/datacom" className="text-sm text-sky-600 hover:underline">
            Datacom
          </Link>
          <Link to="/exim" className="text-sm text-sky-600 hover:underline">
            Exim
          </Link>
          <Link
            to="/incubation"
            className="text-sm text-sky-600 hover:underline"
          >
            Incubation
          </Link>
          <Link to="/projects" className="text-sm text-sky-600 hover:underline">
            Projects
          </Link>
        </nav>

        <div className="text-sm text-muted-foreground">
         &copy; {new Date().getFullYear()} STPI — All rights reserved To Trainees 2nd Batch
        </div>
      </div>
    </footer>
  );
};

export default Footer;
