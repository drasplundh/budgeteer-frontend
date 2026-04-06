import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../api/ExpenseApi';
import { useState } from 'react'

function Categorize() {

    const queryClient = useQueryClient();

    const { mutate: updateExpenseMutation } = useMutation({
        mutationFn: (updateCategoryRequest: { expenseId: number, categoryName: string, subcategoryName?: string }) =>
            updateExpense(updateCategoryRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
        }
    });

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['expenses'],
        queryFn: fetchExpenses
    });
    const [isEditing, setIsEditing] = useState(false);


    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error: {(error as Error).message}</div>;

    const uncategorized = data.filter((expense: any) => expense.category === null);


    // your button

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
                            {uncategorized.map((expense: any) => (
                                <tr>
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
                                            <input
                                                defaultValue={expense.category?.categoryName}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        updateExpenseMutation({
                                                            expenseId: expense.expenseId,
                                                            categoryName: e.currentTarget.value
                                                        })
                                                    }
                                                }}
                                            />
                                        ) : (
                                            expense.category?.categoryName ?? 'Uncategorized'
                                        )}
                                    </td>
                                    <td className='cell-r'>
                                        subcategories
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export default Categorize;