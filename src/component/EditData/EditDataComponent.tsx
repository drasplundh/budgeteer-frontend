import '../../css/EditData.css';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../../api/ExpenseApi';
import { fetchCategories } from "../../api/CategoryApi";
import { fetchSubcategories } from '../../api/SubcategoryApi';
import { IExpense } from '../../model/Expense';
import { useState } from 'react';
import EditableRow from './EditableRow';


function EditDataComponent() {
    const queryClient = useQueryClient();

    const [expensesQuery, categoriesQuery, subcategoriesQuery] = useQueries({
        queries: [
            { queryKey: ['expenses'], queryFn: fetchExpenses },
            { queryKey: ['categories'], queryFn: fetchCategories },
            { queryKey: ['subcategories'], queryFn: fetchSubcategories }
        ]
    });

    const expenses = expensesQuery.data;
    const categories = categoriesQuery.data;
    const subcategories = subcategoriesQuery.data as any[];

    const [transactionSelected, setTransactionSelected] = useState<number | null>(null);
    const [draft, setDraft] = useState<IExpense>(null);


    function handleSelectTransaction(expense: IExpense) {
        setTransactionSelected(expense.expenseId)
        setDraft({ ...expense })
    }

    function handleCancel() {
    setTransactionSelected(null);
    setDraft(null);
}

    return (
        <div className="container">
            <div className="searchBar mb-2">
                <input className="form-control" />
            </div>

            <div className="row edit-row">
                <div className="col-8 pane expense-table pt">
                    <table className="table mb-0 table-head">
                        <thead>
                            <tr>
                                <th className="cell-l">Vendor</th>
                                <th className="cell-r">Cost</th>
                                <th className="cell-r">Date</th>
                                <th className="cell-r">Category</th>
                                <th className="cell-r">Subcategory</th>
                                <th className="cell-r">Edit</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="pane-scroll">
                        <table className="table table-body">
                            <tbody>
                                {expenses ? (
                                    expenses.map((expense: IExpense) => {
                                        const isEditing = expense.expenseId === transactionSelected;

                                        return (
                                            <EditableRow 
                                                key={expense.expenseId} 
                                                isEditing={isEditing} 
                                                expense={expense} 
                                                draft={draft} 
                                                onEdit={handleSelectTransaction}  
                                                onDraftChange={setDraft}
                                                onCancel={handleCancel}
                                            />
                                            //     <td className="cell-r">{expense.cost}</td>
                                            //     <td className="cell-r">{expense.date}</td>
                                            //     <td className="cell-r">{expense.subcategory?.category?.categoryName}</td>
                                            //     <td className="cell-r">{expense.subcategory?.subcategoryName}</td>
                                            //     <td>
                                            //         <button onClick={() => handleSelectTransaction(expense)}>Edit</button>
                                            //         <button>Delete</button>
                                            //     </td>
                                            // </tr>)
                                        )
                                    })
                                ) : (
                                    <tr><td colSpan={6}>Loading...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-2 pane">
                    <p><strong>All Categories</strong></p>
                    <div className="pane-scroll">
                        <table className="table table-sm tal">
                            <tbody>
                                {categories ? (
                                    categories.map((c) => (
                                        <tr key={c.categoryId}>
                                            <td className='selectable'>{c.categoryName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td>Loading...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-2 pane">
                    <p><strong>All Subcategories</strong></p>
                    <div className="pane-scroll">
                        <table className="table table-sm">
                            <tbody>
                                {subcategories ? (
                                    subcategories.map((sc) => (
                                        <tr key={sc.subcategoryId}>
                                            <td className="selectable">{sc.subcategoryName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td>Loading...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditDataComponent;