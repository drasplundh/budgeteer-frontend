import { IExpense } from '../../model/Expense';
type ExpenseDraft = Omit<IExpense, 'cost'> & { cost: string };

interface EditableRowProps {
    isEditing: boolean;
    expense: IExpense;
    draft: IExpense | null;
    onDraftChange: (draft: IExpense) => void;
    onEdit: (expense: IExpense) => void;
    onCancel: () => void;
}

function EditableRow({ isEditing, expense, draft, onDraftChange, onEdit, onCancel }: EditableRowProps) {


    return (
        <tr key={expense.expenseId}>
            <td>
                {isEditing ?
                    <input
                        className="form-control"
                        value={expense.vendor ?? ''}
                        onChange={e => onDraftChange({ ...draft!, vendor: e.target.value })}
                    >
                    </input>
                    :
                    expense.vendor}
            </td>
            <td className="cell-r">
                {isEditing ?
                    <input
                        className="form-control"
                        value={expense.cost ?? 0}
                        onChange={e => onDraftChange({ ...draft!, cost: Number(e.target.value) })}
                    >
                    </input>
                    : expense.cost
                }
            </td>
            <td className="cell-r">
                {isEditing ?
                    <input
                        className="form-control"
                        value={expense.date ?? ''}
                        onChange={e => onDraftChange({ ...draft!, date: e.target.value })}
                    >
                    </input>
                    : expense.date
                }
            </td>
            {/* TODO does this belong as a separate edit?*/}
            {/* <td className="cell-r">
                {isEditing ?
                    <input
                        className="form-control"
                        value={expense.subcategory.category.categoryName ?? ''}
                        onChange={e => onDraftChange({ ...draft!, categoryName: e.target.value })}
                    >
                    </input>
                    : expense.subcategory.category.categoryName
                }
            </td> */}
            <td className="cell-r">{expense.subcategory?.category?.categoryName}</td>
            <td className="cell-r">{expense.subcategory?.subcategoryName}</td>
            <td>
                <button onClick={() => onEdit(expense)}>Edit</button>
                <button>Delete</button>
            </td>

        </tr>
    )

};

export default EditableRow;

