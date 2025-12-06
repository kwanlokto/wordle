import { useEffect } from "react";

interface AlertModalProps {
  show_modal: boolean;
  set_show_modal: (show: boolean) => void;
  text: string;
}

export const AlertNotification = ({
  show_modal,
  set_show_modal,
  text,
}: AlertModalProps) => {
  useEffect(() => {
    if (show_modal) {
      const timer = setTimeout(() => {
        set_show_modal(false);
      }, 3000); // Auto-dismiss after 3s

      return () => clearTimeout(timer);
    }
  }, [show_modal, set_show_modal]);

  return show_modal ? (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-300 px-4 py-2 rounded-md shadow-md text-sm z-50 flex items-center gap-2 backdrop-blur-sm">
      <span>{text}</span>
    </div>
  ) : null;
};
