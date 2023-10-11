import { useCallback, useEffect, useRef, useState } from "react";

const TIME_TO_CLOSE = 3000;

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
    }, TIME_TO_CLOSE);

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
