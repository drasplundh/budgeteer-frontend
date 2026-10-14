import '../../css/EditData.css';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../../api/ExpenseApi';
import { fetchCategories } from "../../api/CategoryApi";
import { fetchSubcategories } from '../../api/SubcategoryApi';
import { IExpense } from '../../model/Expense';
import { ICategory } from '../../model/Category';
import { ISubcategory } from '../../model/Subcategory';
import { useState } from 'react';
import EditableRow from './EditableRow';
import EditModal from './EditModal';


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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null);


    function handleSelectTransaction(expense: IExpense) {
        setTransactionSelected(expense.expenseId)
        setDraft({ ...expense })
    }

    function handleCancel() {
    setTransactionSelected(null);
    setDraft(null);
}

    function handleOpenModalCategory(category) {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
        setIsModalOpen(true);
    }

    function handleOpenModalSubcategory(subcategory) {
        setSelectedSubcategory(subcategory)
        setSelectedCategory(null);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    return (
        <div className="container">
            <EditModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            onCategorySaved={() => categoriesQuery.refetch()} 
            category={selectedCategory} 
            subcategory={selectedSubcategory}
            onSubcategorySaved={()=> subcategoriesQuery.refetch()}/>
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
                                            <td onClick={() => handleOpenModalCategory(c)} className='selectable'>{c.categoryName}</td>
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
                                            <td onClick={() => handleOpenModalSubcategory(sc)} className="selectable">{sc.subcategoryName}</td>
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