import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../api/ExpenseApi';
import { fetchCategories } from "../api/CategoryApi";
import { useState } from 'react'
import { search } from 'fast-fuzzy';


// ChatGPTed the shit outta this. Probably should look over how it works.

function Categorize() {

    // keep track of editing
    const [isEditing, setIsEditing] = useState(false);

    const [categoryInputs, setCategoryInputs] = useState<Record<number, string>>({})


    const queryClient = useQueryClient();


    // update func
    const { mutate: updateExpenseMutation } = useMutation({
        mutationFn: (updateCategoryRequest: { expenseId: number, categoryName: string, subcategoryName?: string }) =>
            updateExpense(updateCategoryRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
        }
    });

    // expense/categories fetch
    const [expensesQuery, categoriesQuery] = useQueries({
        queries: [
            { queryKey: ['expenses'], queryFn: fetchExpenses },
            { queryKey: ['categories'], queryFn: fetchCategories }
        ]
    });

    // some kind of check - look into this
    if (expensesQuery.isLoading || categoriesQuery.isLoading) return <div>Loading...</div>;
    if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
    if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;


    // only access data after loading checks
    const expenses = expensesQuery.data;
    const categories = categoriesQuery.data;
    console.log("expenses", expenses);

    const uncategorized = expenses.filter((expense: any) => expense.subcategory === null);
    console.log("uncategorized", uncategorized);









    return (
        <div className="container">
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Done' : 'Edit Categories'}
            </button>
            <div className="col expense-table pt d-flex flex-column">
                <table className="table mb-0 table-head">
                    <thead>
                        <tr>
                            <th className='cell-l'>Vendor</th>
                            <th className='cell-r'>Cost</th>
                            <th className='cell-r'>Date</th>
                            <th className='cell-r'>Category</th>
                            <th className='cell-r'>Subcategory</th>
                        </tr>
                    </thead>
                </table>
                <div className="table-scroll" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                    <table className='table table-body'>
                        <tbody>
                            {uncategorized.map((expense: any) => {
                                                                const names = categories.map((c: any) => c.categoryName);
                                const inputValue = categoryInputs[expense.expenseId] ?? '';
const match = inputValue.length >= 3 
    ? search(inputValue, names, { threshold: 0.4, returnMatchData: true })[0] as { item: string; original: string, score: number} | undefined
    : undefined;

const remaining = match?.item.toLowerCase().startsWith(inputValue.toLowerCase())
    ? match.item.slice(inputValue.length)
    : '';

const didYouMean = match?.item && match.item.toLowerCase() !== inputValue.toLowerCase()
    ? match.item
    : null;
                                return (
                                    <tr key={expense.expenseId}>
                                        {/* <td className="vendor-cell">{expense.vendor}</td> */}
                                        <td className="vendor-cell cell-l" data-bs-toggle="tooltip" title={expense.vendor}>
                                            {expense.vendor}
                                        </td>
                                        <td className={expense.cost > 200 ? 'expensive cell-r' : 'cell-r'}>
                                            {expense.cost}
                                        </td>
                                        <td className='cell-r'>{expense.date}</td>
                                        <td className="category-cell cell-r">
                                            {isEditing ? (
                                                <div style={{ position: 'relative' }}>
                                                    <div
                                                        className="form-control"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            color: '#aaa',
                                                            pointerEvents: 'none',
                                                            background: 'transparent'
                                                        }}
                                                    >
                                                        {inputValue}
                                                        {remaining}
                                                    </div>

                                                    <input
                                                        className='form-control'
                                                        value={inputValue}
                                                        onChange={(e) => {
                                                            setCategoryInputs((prev) => ({
                                                                ...prev, [expense.expenseId]: e.target.value

                                                            }))
                                                            console.log(inputValue);

                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                (e.key === 'Tab') && match
                                                            ) {
                                                                e.preventDefault();
                                                                setCategoryInputs((prev) => ({
                                                                    ...prev,
                                                                    [expense.expenseId]: match.item
                                                                }))
                                                                return
                                                            }
                                                            if (e.key === 'Enter') {
                                                                if (didYouMean) {
                                                                    const confirmed = window.confirm(`Did you mean "${didYouMean}"?`)
                                                                    updateExpenseMutation({
                                                                        expenseId: expense.expenseId,
                                                                        categoryName: confirmed ? didYouMean : inputValue
                                                                    });
                                                                    return;
                                                                }
                                                                updateExpenseMutation({
                                                                    expenseId: expense.expenseId,
                                                                    categoryName: inputValue
                                                                });
                                                            }
                                                        }}
                                                        style={{
                                                            position: 'relative',
                                                            background: 'transparent'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                expense.category?.categoryName ?? 'Uncategorized'
                                            )}
                                        </td>
                                        <td className='cell-r'>
                                            subcategories
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export default Categorize;