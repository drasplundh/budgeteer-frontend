import '../css/HomePage.css';
import { useQueries } from '@tanstack/react-query';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import { fetchIncome } from '../api/IncomeApi';
import ChartComponent from './ChartComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from 'react';
import TransactionCard from './TransactionCard';
import { IIncome } from '../model/Income';
import { IExpense } from '../model/Expense';
import { dateToIso } from '../util/DateFormatter';

// TODO make the charts filterable by month or YTD

function HomePageComponent() {
    const [date, setDate] = useState(null)

    const [expensesQuery, categoriesQuery, incomeQuery] = useQueries({
        queries: [
            { queryKey: ['expenses'], queryFn: fetchExpenses },
            { queryKey: ['categories'], queryFn: fetchCategories },
            { queryKey: ['income'], queryFn: fetchIncome }
        ]
    });

    const [viewCategories, setViewCategories] = useState(false);
    const [viewSubcategories, setViewSubcategories] = useState(false);
    const [expandCategory, setExpandCategory] = useState<any | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selected, setSelected] = useState('');
    const startDateInput = useRef<HTMLInputElement>(null);
    const endDateInput = useRef<HTMLInputElement>(null);
    const [isIncome, setIsIncome] = useState<boolean>(false);

    function handleSubcategories() {
        setViewSubcategories(true);
        setViewCategories(false);
        setSelected('subcategories');
    }

    function handleCategories() {
        setViewSubcategories(false);
        setViewCategories(true);
        setSelected('categories');
    }

    function handleDateFilter() {
        let startDateString = dateToIso(startDateInput.current?.value);
        let endDateString = dateToIso(endDateInput.current?.value);
        setStartDate(startDateString || null);
        setEndDate(endDateString || null);
        console.log('start', startDate);
        console.log('end', endDate);
    }

    function resetDateFilter() {
        setStartDate(null);
        setEndDate(null);
    }

    function handleIsIncome() {
        setIsIncome((prev) => !prev);
        console.log("isIncome", isIncome);
    }

    function formatDateInput(value) {
        // strip non-digits
        let digits = value.replace(/\D/g, '');
        // limit to 6 digits total (mmddyy)
        digits = digits.slice(0, 6);

        let formatted = digits;
        if (digits.length > 2) {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        }
        if (digits.length > 4) {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
        }
        return formatted;
    }

    function handleDateChange(e) {
        const cursorWasAtEnd = e.target.selectionStart === e.target.value.length;
        e.target.value = formatDateInput(e.target.value);
        if (cursorWasAtEnd) {
            // keep cursor at end after we mutate the value
            e.target.setSelectionRange(e.target.value.length, e.target.value.length);
        }
    }



    if (expensesQuery.isLoading || categoriesQuery.isLoading) return <div>Loading...</div>;
    if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
    if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;
    if (incomeQuery.isError) return <div>Income Error: {(incomeQuery.error as Error).message}</div>;

    // only access data after loading checks
    const expenses = expensesQuery.data;
    const categories = categoriesQuery.data;
    const income = incomeQuery.data;
    console.log('expenses', expenses);
    console.log('income', income);


    const totalCost = expenses.reduce((sum: Number, expense: any) => sum + expense.cost, 0).toFixed(2);
    const totalIncome = income.reduce((sum: number, income: any) => sum + income.amount, 0).toFixed(2);



    return (
        <div className="container page-content">
            <div className="row h-100 d-flex g-3">
                {/* EXPENSE TABLE */}
                <div className="col-4 d-flex flex-column scroll-pane-container">
                    <div className='d-flex scroll-pane-header center'>
                        <h3>{isIncome ? "Income" : "Expenses"}</h3>
                    </div>
                    <div className='transaction-scroll-pane'>
                        {isIncome ?
                            income.map((income: IIncome) => (
                                <TransactionCard key={income.incomeId} transaction={income} />
                            ))
                            :
                            expenses.map((expense: IExpense) => (
                                <TransactionCard key={expense.expenseId} transaction={expense} />
                            ))
                        }
                    </div>
                </div>

                {/* <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                    /> */}


                {/* CHART Section */}
                <div className="col-5 charts-col h-100 d-flex flex-column">

                    <div className='charts d-flex center' style={{ flex: 1, minHeight: 0 }}>
                        <ChartComponent isIncome={isIncome} dateFilterStartDate={startDate} dateFilterEndDate={endDate} setExpandCategory={setExpandCategory} expandCategory={expandCategory} showCategories={viewCategories} showSubcategories={viewSubcategories} />
                    </div>
                </div>

                {/* Button and Reads */}
                <div className="col-3 control-container d-flex flex-column">
                    <div className='date-range-header d-flex center'>
                        {startDate && endDate ? (
                            <p>{startDate} {endDate}</p>
                        ):(
                        <h3>Year-to-date</h3>
                            
                        )}
                    </div>
                    <div className='d-flex center'>
                        {!isIncome ? (
                            // render expenses
                            <div className='d-flex total-expense center' style={{ flex: "0 0 10%" }}>
                                <h2 className='neg'>${totalCost}</h2> {/* this should probably change to accomodate different totals*/}
                            </div>
                        ) : (
                            // render income
                            <div className='d-flex month-diff center' style={{ flex: "0 0 10%" }}>
                                <h2 className='pos'>${totalIncome}</h2>
                            </div>
                        )}
                    </div>
                    <div className='d-flex center'>
                        <button className='btn custom-btn' onClick={handleIsIncome}>{isIncome === true ? "View Expenses" : "View Income"}</button>
                    </div>
                    {/* <div className="d-flex center">
                            {expandCategory && (
                                <button className="btn custom-btn" onClick={() => setExpandCategory(null)}>Back</button>
                            )}
                        </div> */}

                    <div className='d-flex center filter'>
                        <p>Filters</p>
                    </div>
                    <div className='row d-flex'>
                        <div className='col-5'>
                            <input className="form-control" type='text' onChange={handleDateChange} placeholder='mm/dd/yy' ref={startDateInput} />
                        </div>
                        <div className='col-2'>
                            <p>To</p></div>
                        <div className='col-5'>
                            <input className="form-control" type='text' onChange={handleDateChange} placeholder='mm/dd/yy' ref={endDateInput} />
                        </div>
                        <div className='d-flex'>
                            <div className='col-6 d-flex center'>
                                <button className='btn custom-btn' onClick={handleDateFilter}>Enter</button>
                            </div>
                            <div className='col-6 d-flex center'>
                                <button className='btn custom-btn' onClick={resetDateFilter}>YTD</button>
                            </div>
                        </div>
                        <div className='d-flex'>
                            <select className="form-select" aria-label="Select person">
                                <option selected>Choose a person...</option>
                                <option value="1">Alice</option>
                                <option value="2">Bob</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageComponent;