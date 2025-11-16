"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Can from "@/components/auth/Can";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

type Props = {
  distributionId?: number;
  itemName?: string;
  handleBack?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void | Promise<void>;
  deleting?: boolean;
};

export default function HeaderActions({
  distributionId,
  itemName = "",
  handleBack,
  handleEdit,
  handleDelete,
  deleting = false,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = () => {
    if (handleDelete) {
      handleDelete();
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Distributions
          </Button>
          <div className="flex gap-2">
            {/* Only show Edit button if user has permission */}
            <Can page="/distributions" action="edit">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Distribution
              </Button>
            </Can>

            {/* Only show Delete button if user has permission */}
            <Can page="/distributions" action="delete">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? "Deleting..." : "Delete Distribution"}
              </Button>
            </Can>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Distribution"
        description={`You are about to delete the distribution of "${itemName}". This action cannot be undone.`}
        confirmationText={`distribution-${distributionId}`}
        warningMessage="This will permanently delete the distribution record."
        isDeleting={deleting}
      />
    </>
  );
}