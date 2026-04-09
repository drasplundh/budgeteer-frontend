import '../css/NavBar.css';
import { FaBell, FaBellSlash } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query';
import { fetchExpenses } from '../api/ExpenseApi';
import { useNavigate } from 'react-router-dom';


const Bell = FaBell as React.ElementType;
const AlertBell = FaBellSlash as React.ElementType;



function NavBar() {

    const navigate = useNavigate();
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['expenses'],
        queryFn: fetchExpenses
    });

    // const uncategorized = data.filter((expense: any) => expense.category === null);
    // const notifications = uncategorized.length;

    return (
        <div className='nav-container'>
            <div className='row cust-row'>
                <div className='col ms-3 d-flex'>
                    <h2 onClick={() => navigate('/')}>Budgeteer</h2>
                    {/* <h2 onClick>Categorize</h2> */}
                </div>

                <div className='col center right d-flex'>
                    <h3 onClick={() => navigate('/manual-entry')}>Manual Entry</h3>
                </div>
                <div className='col center left d-flex'>
                    <h3 onClick={() => navigate('/categorize')}>Categorize</h3>
                </div>
            </div>
        </div>
    )
}

export default NavBar;