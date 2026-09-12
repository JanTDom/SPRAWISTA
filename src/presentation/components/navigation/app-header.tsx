import Link from "next/link";

interface AppHeaderProps {
  userFullName?: string;
  orgName?: string;
}

export function AppHeader({
  userFullName = "r.pr. Adam Nowicki",
  orgName = "Kancelaria Nowicki i Wspólnicy sp.p.",
}: AppHeaderProps) {
  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E1E3E7] px-3 sm:px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-3 sm:gap-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/brand/logo.svg" alt="Sprawista" className="h-7 w-auto" />
        </Link>
        <span className="text-xs font-mono text-[#5F6774] hidden sm:inline">
          Pulpit Kancelarii
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="text-xs font-sans text-[#5F6774] hover:text-[#172338] px-2 py-1 rounded transition-colors hidden sm:inline"
        >
          Strona główna
        </Link>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-sans font-bold text-[#172338]">{userFullName}</p>
          <p className="text-[11px] font-mono text-[#5F6774]">{orgName}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#172338] text-[#FFFFFF] text-xs font-mono font-bold flex items-center justify-center">
          AN
        </div>
      </div>
    </header>
  );
}
