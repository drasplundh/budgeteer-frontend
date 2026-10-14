import Modal from 'react-modal';
import '../../css/EditModal.css';
import { ICategory } from '../../model/Category';
import { useRef } from 'react';
import { updateCategory } from '../../api/CategoryApi';
import { updateSubcategory } from '../../api/SubcategoryApi'
import { ISubcategory } from '../../model/Subcategory';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategorySaved: () => Promise<unknown>
    onSubcategorySaved: () => Promise<unknown>
    category?: ICategory;
    subcategory?: ISubcategory;
}


function EditModal({ isOpen, onClose, category, onCategorySaved, onSubcategorySaved, subcategory }: EditModalProps) {

    const categoryInput = useRef<HTMLInputElement>(null);
    const subcategoryInput = useRef<HTMLInputElement>(null);

    const handleSubmitCategory = async () => {
        const newName = categoryInput.current?.value;
        const updateRequest = {
            categoryId: category.categoryId,
            categoryName: newName
        }
        await updateCategory(updateRequest);
        onCategorySaved();
        onClose();
    }


    const handleSubmitSubcategory = async () => {
        const newName = subcategoryInput.current?.value;
        const updateRequest = {
            subcategoryId: subcategory.subcategoryId,
            subcategoryName: newName
        }
        await updateSubcategory(updateRequest);
        onSubcategorySaved();
        onClose();
    }
    return (
        <Modal className='edit-modal' overlayClassName='edit-modal-overaly' isOpen={isOpen} onRequestClose={onClose}>
            <h3>Rename Category</h3>
            {category &&
                <>
                    <input ref={categoryInput} className="form-control" defaultValue={category?.categoryName}></input>
                    <br></br>
                    <button className="btn btn-primary" onClick={handleSubmitCategory}>Submit</button>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </>
            }
            {subcategory &&
                <>
                    <input ref={subcategoryInput} className="form-control" defaultValue={subcategory?.subcategoryName}></input>
                                        <br></br>
                    <button className="btn btn-primary" onClick={handleSubmitSubcategory}>Submit</button>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </>
            }
        </Modal>
    )
}
export default EditModal;