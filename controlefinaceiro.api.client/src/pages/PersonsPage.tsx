import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Person } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PersonsPage() {
  const { persons, addPerson, updatePerson, deletePerson } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const reset = () => { setName(''); setAge(''); setEditing(null); };

  const handleOpen = (p?: Person) => {
    if (p) { setEditing(p); setName(p.name); setAge(String(p.age)); }
    else reset();
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 200) { toast.error('Nome inválido (máx 200 caracteres)'); return; }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) { toast.error('Idade inválida'); return; }

    try {
      if (editing) {
        await updatePerson({ ...editing, name: trimmed, age: ageNum });
        toast.success('Pessoa atualizada!');
      } else {
        await addPerson({ name: trimmed, age: ageNum });
        toast.success('Pessoa cadastrada!');
      }
      setOpen(false);
      reset();
    } catch (err) {
      toast.error('Erro ao salvar pessoa.');
    }
  };

  const handleDelete = async (p: Person) => {
    if (confirm(`Excluir "${p.name}" e todas as suas transações?`)) {
      try {
        await deletePerson(p.id);
        toast.success('Pessoa excluída!');
      } catch (err) {
        toast.error('Erro ao excluir pessoa.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users size={24} className="text-primary" /> Pessoas
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{persons.length} cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2"><Plus size={16} /> Nova Pessoa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Pessoa' : 'Nova Pessoa'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={e => setName(e.target.value)} maxLength={200} placeholder="Nome completo" />
              </div>
              <div>
                <Label>Idade</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} min={0} max={150} placeholder="Idade" />
              </div>
              <Button type="submit" className="w-full">{editing ? 'Salvar' : 'Cadastrar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lista de Pessoas</CardTitle></CardHeader>
        <CardContent>
          {persons.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma pessoa cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.age} {p.age < 18 && <span className="text-xs text-warning ml-1">(menor)</span>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpen(p)}><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p)} className="text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
