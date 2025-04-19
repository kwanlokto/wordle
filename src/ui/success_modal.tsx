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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative space-y-4">
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
