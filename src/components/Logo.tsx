import { Link } from "react-router-dom";
import logo from "@/assets/viettrustbank-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  /** when true, wraps the logo in a white rounded chip for contrast on dark backgrounds */
  chip?: boolean;
  to?: string;
  ariaLabel?: string;
}

const Logo = ({ className, imgClassName, chip = false, to = "/", ariaLabel = "VietTrustBank" }: LogoProps) => {
  const img = (
    <img
      src={logo}
      alt={ariaLabel}
      className={cn("h-8 w-auto select-none", imgClassName)}
      draggable={false}
    />
  );
  const wrapped = chip ? (
    <span className="inline-flex bg-white rounded-md px-2.5 py-1 shadow-sm">{img}</span>
  ) : (
    img
  );
  if (!to) return <div className={cn("inline-flex items-center", className)}>{wrapped}</div>;
  return (
    <Link to={to} aria-label={ariaLabel} className={cn("inline-flex items-center", className)}>
      {wrapped}
    </Link>
  );
};

export default Logo;
