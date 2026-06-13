import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImg from "../../imports/logoCorrijeAi.png";

interface HeaderProps {
  title: string;
  timer?: string;
}

export function Header({ title, timer }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 px-4 h-16 flex items-center gap-3">
      <Logo />
      <h1 className="flex-1 text-center font-bold text-xl text-[#000000] truncate">{title}</h1>
      <div className="w-16 text-right shrink-0">
        {timer && (
          <span className="font-bold text-lg text-[#000000] tabular-nums">{timer}</span>
        )}
      </div>
    </header>
  );
}

export function Logo() {
  return (
    <div className="flex items-center shrink-0">
      <div className="h-12 flex items-center">
        <ImageWithFallback 
          src={logoImg} 
          alt="corrije ai" 
          className="h-10 w-auto object-contain"
        />
      </div>
    </div>
  );
}
