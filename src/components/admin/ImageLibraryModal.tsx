"use client";

import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

type ImageLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentSelectedUrl?: string | null;
  title?: string;
};

export default function ImageLibraryModal(props: ImageLibraryModalProps) {
  return <MediaLibraryModal {...props} type="image" />;
}
