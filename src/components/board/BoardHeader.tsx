import { toast } from "sonner";
import { Download, Upload, Undo2, Redo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateTaskDialog } from "../CreateTaskDialog";
import { BoardHeaderProps } from "@/utils/types";
import React from "react";

export const BoardHeader = ({
  onTaskCreate,
  onExport,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: BoardHeaderProps) => {
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (file.type !== "application/json") {
      toast.error("Please select a JSON file");
      return;
    }

    onImport(e);

    // Reset the input value so the same file can be imported again
    e.target.value = "";
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <CreateTaskDialog onTaskCreate={onTaskCreate} />
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <label className="cursor-pointer">
          <Input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button variant="outline" asChild>
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Import
            </span>
          </Button>
        </label>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
