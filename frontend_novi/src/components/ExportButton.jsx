import { useState } from "react";
import { Button } from "@chakra-ui/react";
import ExportDialog from "./ExportDialog";

export default function ExportButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="solid"
        bg="#A31D1D"
        _hover={{ bg: "#881818" }}
        _active={{ bg: "#700F0F" }}
        size="sm"
        rounded="full"
        height={10}
        width="fit-content"
        px={6}
        onClick={() => setIsDialogOpen(true)}
      >
        EXPORT
      </Button>

      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
