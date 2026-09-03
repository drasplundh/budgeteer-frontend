import { useState } from 'react';

interface IncomeFormData {
  amount: number;
  date: string;
  vendor: string;
  category: string;
  subcategory: string;
}

interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => void;
}

function IncomeForm({ onSubmit }: IncomeFormProps) {
  const [incomeFormData, setIncomeFormData] = useState<IncomeFormData>({
    amount: 0,
    date: '',
    vendor: '',
    category: '',
    subcategory: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIncomeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(incomeFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="col">
        <label htmlFor="amount">Amount</label>
        <input
          className="form-control"
          type="number"
          id="amount"
          name="amount"
          value={incomeFormData.amount}
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
          value={incomeFormData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <input
          className="form-control"
          id="category"
          name="category"
          value={incomeFormData.category}
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
          value={incomeFormData.subcategory}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default IncomeForm;