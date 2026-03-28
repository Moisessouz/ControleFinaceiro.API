import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';

export default function TotalsByPersonPage() {
  const { persons, transactions } = useAppContext();
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const data = useMemo(() => {
    return persons.map(p => {
      const pts = transactions.filter(t => t.personId === p.id);
      const receitas = pts.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
      const despesas = pts.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0);
      return { person: p, receitas, despesas, saldo: receitas - despesas };
    });
  }, [persons, transactions]);

  const totals = useMemo(() => ({
    receitas: data.reduce((s, d) => s + d.receitas, 0),
    despesas: data.reduce((s, d) => s + d.despesas, 0),
    saldo: data.reduce((s, d) => s + d.saldo, 0),
  }), [data]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 size={24} className="text-primary" /> Totais por Pessoa
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">Total Receitas</p>
          <p className="text-2xl font-bold text-success">{fmt(totals.receitas)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">Total Despesas</p>
          <p className="text-2xl font-bold text-destructive">{fmt(totals.despesas)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">Saldo Líquido</p>
          <p className={`text-2xl font-bold ${totals.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>{fmt(totals.saldo)}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Detalhamento</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma pessoa cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pessoa</TableHead>
                  <TableHead className="text-right">Receitas</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(d => (
                  <TableRow key={d.person.id}>
                    <TableCell className="font-medium">{d.person.name}</TableCell>
                    <TableCell className="text-right font-mono text-success">{fmt(d.receitas)}</TableCell>
                    <TableCell className="text-right font-mono text-destructive">{fmt(d.despesas)}</TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${d.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>{fmt(d.saldo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell>TOTAL GERAL</TableCell>
                  <TableCell className="text-right font-mono text-success">{fmt(totals.receitas)}</TableCell>
                  <TableCell className="text-right font-mono text-destructive">{fmt(totals.despesas)}</TableCell>
                  <TableCell className={`text-right font-mono ${totals.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>{fmt(totals.saldo)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
