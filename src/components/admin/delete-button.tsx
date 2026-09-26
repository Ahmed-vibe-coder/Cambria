"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  id: string;
  entityName: string;
  itemName?: string;
  variant?: "icon" | "full";
  redirectTo?: string;
}

export function DeleteButton({
  action,
  id,
  entityName,
  itemName,
  variant = "icon",
  redirectTo,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    const formData = new FormData();
    formData.append("id", id);
    startTransition(async () => {
      await action(formData);
      setIsOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
    });
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title={`Delete ${entityName}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete {entityName}</span>
        </Button>
      )}

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delete {entityName}
                </h3>
                <p className="text-xs text-slate-500 pt-0.5">
                  Permanent removal from institutional ledger.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
              {itemName && (
                <p className="font-semibold text-slate-800 truncate">
                  Target: {itemName}
                </p>
              )}
              <p>
                Are you sure you want to permanently delete this {entityName}? This action is irreversible and will be logged in the system audit trail.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={handleConfirm}
                className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
