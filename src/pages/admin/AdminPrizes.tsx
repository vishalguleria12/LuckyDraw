import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useAllPrizes, useDeliverPrize } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Gift, Loader2, Check } from "lucide-react";
import { format } from "date-fns";

export default function AdminPrizes() {
  const { data: prizes, isLoading } = useAllPrizes();
  const deliverPrize = useDeliverPrize();

  const [deliverDialogPrize, setDeliverDialogPrize] = useState<any>(null);
  const [deliveryCode, setDeliveryCode] = useState("");

  const handleDeliver = () => {
    if (!deliverDialogPrize) return;
    
    const profile = (deliverDialogPrize as any).profiles;
    
    deliverPrize.mutate({
      prizeId: deliverDialogPrize.id,
      deliveryCode: deliveryCode || undefined,
      winnerEmail: profile?.email,
      winnerName: profile?.username || profile?.email?.split('@')[0],
      prizeName: deliverDialogPrize.prize_name,
    }, {
      onSuccess: () => {
        setDeliverDialogPrize(null);
        setDeliveryCode("");
      },
    });
  };

  const pendingPrizes = prizes?.filter((p) => p.status === "pending") || [];
  const deliveredPrizes = prizes?.filter((p) => p.status === "delivered") || [];

  return (
    <AdminLayout title="Manage Prizes">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Prizes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-500" />
              Pending Delivery ({pendingPrizes.length})
            </h3>
            
            {pendingPrizes.length > 0 ? (
              <div className="space-y-3">
                {pendingPrizes.map((prize) => (
                  <Card key={prize.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{prize.prize_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Winner: {(prize as any).profiles?.username || (prize as any).profiles?.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Won on: {format(new Date(prize.created_at), "MMM d, yyyy h:mm a")}
                          </p>
                          {prize.prize_code && (
                            <p className="text-xs mt-1">
                              <span className="text-muted-foreground">Code: </span>
                              <code className="bg-muted px-2 py-0.5 rounded">{prize.prize_code}</code>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                            Pending
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setDeliverDialogPrize(prize);
                              setDeliveryCode(prize.prize_code || "");
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Delivered
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending prizes to deliver
                </CardContent>
              </Card>
            )}
          </div>

          {/* Delivered Prizes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Delivered ({deliveredPrizes.length})
            </h3>
            
            {deliveredPrizes.length > 0 ? (
              <div className="space-y-3">
                {deliveredPrizes.map((prize) => (
                  <Card key={prize.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{prize.prize_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Winner: {(prize as any).profiles?.username || (prize as any).profiles?.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Delivered on: {prize.delivered_at ? format(new Date(prize.delivered_at), "MMM d, yyyy h:mm a") : "N/A"}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                          Delivered
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No delivered prizes yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Deliver Dialog */}
      <Dialog open={!!deliverDialogPrize} onOpenChange={(open) => {
        if (!open) {
          setDeliverDialogPrize(null);
          setDeliveryCode("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deliver Prize</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground">Prize</p>
              <p className="font-medium">{deliverDialogPrize?.prize_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Winner</p>
              <p className="font-medium">
                {(deliverDialogPrize as any)?.profiles?.username || (deliverDialogPrize as any)?.profiles?.email}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Prize Code (optional update)</Label>
              <Input
                value={deliveryCode}
                onChange={(e) => setDeliveryCode(e.target.value)}
                placeholder="Enter or update prize code"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliverDialogPrize(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeliver} disabled={deliverPrize.isPending}>
              {deliverPrize.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
