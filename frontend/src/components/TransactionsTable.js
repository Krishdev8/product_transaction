import React, { useState, useEffect } from 'react';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  let fetchData = async (page) => {
    const response = await fetch(
      `http://localhost:5000/api/products/transactions?page=${page}`
    );
    const Fdata = await response.json();
    setTransactions(Fdata.transactions);
  };

  // Fetch data whenever the page state changes
  useEffect(() => {
    fetchData(page);
  }, [page]);

  const previousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // Decrement the page
    }
  };

  const nextPage = () => {
    if (page < 6) {
      setPage((prevPage) => prevPage + 1); // Increment the page
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  const buttonStyle = {
    backgroundColor: '#f0c14b',
    border: 'none',
    color: 'black',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center' }}>Transaction Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input type="text" placeholder="Search transaction" style={{ padding: '10px', width: '200px' }} />
        <select style={buttonStyle}>
          <option>Select Month</option>
          {/* Add month options here */}
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Title</th>
            <th style={cellStyle}>Description</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Sold</th>
            <th style={cellStyle}>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td style={cellStyle}>{transaction.id}</td>
              <td style={cellStyle}>{transaction.title}</td>
              <td style={cellStyle}>{transaction.description}</td>
              <td style={cellStyle}>{transaction.price}</td>
              <td style={cellStyle}>{transaction.category}</td>
              <td style={cellStyle}>{transaction.sold}</td>
              <td style={cellStyle}>{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>Page No: {page}</div>
        <div>
          <button onClick={previousPage} style={buttonStyle}>Previous</button>
          <button onClick={nextPage} style={buttonStyle}>Next</button>
        </div>
        <div>Per Page: 10</div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
