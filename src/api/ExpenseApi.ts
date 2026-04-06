export const fetchExpenses = async () => {
  const response = await fetch('http://localhost:8080/expense/find-all');
//   console.log("response: ", response.json())
  const data = await response.json();  // wait for the body to be parsed

  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }

  return data;
};

export const updateExpense = async (updateCategoryRequest: {expenseId: Number, categoryName: String, subcategoryName?: String}) => {
    const response = await fetch(`http://localhost:8080/expense/update-category`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: updateCategoryRequest.expenseId,
            categoryName: updateCategoryRequest.categoryName,
            subCategoryName: updateCategoryRequest.subcategoryName
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to update expense');
    }
    return data;
};

export {}