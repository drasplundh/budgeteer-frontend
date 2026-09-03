import { useState } from 'react';

interface ExpenseFormData {
  cost: number;
  date: string;
  vendor: string;
  category: string;
  subcategory: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}

function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormData>({
    cost: 0,
    date: '',
    vendor: '',
    category: '',
    subcategory: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenseFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(expenseFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="col">
        <label htmlFor="cost">Cost</label>
        <input
          className="form-control"
          type="number"
          id="cost"
          name="cost"
          value={expenseFormData.cost}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col">
        <label htmlFor="date">Date</label>
        <input
          className="form-control"
          type="date"
          id="date"
          name="date"
          value={expenseFormData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="vendor">Vendor</label>
        <input
          className="form-control"
          type="text"
          id="vendor"
          name="vendor"
          value={expenseFormData.vendor}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <input
          className="form-control"
          type="text"
          id="category"
          name="category"
          value={expenseFormData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="subcategory">Subcategory</label>
        <input
          className="form-control"
          type="text"
          id="subcategory"
          name="subcategory"
          value={expenseFormData.subcategory}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ExpenseForm;