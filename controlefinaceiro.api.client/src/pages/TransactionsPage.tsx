import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const { transactions, persons, categories, addTransaction } = useAppContext();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [personId, setPersonId] = useState('');

  const selectedPerson = persons.find(p => p.id === personId);
  const isMinor = selectedPerson ? selectedPerson.age < 18 : false;

  // If minor, force despesa
  const effectiveType = isMinor ? 'despesa' : type;

  const availableCategories = useMemo(() => {
    if (!effectiveType) return [];
    return categories.filter(c => c.purpose === effectiveType || c.purpose === 'ambas');
  }, [categories, effectiveType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = desc.trim();
    if (!trimmed || trimmed.length > 400) { toast.error('Descrição inválida (máx 400)'); return; }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) { toast.error('Valor deve ser positivo'); return; }
    if (!effectiveType) { toast.error('Selecione o tipo'); return; }
    if (!categoryId) { toast.error('Selecione a categoria'); return; }
    if (!personId) { toast.error('Selecione a pessoa'); return; }

    try {
      await addTransaction({ description: trimmed, amount: amountNum, type: effectiveType as TransactionType, categoryId, personId });
      toast.success('Transação cadastrada!');
      setDesc(''); setAmount(''); setType(''); setCategoryId(''); setPersonId(''); setOpen(false);
    } catch (err) {
      toast.error('Erro ao cadastrar transação.');
    }
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowLeftRight size={24} className="text-primary" /> Transações
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{transactions.length} registradas</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setDesc(''); setAmount(''); setType(''); setCategoryId(''); setPersonId(''); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={persons.length === 0 || categories.length === 0}>
              <Plus size={16} /> Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Transação</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Pessoa</Label>
                <Select value={personId} onValueChange={v => { setPersonId(v); setCategoryId(''); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione a pessoa" /></SelectTrigger>
                  <SelectContent>
                    {persons.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.age} anos)</SelectItem>)}
                  </SelectContent>
                </Select>
                {isMinor && <p className="text-xs text-warning mt-1">Menor de idade – apenas despesas permitidas.</p>}
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={desc} onChange={e => setDesc(e.target.value)} maxLength={400} placeholder="Descrição" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor (R$)</Label>
                  <Input type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  {isMinor ? (
                    <Input value="Despesa" disabled />
                  ) : (
                    <Select value={type} onValueChange={v => { setType(v as TransactionType); setCategoryId(''); }}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="despesa">Despesa</SelectItem>
                        <SelectItem value="receita">Receita</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={!effectiveType}>
                  <SelectTrigger><SelectValue placeholder={effectiveType ? 'Selecione' : 'Escolha o tipo primeiro'} /></SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.description}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {persons.length === 0 || categories.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">
          Cadastre {persons.length === 0 ? 'pessoas' : ''}{persons.length === 0 && categories.length === 0 ? ' e ' : ''}{categories.length === 0 ? 'categorias' : ''} antes de criar transações.
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Lista de Transações</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma transação registrada.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Pessoa</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(t => {
                    const person = persons.find(p => p.id === t.personId);
                    const cat = categories.find(c => c.id === t.categoryId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell>{person?.name ?? '—'}</TableCell>
                        <TableCell>{cat?.description ?? '—'}</TableCell>
                        <TableCell>
                          <Badge className={t.type === 'receita' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}>
                            {t.type === 'receita' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">{fmt(t.amount)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
