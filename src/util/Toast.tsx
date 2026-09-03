import '../css/Toast.css'

function Toast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="toast show position-fixed bottom-0 end-0 m-3" role="alert">
      <div className="toast-body d-flex">{message}</div>
    </div>
  );
}

export default Toast;