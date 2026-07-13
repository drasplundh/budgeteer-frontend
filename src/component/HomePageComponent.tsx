import '../css/HomePage.css';
import { useQueries } from '@tanstack/react-query';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import ChartComponent from './ChartComponent';
import { useState } from 'react';

// TODO make the charts filterable by month or YTD

function HomePageComponent() {

const [expensesQuery, categoriesQuery] = useQueries({
    queries: [
        { queryKey: ['expenses'], queryFn: fetchExpenses },
        { queryKey: ['categories'], queryFn: fetchCategories }
    ]
});

const [toggleCategories, setToggleCategories] = useState(false);
function handleToggle() {
    setToggleCategories(prev => !prev);
}




if (expensesQuery.isLoading || categoriesQuery.isLoading) return <div>Loading...</div>;
if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;

// only access data after loading checks
const expenses = expensesQuery.data;
const categories = categoriesQuery.data;
console.log(expenses);


    const totalCost = expenses.reduce((sum: Number, expense: any) => sum + expense.cost, 0);




    return (
        <div className="container page-content">
            <div className="row h-100">

                {/* EXPENSE TABLE */}
                <div className="col expense-table pt d-flex flex-column">
                    <table className="table mb-0 table-head">
                        <thead>
                            <tr>
                                <th className='cell-l'>Vendor</th>
                                <th className='cell-r'>Cost</th>
                                <th className='cell-r'>Date</th>
                                <th className='cell-r'>Category</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="table-scroll" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                        <table className='table table-body'>
                            <tbody>
                                {expenses.map((expense: any) => (
                                    <tr>
                                        {/* <td className="vendor-cell">{expense.vendor}</td> */}
                                        <td className="vendor-cell cell-l" data-bs-toggle="tooltip" title={expense.vendor}>
                                            {expense.vendor}
                                        </td>
                                        <td className={expense.cost > 200 ? 'expensive cell-r' : 'cell-r'}>
                                            {expense.cost}
                                        </td>
                                        {/* <td>{expense.cost}</td> */}
                                        <td className='cell-r'>{expense.date}</td>
                                        <td className='cell-r'>{expense.category?.categoryName ?? "no category"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CHART/TOTAL */}
                <div className="col charts-col h-100 d-flex flex-column">
                    <div className='total-expense' style={{ flex: "0 0 10%" }}>
                        <h2>${totalCost}</h2>
                    </div>
                    <button className="custom-btn" onClick={handleToggle}>
                        {toggleCategories ? 'Categories' : 'Subcategories'}
                    </button>

                    <div className='charts' style={{ flex: 1, minHeight: 0 }}>
                        <ChartComponent showCategories={toggleCategories}/>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default HomePageComponent;