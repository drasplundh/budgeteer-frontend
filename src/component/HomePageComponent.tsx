import '../css/HomePage.css';
import { useQueries } from '@tanstack/react-query';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import ChartComponent from './ChartComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from 'react';

// TODO make the charts filterable by month or YTD

function HomePageComponent() {
    const [date, setDate] = useState(null)

    const [expensesQuery, categoriesQuery] = useQueries({
        queries: [
            { queryKey: ['expenses'], queryFn: fetchExpenses },
            { queryKey: ['categories'], queryFn: fetchCategories }
        ]
    });

    const [viewCategories, setViewCategories] = useState(false);
    const [viewSubcategories, setViewSubcategories] = useState(false);
    const [expandCategory, setExpandCategory] = useState<any | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const startDateInput = useRef<HTMLInputElement>(null);
    const endDateInput = useRef<HTMLInputElement>(null);

    function handleSubcategories() {
        setViewSubcategories(true);
        setViewCategories(false);
    }

    function handleCategories() {
        setViewSubcategories(false);
        setViewCategories(true);
    }

    function handleDateFilter() {
        setStartDate(startDateInput.current?.value || null);
        setEndDate(endDateInput.current?.value || null);
        console.log('start', startDate);
        console.log('end', endDate);
        
    }

    function resetDateFilter() {
        // setStartDateInput('');
        // setEndDateInput('');
        // setStartDate(null);
        // setEndDate(null);
    }



    if (expensesQuery.isLoading || categoriesQuery.isLoading) return <div>Loading...</div>;
    if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
    if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;

    // only access data after loading checks
    const expenses = expensesQuery.data;
    const categories = categoriesQuery.data;
    console.log('expenses', expenses);


    const totalCost = expenses.reduce((sum: Number, expense: any) => sum + expense.cost, 0).toFixed(2);



    return (
        <div className="container page-content">
            <div className="row h-100">



                {/* EXPENSE TABLE */}
                <div className="col expense-table pt d-flex flex-column">
                    <div className="row mb-2">
                        <div className='col-6 d-flex gap-2'>
                            <input className="form-control" type='text' placeholder='yyyy-mm-dd' ref={startDateInput}/>
                            <input className="form-control" type='text' placeholder='yyyy-mm-dd' ref={endDateInput}/>
                            <button className='btn custom-btn' onClick={handleDateFilter}>Enter</button>
                        </div>
                        <div className='col-3 d-flex center'>
                            <button className='btn custom-btn' onClick={resetDateFilter}>Reset</button>
                        </div>
                        <div className='col-3 d-flex'>
                            <button className='btn custom-btn'>Year to Date</button>
                        </div>
                    </div>
                    {/* <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                    /> */}
                    
                    <table className="table mb-0 table-head">
                        <thead>
                            <tr>
                                <th className='cell-l'>Vendor</th>
                                <th className='cell-r'>Cost</th>
                                <th className='cell-r'>Date</th>
                                {/* <th className='cell-r'>Category</th> */}
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
                                        {/* <td className='cell-r'>{expense.category?.categoryName ?? "no category"}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CHART/TOTAL */}
                <div className="col charts-col h-100 d-flex flex-column">
                    <div className='total-expense' style={{ flex: "0 0 10%" }}>
                        <h2>${totalCost}</h2> {/* this should probably change to accomodate different totals*/}
                    </div>
                    <div className="row selector-buttons">
                        <div className="col d-flex center">
                            <button className="btn custom-btn" onClick={handleSubcategories}>
                                All Subcategories
                            </button>
                        </div>
                        <div className="col d-flex center">
                            <button className="btn custom-btn" onClick={handleCategories}>
                                All Categories
                            </button>
                        </div>
                        <div className="col d-flex center">
                            {expandCategory && (
                                <button className="btn custom-btn" onClick={() => setExpandCategory(null)}>Back</button>
                            )}
                        </div>

                    </div>


                    <div className='charts' style={{ flex: 1, minHeight: 0 }}>
                        <ChartComponent dateFilterStartDate={startDate} dateFilterEndDate={endDate} setExpandCategory={setExpandCategory} expandCategory={expandCategory} showCategories={viewCategories} showSubcategories={viewSubcategories} />
                    </div>
                </div>
            </div>


        </div>
    )
}

export default HomePageComponent;