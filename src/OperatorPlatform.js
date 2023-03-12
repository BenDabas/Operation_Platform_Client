import React, { useState } from 'react';
import axios from 'axios';

const apiOperationBaseUrl = 'https://localhost:44304/Operation/';

const OperatorPlatform = () => {
  const [inputOneValue, setInputOneValue] = useState('');
  const [inputTwoValue, setInputTwoValue] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [result, setResult] = useState(null);
  const [lastThreeOperations, setLastThreeOperation] = useState(null);
  const [thisMonthOperationsCount, setThisMonthOperationsCount] =
    useState(null);
  const [aggregate, setAggregate] = useState(null);

  const handleFirstInput = (event) => {
    setResult(null);
    setInputOneValue(event.target.value);
  };

  const handleSecondInput = (event) => {
    setResult(null);
    setInputTwoValue(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setResult(null);
    setSelectedOperator(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    SendData();
  };

  const SendData = async () => {
    if (selectedOperator === '') return;
    await getOperationResult();
    await getLastThreeOperations();
    await getCountOfSameTypeOperationsFromStartOfMonth();
    await getAggregateDataForSameTypeOperation();
  };

  const getOperationResult = async () => {
    var data = {
      firstField: inputOneValue,
      secondField: inputTwoValue,
      operator: selectedOperator,
    };
    try {
      var response = await axios.post(
        apiOperationBaseUrl + 'AddOperation',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLastThreeOperations = async () => {
    try {
      var response = await axios.get(
        apiOperationBaseUrl + `GetLastThree/${selectedOperator}`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      setLastThreeOperation(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCountOfSameTypeOperationsFromStartOfMonth = async () => {
    try {
      var response = await axios.get(
        apiOperationBaseUrl + `GetThisMonthCount/${selectedOperator}`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      setThisMonthOperationsCount(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAggregateDataForSameTypeOperation = async () => {
    try {
      if (selectedOperator === 'Concatenation') {
        setAggregate(null);
        return;
      }

      var response = await axios.get(
        apiOperationBaseUrl + `GetAggregate/${selectedOperator}`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      setAggregate(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderOperationResult = () => {
    return (
      <div>
        Result:{' '}
        {`${inputOneValue} ${selectedOperator} ${inputTwoValue} = ${result} `}
      </div>
    );
  };

  const renderLastThreeOperations = () => {
    return (
      <div>
        {`Last 3 operation with operator ${lastThreeOperations[0].operator}: `}
        {lastThreeOperations.map((operation) => {
          return (
            <div key={operation.id}>
              {`${operation.firstField} ${operation.operator} ${operation.secondField} = ${operation.result}`}
            </div>
          );
        })}
      </div>
    );
  };

  const renderThisMonthOperationsCount = () => {
    return (
      <div>{`The number of operations with the ${selectedOperator} operation from the beginning of month is :${thisMonthOperationsCount}`}</div>
    );
  };

  const renderAggregate = () => {
    return (
      <div>
        <label>{`Max: ${aggregate.max}`}</label>
        <br />
        <label>{`Min: ${aggregate.min}`}</label>
        <br />
        <label>{`Avg: ${aggregate.average}`}</label>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Input 1:
          <input
            type="text"
            value={inputOneValue}
            onChange={handleFirstInput}
          />
        </label>
        <br />
        <label>
          Select operator:
          <select value={selectedOperator} onChange={handleDropdownChange}>
            <option value=""></option>
            <option value="Plus">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="Divide">/</option>
            <option value="Concatenation">Concatenation</option>
          </select>
        </label>
        <br />
        <label>
          Input 2:
          <input
            type="text"
            value={inputTwoValue}
            onChange={handleSecondInput}
          />
        </label>
        <br />
        <button type="submit">Calculate</button>
      </form>
      <br />
      {result && renderOperationResult()}
      <br />
      {result && lastThreeOperations && renderLastThreeOperations()}
      <br />
      {result && thisMonthOperationsCount && renderThisMonthOperationsCount()}
      <br />
      {result && aggregate && renderAggregate()}
    </div>
  );
};

export default OperatorPlatform;
