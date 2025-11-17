"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Can from "@/components/auth/Can";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { approveDistribution, rejectDistribution } from "@/services/distribution_service";
import { useAuth } from "@/contexts/AuthContext";
import { Distribution } from "@/types/distribution";

type Props = {
  distributionId?: number;
  distribution?: Distribution;
  itemName?: string;
  handleBack?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void | Promise<void>;
  deleting?: boolean;
  onStatusChange?: () => void;
};

export default function HeaderActions({
  distributionId,
  distribution,
  itemName = "",
  handleBack,
  handleEdit,
  handleDelete,
  deleting = false,
  onStatusChange,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const { user } = useAuth();

  const handleDeleteConfirm = () => {
    if (handleDelete) {
      handleDelete();
      setShowDeleteDialog(false);
    }
  };

  const handleApprove = async () => {
    if (!distributionId) return;
    setApproving(true);
    try {
      await approveDistribution(distributionId);
      onStatusChange?.();
    } catch (error) {
      console.error("Failed to approve distribution:", error);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!distributionId) return;
    setRejecting(true);
    try {
      await rejectDistribution(distributionId);
      onStatusChange?.();
    } catch (error) {
      console.error("Failed to reject distribution:", error);
    } finally {
      setRejecting(false);
    }
  };

  const canApproveReject = distribution?.status === "PENDING" && user?.officeId && parseInt(user.officeId) === distribution?.officeId;

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Distributions
          </Button>
          <div className="flex gap-2">
            {/* Approve/Reject buttons for receiving office users */}
            {canApproveReject && (
              <>
                <Button
                  variant="default"
                  onClick={handleApprove}
                  disabled={approving || rejecting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {approving ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={approving || rejecting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {rejecting ? "Rejecting..." : "Reject"}
                </Button>
              </>
            )}

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