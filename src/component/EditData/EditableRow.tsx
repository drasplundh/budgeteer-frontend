import { IExpense } from '../../model/Expense';
import { ICategory } from '../../model/Category';
import { ISubcategory } from '../../model/Subcategory';
import { useState } from 'react';
import '../../css/EditableRow.css';


interface EditableRowProps {
    isEditing: boolean;
    expense: IExpense;
    draft: IExpense | null;
    onDraftChange: (draft: IExpense) => void;
    onEdit: (expense: IExpense) => void;
    onCancel: () => void;
    categories: ICategory[]
    subcategories: ISubcategory[]
    onAccept: (expense: IExpense) => void;
    onDelete: (expense: IExpense) => void;
}




function EditableRow({ isEditing, expense, draft, onDraftChange, onEdit, onCancel, categories, subcategories, onAccept, onDelete }: EditableRowProps) {

    const row = isEditing && draft ? draft : expense;
    const selectCategoryId = row.subcategory?.category?.categoryId;
    const filteredSubcategories = subcategories.filter(sc => sc.category?.categoryId === selectCategoryId);

    return (
        <tr key={expense.expenseId}>
            <td>
                {isEditing ?
                    <input
                        className="form-control"
                        value={row.vendor ?? ''}
                        onChange={e => onDraftChange({ ...row, vendor: e.target.value })}
                    >
                    </input>
                    :
                    expense.vendor}
            </td>
            <td className="cell-r cost-cell">
                {isEditing ?
                    <input
                        className="form-control"
                        value={row.cost ?? 0}
                        onChange={e => onDraftChange({ ...row, cost: Number(e.target.value) })}
                    >
                    </input>
                    : expense.cost
                }
            </td>
            <td className="cell-r date-cell">
                {isEditing ?
                    <input
                        className="form-control"
                        value={row.date ?? ''}
                        onChange={e => onDraftChange({ ...row, date: e.target.value })}
                    >
                    </input>
                    : expense.date
                }
            </td>
            {isEditing ? (<td className='cell-r'>
                <select onChange={e => {
                    const chosenCat = e.target.value;
                    const categoryOption = categories.find(c => c.categoryName === chosenCat)
                    const subcatOptions = subcategories.filter((sc) => sc.category.categoryId === categoryOption.categoryId)
                    const firstSub = subcatOptions[0];
                    console.log("firstSub", firstSub);
                    if (!firstSub) return;
                    onDraftChange(
                        { ...row, subcategory: firstSub }
                    );
                }} value={row.subcategory?.category?.categoryName ?? ''}>
                    {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                    ))}
                </select>
            </td>
            ) :
                <td className="cell-r">{expense.subcategory?.category?.categoryName}</td>
            }

            {isEditing ? (<td className="cell-r">
                <select
                    value={row.subcategory?.subcategoryName}
                    onChange={e => {
                        const chosenSubCat = e.target.value;
                        const subcategoryOption = subcategories.find(sc => sc.subcategoryName === chosenSubCat)
                        onDraftChange({
                            ...row,
                            subcategory: { ...subcategoryOption, category: row.subcategory?.category }
                        })
                    }}>
                    {filteredSubcategories &&
                        filteredSubcategories.map((sc) => (
                            <option key={sc.subcategoryId} value={sc.subcategoryName}>{sc.subcategoryName}</option>
                        ))}
                </select>
            </td>
            ) :
                <td className="cell-r">{expense.subcategory?.subcategoryName}</td>
            }
            {isEditing ? (<td className='cell-r'>
                Duncan
            </td>) :
                <td className='cell-r'>user not found</td>
            }
            {isEditing ? (
                <td className='cell-r'>
                    <button className='btn btn-ok' onClick={() => onAccept(draft)}>Ok</button>
                    <button className='btn btn-secondary' onClick={() => onCancel()}>Cancel</button>
                </td>
            ) : (
                <td className='cell-r actions-cell'>
                        <button className='btn btn-custom' onClick={() => onEdit(expense)}>Edit</button>
                        <button className='btn btn-danger' onClick={() => onDelete(expense)}>Delete</button>
                </td>
            )}


        </tr>
    )

};

export default EditableRow;

