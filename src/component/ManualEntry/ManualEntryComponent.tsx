import '../../css/ManualEntry.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, updateExpense, createExpense } from '../../api/ExpenseApi';
import { fetchIncome, createIncome } from '../../api/IncomeApi';
import { useState } from 'react'
import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";
import Toast from "../../util/Toast";




function ManualEntry() {

    const [selected, setSelected] = useState<string>('expense');

    const [expenseFormData, setExpenseFormData] = useState({
        cost: 0,
        date: "",
        vendor: "",
        category: "",
        subcategory: ""
    });
    const [incomeFormData, setIncomeFormData] = useState({
        amount:"",
        date: "",
        category: "",
        subcategory: ""
    });


const [showToast, setShowToast] = useState(false);


    const queryClient = useQueryClient();

    const { mutate: updateExpenseMutation } = useMutation({
        mutationFn: (updateCategoryRequest: { expenseId: number, categoryName: string, subcategoryName?: string }) =>
            updateExpense(updateCategoryRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })

        }
    });


    const { mutate: createExpenseMutation } = useMutation({
    mutationFn: (createExpenseRequest: { vendor: string, cost: number, date: string, category: string, subcategory: string }) =>
        createExpense(createExpenseRequest),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
        setExpenseFormData({
        cost: 0,
        date: "",
        vendor: "",
        category: "",
        subcategory: ""
        })
    }
    });

    const { mutate: createIncomeMutation } = useMutation({
        mutationFn: (createIncomeRequest: {amount: number, date: string, category: string, subcategory: string }) =>
            createIncome(createIncomeRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['income'] });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        }
    })

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



    return (
        <div className='container small-container'>
            <Toast message={selected === 'expense' ? "Expense added successfully!" : "Income added Successfully!"} show={showToast} />
            <div className="row p-3 d-flex center form-selector mb-3">
                <div className="col-6">
                    <button className={selected === 'income' ? "btn custom-btn income-form btn-selected" : "btn custom-btn income-form"}
                    onClick={() => setSelected('income')}>Income</button>
                </div>
                <div className="col-6">
                    <button className={selected === 'expense' ? "btn custom-btn income-form btn-selected" : "btn custom-btn income-form"}
                    onClick={() => setSelected('expense')}>
                    Expense</button>
                </div>
            </div>
            <div className='row p-3 form-container'>
                    {selected === 'expense' ? (
                    <ExpenseForm
                        onSubmit={(data) => {
                            console.log(data);
                        createExpenseMutation(data);
                        }}
                    />
                    ) : (
                    <IncomeForm
                        onSubmit={(data) => {
                        console.log('new income', data);
                        createIncomeMutation(data);
                        }}
                    />
                    )}

                    {/* <button className='btn btn-primary' type="submit">Add Expense</button> */}
            </div>
        </div>


    )

}

export default ManualEntry;