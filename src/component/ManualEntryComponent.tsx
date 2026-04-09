import '../css/ManualEntry.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense } from '../api/ExpenseApi';
import { useState } from 'react'




function ManualEntry() {

    const [formData, setFormData] = useState({
        cost: "",
        date: "",
        vendor: "",
        category: "",
        subcategory: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Expense submitted:", formData);
        // Here you can call an API or update state
    };

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
        <div className='container small-container'>
            <div className='row p-3'>
                <form onSubmit={handleSubmit}>
                    <div className='col'>
                        <label htmlFor="cost">Cost</label>
                        <input className='form-control'
                            type="number"
                            id="cost"
                            name="cost"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='col'>
                        <label htmlFor="date">Date</label>
                        <input className='form-control'
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="vendor">Vendor</label>
                        <input className='form-control'
                            type="text"
                            id="vendor"
                            name="vendor"
                            value={formData.vendor}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <input className='form-control'
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="subcategory">Subcategory</label>
                        <input className='form-control'
                            type="text"
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                        />
                    </div>

                    <button className='btn btn-primary' type="submit">Add Expense</button>
                </form>
            </div>

        </div>


    )

}

export default ManualEntry;