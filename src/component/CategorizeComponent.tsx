import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../api/ExpenseApi';
import { fetchCategories } from "../api/CategoryApi";
import { fetchSubcategories } from '../api/SubcategoryApi';
import { useState } from 'react'
import { search } from 'fast-fuzzy';


function Categorize() {

    const [isEditing, setIsEditing] = useState(false);
    const [categoryInputs, setCategoryInputs] = useState<Record<number, string>>({})
    const [subcategoryInputs, setSubcategoryInputs] = useState<Record<number, string>>({})

    const queryClient = useQueryClient();

    const { mutate: updateExpenseMutation } = useMutation({
        mutationFn: (updateCategoryRequest: { expenseId: number, categoryName: string, subcategoryName?: string }) =>
            updateExpense(updateCategoryRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
        }
    });

    const [expensesQuery, categoriesQuery, subcategoriesQuery] = useQueries({
        queries: [
            { queryKey: ['expenses'], queryFn: fetchExpenses },
            { queryKey: ['categories'], queryFn: fetchCategories },
            { queryKey: ['subcategories'], queryFn: fetchSubcategories}
        ]
    });

    if (expensesQuery.isLoading || categoriesQuery.isLoading || subcategoriesQuery.isLoading) return <div>Loading...</div>;
    if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
    if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;
    if (subcategoriesQuery.isError) return <div>Categories Error: {(subcategoriesQuery.error as Error).message}</div>;

    const expenses = expensesQuery.data;
    const categories = categoriesQuery.data;
    const subcategories = subcategoriesQuery.data as any[];

    const uncategorized = expenses.filter((expense: any) => expense.subcategory === null);

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

                                // --- Category fuzzy match ---
                                const categoryNames = categories.map((c: any) => c.categoryName);
                                const categoryInput = categoryInputs[expense.expenseId] ?? '';
                                const categoryMatch = categoryInput.length >= 3
                                    ? search(categoryInput, categoryNames, { threshold: 0.4, returnMatchData: true })[0] as { item: string; original: string, score: number } | undefined
                                    : undefined;
                                const categoryRemaining = categoryMatch?.item.toLowerCase().startsWith(categoryInput.toLowerCase())
                                    ? categoryMatch.item.slice(categoryInput.length)
                                    : '';
                                const categoryDidYouMean = categoryMatch?.item && categoryMatch.item.toLowerCase() !== categoryInput.toLowerCase()
                                    ? categoryMatch.item
                                    : null;

                                // --- Subcategory fuzzy match ---
                                // Use the fuzzy-matched category (if any) to source subcategories,
                                // so the user doesn't need to fully confirm the category first
                                const matchedCategory = categoryMatch
                                    ? categories.find((c: any) => c.categoryName === categoryMatch.item)
                                    : categories.find((c: any) => c.categoryName.toLowerCase() === categoryInput.toLowerCase());
                                    console.log('expenseId', expense.expenseId, 'matchedCategory:', matchedCategory);
                                const subcategoryNames: string[] = matchedCategory
                                    ? subcategories
                                        .filter((s: any) => s.category?.categoryId === matchedCategory.categoryId)
                                        .map((s: any) => s.subcategoryName)
                                    : [];

                                const subcategoryInput = subcategoryInputs[expense.expenseId] ?? '';
                                const subcategoryMatch = subcategoryInput.length >= 3 && subcategoryNames.length > 0
                                    ? search(subcategoryInput, subcategoryNames, { threshold: 0.4, returnMatchData: true })[0] as { item: string; original: string, score: number } | undefined
                                    : undefined;
                                const subcategoryRemaining = subcategoryMatch?.item.toLowerCase().startsWith(subcategoryInput.toLowerCase())
                                    ? subcategoryMatch.item.slice(subcategoryInput.length)
                                    : '';
                                const subcategoryDidYouMean = subcategoryMatch?.item && subcategoryMatch.item.toLowerCase() !== subcategoryInput.toLowerCase()
                                    ? subcategoryMatch.item
                                    : null;

                                return (
                                    <tr key={expense.expenseId}>
                                        <td className="vendor-cell cell-l" data-bs-toggle="tooltip" title={expense.vendor}>
                                            {expense.vendor}
                                        </td>
                                        <td className={expense.cost > 200 ? 'expensive cell-r' : 'cell-r'}>
                                            {expense.cost}
                                        </td>
                                        <td className='cell-r'>{expense.date}</td>

                                        {/* Category cell */}
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
                                                        {categoryInput}{categoryRemaining}
                                                    </div>
                                                    <input
                                                        className='form-control'
                                                        value={categoryInput}
                                                        onChange={(e) => {
                                                            setCategoryInputs((prev) => ({
                                                                ...prev, [expense.expenseId]: e.target.value
                                                            }));
                                                            // Clear subcategory when category changes
                                                            setSubcategoryInputs((prev) => ({
                                                                ...prev, [expense.expenseId]: ''
                                                            }));
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Tab' && categoryMatch && categoryInput !== categoryMatch.item) {
                                                                e.preventDefault();
                                                                setCategoryInputs((prev) => ({
                                                                    ...prev,
                                                                    [expense.expenseId]: categoryMatch.item
                                                                }));
                                                                return;
                                                            }
                                                            // if (e.key === 'Enter') {
                                                            //     if (categoryDidYouMean) {
                                                            //         const confirmed = window.confirm(`Did you mean "${categoryDidYouMean}"?`);
                                                            //         updateExpenseMutation({
                                                            //             expenseId: expense.expenseId,
                                                            //             categoryName: confirmed ? categoryDidYouMean : categoryInput
                                                            //         });
                                                            //         return;
                                                            //     }
                                                            //     updateExpenseMutation({
                                                            //         expenseId: expense.expenseId,
                                                            //         categoryName: categoryInput
                                                            //     });
                                                            // }
                                                        }}
                                                        style={{ position: 'relative', background: 'transparent' }}
                                                    />
                                                </div>
                                            ) : (
                                                expense.category?.categoryName ?? 'Uncategorized'
                                            )}
                                        </td>

                                        {/* Subcategory cell */}
                                        <td className='cell-r'>
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
                                                        {subcategoryInput}{subcategoryRemaining}
                                                    </div>
                                                    <input
                                                        className='form-control'
                                                        value={subcategoryInput}
                                                        onChange={(e) => {
                                                            setSubcategoryInputs((prev) => ({
                                                                ...prev, [expense.expenseId]: e.target.value
                                                            }));
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Tab' && subcategoryMatch) {
                                                                e.preventDefault();
                                                                setSubcategoryInputs((prev) => ({
                                                                    ...prev,
                                                                    [expense.expenseId]: subcategoryMatch.item
                                                                }));
                                                                return;
                                                            }
                                                            if (e.key === 'Enter') {
                                                                if (!categoryInput || !subcategoryInput) {
                                                                    window.alert("Please enter both a category and subcategory");
                                                                    return;
                                                                }
                                                                let finalCategoryName = categoryInput;
                                                                let finalSubcategoryName = subcategoryInput;
                                                                if (subcategoryDidYouMean || categoryDidYouMean) {
                                                                    const lines = [];
                                                                    if (categoryDidYouMean) lines.push(`Category: "${categoryDidYouMean}"`);
                                                                    if (subcategoryDidYouMean) lines.push(`Subcategory: "${subcategoryDidYouMean}"`);

                                                                    const confirmed = window.confirm(`Did you mean:\n${lines.join('\n')}?`);

                                                                    if (confirmed) {
                                                                        if (categoryDidYouMean) finalCategoryName = categoryDidYouMean;
                                                                        if (subcategoryDidYouMean) finalSubcategoryName = subcategoryDidYouMean;
                                                                    }
                                                                    updateExpenseMutation({
                                                                        expenseId: expense.expenseId,
                                                                        categoryName: finalCategoryName,
                                                                        subcategoryName: finalSubcategoryName
                                                                    });
                                                                    return;
                                                                }
                                                                updateExpenseMutation({
                                                                    expenseId: expense.expenseId,
                                                                    categoryName: finalCategoryName,
                                                                    subcategoryName: finalSubcategoryName
                                                                });
                                                            }
                                                        }}
                                                        style={{ position: 'relative', background: 'transparent' }}
                                                    />
                                                </div>
                                            ) : (
                                                expense.subcategory?.subcategoryName ?? 'Uncategorized'
                                            )}
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