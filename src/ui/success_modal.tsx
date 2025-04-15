interface SuccessModalProps {
  show_modal: boolean;
  set_show_modal: (show: boolean) => void;
  text: string;
}
export const SuccessModal = ({
  show_modal,
  set_show_modal,
  text,
}: SuccessModalProps) => {
  return show_modal ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
      <div className="bg-neutral-900 backdrop-blur-xl border border-neutral-800 text-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center">🎉 Congrats!</h2>
        <p className="text-center text-sm text-gray-200">{text}</p>
        <button
          onClick={() => set_show_modal(false)}
          className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};
