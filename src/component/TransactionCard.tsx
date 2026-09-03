import '../css/TransactionCard.css';
import { IIncome } from '../model/Income';
import { IExpense } from '../model/Expense';
import { dateFormat } from '../util/DateFormatter';

interface TransactionCardProps {
    transaction: IExpense | IIncome;
}

function TransactionCard({ transaction }: TransactionCardProps) {

    return (
        <div className="transaction-card">
            <div className='row d-flex transaction-card-header'>
                {"vendor" in transaction && (
                    <p className='text'>{transaction.vendor}</p>
                )}
                {"amount" in transaction && (
                    <p className='text'>{transaction.subcategory?.category.categoryName}</p>
                )}
            </div>
            <div className='row d-flex'>
                <div className='col-6 d-flex align-left info-label'>
                    <p className='text'>Date</p>
                </div>
                <div className="col-6 d-flex align-right">
                    <p className='text pe-2'>{dateFormat(transaction.date)}</p>
                </div>
                <div className='col-6 d-flex align-left info-label'>
                    {"amount" in transaction && (
                        <p className='text'>Amount</p>
                    )}
                    {"cost" in transaction && (
                        <p className='text'>Cost</p>

                    )}
                </div>
                <div className='col-6 d-flex align-right'>
                    {"amount" in transaction ? (
                        <p className='text'>${transaction.amount}</p>
                    ) : (
                        <p className='text'>${transaction.cost}</p>
                    )}
                    <p className='text pe-2'></p>
                </div>
                <div className='col-6 d-flex align-left info-label'>
                    <p className='text'>User</p>
                </div>
                <div className='col-6 d-flex align-right'>
                    <p className='text pe-2'>{transaction.user}</p>
                </div>
            </div>

        </div>
    )
}

export default TransactionCard;