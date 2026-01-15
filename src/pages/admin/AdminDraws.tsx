import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useAllDraws, useCreateDraw, useUpdateDraw, useDeleteDraw, useSelectWinner } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Trophy, Loader2 } from "lucide-react";
import { format } from "date-fns";

const prizeTypes = [
  { value: "gift_card", label: "Gift Card" },
  { value: "subscription", label: "Subscription" },
  { value: "digital_code", label: "Digital Code" },
];

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const emojis = ["🎁", "🎮", "📺", "🎵", "🛒", "💳", "🎬", "📱"];

interface DrawFormData {
  prize_name: string;
  prize_subtitle: string;
  prize_emoji: string;
  prize_type: string;
  prize_code: string;
  token_cost: number;
  max_entries: number;
  ends_at: string;
  status: string;
}

const defaultFormData: DrawFormData = {
  prize_name: "",
  prize_subtitle: "",
  prize_emoji: "🎁",
  prize_type: "gift_card",
  prize_code: "",
  token_cost: 1,
  max_entries: 100,
  ends_at: "",
  status: "upcoming",
};

export default function AdminDraws() {
  const { data: draws, isLoading } = useAllDraws();
  const createDraw = useCreateDraw();
  const updateDraw = useUpdateDraw();
  const deleteDraw = useDeleteDraw();
  const selectWinner = useSelectWinner();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDraw, setEditingDraw] = useState<string | null>(null);
  const [formData, setFormData] = useState<DrawFormData>(defaultFormData);

  const handleCreate = () => {
    createDraw.mutate({
      ...formData,
      ends_at: new Date(formData.ends_at).toISOString(),
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData(defaultFormData);
      },
    });
  };

  const handleUpdate = (id: string) => {
    updateDraw.mutate({
      id,
      ...formData,
      ends_at: new Date(formData.ends_at).toISOString(),
    }, {
      onSuccess: () => {
        setEditingDraw(null);
        setFormData(defaultFormData);
      },
    });
  };

  const openEditDialog = (draw: any) => {
    setFormData({
      prize_name: draw.prize_name,
      prize_subtitle: draw.prize_subtitle || "",
      prize_emoji: draw.prize_emoji || "🎁",
      prize_type: draw.prize_type,
      prize_code: draw.prize_code || "",
      token_cost: draw.token_cost,
      max_entries: draw.max_entries,
      ends_at: format(new Date(draw.ends_at), "yyyy-MM-dd'T'HH:mm"),
      status: draw.status,
    });
    setEditingDraw(draw.id);
  };

  const DrawForm = ({ onSubmit, submitLabel, isSubmitting }: { onSubmit: () => void; submitLabel: string; isSubmitting: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prize Name</Label>
          <Input
            value={formData.prize_name}
            onChange={(e) => setFormData({ ...formData, prize_name: e.target.value })}
            placeholder="Netflix Premium"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={formData.prize_subtitle}
            onChange={(e) => setFormData({ ...formData, prize_subtitle: e.target.value })}
            placeholder="1 Month Subscription"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Emoji</Label>
          <Select value={formData.prize_emoji} onValueChange={(v) => setFormData({ ...formData, prize_emoji: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emojis.map((emoji) => (
                <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Prize Type</Label>
          <Select value={formData.prize_type} onValueChange={(v) => setFormData({ ...formData, prize_type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {prizeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Prize Code (for winner)</Label>
        <Input
          value={formData.prize_code}
          onChange={(e) => setFormData({ ...formData, prize_code: e.target.value })}
          placeholder="XXXX-XXXX-XXXX"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Token Cost</Label>
          <Input
            type="number"
            min={1}
            value={formData.token_cost}
            onChange={(e) => setFormData({ ...formData, token_cost: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Entries</Label>
          <Input
            type="number"
            min={1}
            value={formData.max_entries}
            onChange={(e) => setFormData({ ...formData, max_entries: parseInt(e.target.value) || 100 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Date & Time</Label>
        <Input
          type="datetime-local"
          value={formData.ends_at}
          onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
        />
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting || !formData.prize_name || !formData.ends_at}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <AdminLayout title="Manage Draws">
      <div className="flex justify-end mb-6">
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setFormData(defaultFormData);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Draw
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Draw</DialogTitle>
            </DialogHeader>
            <DrawForm onSubmit={handleCreate} submitLabel="Create Draw" isSubmitting={createDraw.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {draws?.map((draw) => (
            <Card key={draw.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{draw.prize_emoji}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{draw.prize_name}</h3>
                      <p className="text-sm text-muted-foreground">{draw.prize_subtitle}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{draw.token_cost} token/entry</span>
                        <span>•</span>
                        <span>{draw.current_entries}/{draw.max_entries} entries</span>
                        <span>•</span>
                        <span>Ends: {format(new Date(draw.ends_at), "MMM d, yyyy h:mm a")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      draw.status === "active" 
                        ? "bg-green-500/20 text-green-500" 
                        : draw.status === "completed"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {draw.status}
                    </span>

                    {draw.status === "active" && draw.current_entries > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-yellow-500 border-yellow-500/30">
                            <Trophy className="h-4 w-4 mr-1" />
                            Select Winner
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Select Winner?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will randomly select a winner from {draw.current_entries} entries and complete the draw. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => selectWinner.mutate(draw.id)}>
                              Select Winner
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {draw.winner_username && (
                      <span className="text-sm text-green-500">
                        Winner: {draw.winner_username}
                      </span>
                    )}

                    <Dialog open={editingDraw === draw.id} onOpenChange={(open) => {
                      if (!open) {
                        setEditingDraw(null);
                        setFormData(defaultFormData);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(draw)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Edit Draw</DialogTitle>
                        </DialogHeader>
                        <DrawForm 
                          onSubmit={() => handleUpdate(draw.id)} 
                          submitLabel="Save Changes" 
                          isSubmitting={updateDraw.isPending} 
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Draw?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this draw. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteDraw.mutate(draw.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!draws?.length && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No draws yet. Create your first draw to get started.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
