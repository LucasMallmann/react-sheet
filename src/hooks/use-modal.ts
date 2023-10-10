import { useCallback, useEffect, useRef, useState } from "react";

export function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    const dialog = modalRef.current as HTMLDialogElement;

    const timeoutId = setTimeout(() => {
      setIsModalOpen(false);
      dialog.close();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isModalOpen]);

  const onOpenModal = useCallback(() => {
    if (modalRef.current) {
      setIsModalOpen(true);
      const dialog = modalRef.current as HTMLDialogElement;
      dialog.showModal();
    }
  }, []);

  return {
    modalRef,
    isModalOpen,
    onOpenModal,
  };
}
