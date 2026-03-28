import { NavLink } from 'react-router-dom';
import { Users, Tags, ArrowLeftRight, BarChart3, PieChart } from 'lucide-react';

const navItems = [
  { to: '/', icon: Users, label: 'Pessoas' },
  { to: '/categorias', icon: Tags, label: 'Categorias' },
  { to: '/transacoes', icon: ArrowLeftRight, label: 'Transações' },
  { to: '/totais-pessoa', icon: BarChart3, label: 'Totais por Pessoa' },
  { to: '/totais-categoria', icon: PieChart, label: 'Totais por Categoria' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-primary">💰 FinControl</h1>
          <p className="text-xs mt-1 opacity-60">Gestão Financeira</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
