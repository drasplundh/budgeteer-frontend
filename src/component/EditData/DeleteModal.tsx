import Modal from 'react-modal';
import '../../css/DeleteModal.css';


interface DeleteModalProps {

    message: string
    isOpen: boolean
    onConfirm: () => void;
    onClose: () => void;
}


function DeleteModal({ message, onConfirm, onClose, isOpen }: DeleteModalProps) {



    return (
        <Modal className='delete-modal' overlayClassName='delete-modal-overlay' isOpen={isOpen} onRequestClose={onClose}>
            <h1>Really Delete?</h1>
            <h3>{message}</h3>
            <div className='d-flex button-spacing'>
                <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    )
}
export default DeleteModal;