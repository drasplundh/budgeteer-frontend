export const fetchCategories = async () => {
  const response = await fetch('http://localhost:8080/category/find-all');
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }

  return data;
};

export {}