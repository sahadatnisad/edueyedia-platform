import { Link } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimpleSelect } from "@/components/admin/AdminUI";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-gold/15 text-[#8a681f] dark:text-gold",
  paid: "bg-teal/10 text-teal dark:text-teal-bright",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const ORDER_STATUSES = ["pending", "paid", "cancelled", "failed"];

export default function AdminOrders() {
  const orders = useQuery(api.admin.adminOrders);
  const updateStatus = useMutation(api.admin.updateOrderStatus);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-4 text-teal" />
        <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Orders</h1>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
        Orders are only marked paid after server-side payment verification.
      </p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase">Order</TableHead>
              <TableHead className="text-[10px] uppercase">Customer</TableHead>
              <TableHead className="text-[10px] uppercase">Items</TableHead>
              <TableHead className="text-[10px] uppercase">Total</TableHead>
              <TableHead className="text-[10px] uppercase">Date</TableHead>
              <TableHead className="text-[10px] uppercase">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!orders && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-ink-soft">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {orders?.map((o) => (
              <TableRow key={o._id} className="text-xs">
                <TableCell className="font-mono text-[11px] text-ink-soft dark:text-slate-400">
                  {o._id}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-navy dark:text-slate-100">{o.contactName}</p>
                  <p className="text-[10px] text-ink-soft dark:text-slate-400">
                    {o.contactEmail || o.userEmail}
                  </p>
                </TableCell>
                <TableCell>{o.itemCount}</TableCell>
                <TableCell className="font-semibold text-navy dark:text-slate-100">
                  ৳{o.total}
                </TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">
                  {new Date(o.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                    <SimpleSelect
                      value={o.status}
                      onChange={async (v) => {
                        try {
                          await updateStatus({ id: o._id, status: v as never });
                          toast.success(`Order → ${v}`);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed");
                        }
                      }}
                      options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders && orders.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-soft dark:text-slate-400">
            No orders yet.
          </p>
        )}
      </div>

      <Button asChild variant="outline" size="sm" className="mt-4 h-9 rounded-full text-xs">
        <Link to="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
