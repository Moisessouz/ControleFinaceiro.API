import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { CategoryPurpose } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Tags } from 'lucide-react';
import { toast } from 'sonner';

const purposeLabels: Record<CategoryPurpose, string> = {
  despesa: 'Despesa',
  receita: 'Receita',
  ambas: 'Ambas',
};

const purposeColors: Record<CategoryPurpose, string> = {
  despesa: 'bg-destructive text-destructive-foreground',
  receita: 'bg-success text-success-foreground',
  ambas: 'bg-primary text-primary-foreground',
};

export default function CategoriesPage() {
  const { categories, addCategory } = useAppContext();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [purpose, setPurpose] = useState<CategoryPurpose | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = desc.trim();
    if (!trimmed || trimmed.length > 400) { toast.error('Descrição inválida (máx 400 caracteres)'); return; }
    if (!purpose) { toast.error('Selecione a finalidade'); return; }
    try {
      await addCategory({ description: trimmed, purpose: purpose as CategoryPurpose });
      toast.success('Categoria cadastrada!');
      setDesc(''); setPurpose(''); setOpen(false);
    } catch (err) {
      toast.error('Erro ao cadastrar categoria.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Tags size={24} className="text-primary" /> Categorias
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Nova Categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Categoria</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <Input value={desc} onChange={e => setDesc(e.target.value)} maxLength={400} placeholder="Descrição da categoria" />
              </div>
              <div>
                <Label>Finalidade</Label>
                <Select value={purpose} onValueChange={v => setPurpose(v as CategoryPurpose)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="ambas">Ambas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lista de Categorias</CardTitle></CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma categoria cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Finalidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.description}</TableCell>
                    <TableCell><Badge className={purposeColors[c.purpose]}>{purposeLabels[c.purpose]}</Badge></TableCell>
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
