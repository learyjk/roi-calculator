window.Webflow ||= [];
window.Webflow.push(() => {
  const SELECTORS = {
    INPUTS: '[calculator-input]',
    RESULTS: '[calculator-result]',
    VARIABLES: '[calculator-variable]',
  };

  const INPUTS_ATTR_NAMES = {
    HEADCOUNT: 'headcount',
    NUMBER_OF_REQUESTS_PER_YEAR: 'number-of-requests-per-year',
    COMPANY_REVENUE: 'company-revenue',
    INDIRECT_SPEND: 'indirect-spend',
    AVERAGE_SALARY: 'average-salary',
  };

  const VARIABLES_ATTR_NAMES = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
  };

  const RESULTS_ATTR_NAMES = {
    TOTAL_SAVINGS: 'total-savings',
    VALUE_OF_TIME_SAVED: 'value-of-time-saved',
    SAVINGS_FROM_NEGOTIATING: 'savings-from-negotiating',
    DAYS_SAVED_WAITING: 'days-saved-waiting',
    SUPPLY_CHAIN_RISK: 'supply-chain-risk',
  };

  const inputForm = document.querySelector<HTMLFormElement>(SELECTORS.INPUTS);
  const resultElements = document.querySelectorAll<HTMLDivElement>(SELECTORS.RESULTS);
  const variableElements = document.querySelectorAll<HTMLDivElement>(SELECTORS.VARIABLES);

  if (!inputForm || !resultElements || !variableElements) {
    console.error('No input form found');
    return;
  }

  console.log({ inputForm, resultElements, variableElements });

  const createInputObject = (inputForm: HTMLFormElement) => {
    const data = new FormData(inputForm);
    const inputMap = new Map();
    data.forEach((value, key) => {
      inputMap.set(key, Number(value));
    });
    return inputMap;
  };

  const createDataObject = (dataSource: NodeListOf<HTMLDivElement>, attributeName: string) => {
    const variablesObject = new Map();
    dataSource.forEach((variable) => {
      const variableName = variable.getAttribute(attributeName);
      const variableValue = Number(variable.textContent);
      variablesObject.set(variableName, variableValue);
    });
    return variablesObject;
  };

  let inputData = createInputObject(inputForm);
  const variablesObject = createDataObject(variableElements, 'calculator-variable');
  const resultsObject = createDataObject(resultElements, 'calculator-result');

  console.log({ inputData, variablesObject, resultsObject });

  const formatAsCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateResults = (
    inputData: Map<string, number>,
    variablesObject: Map<string, number>
  ) => {
    const results = new Map();
    const headcount = inputData.get(INPUTS_ATTR_NAMES.HEADCOUNT) || 0;
    const requestsPerYear = inputData.get(INPUTS_ATTR_NAMES.NUMBER_OF_REQUESTS_PER_YEAR) || 0;
    const companyRevenue = inputData.get(INPUTS_ATTR_NAMES.COMPANY_REVENUE) || 0;
    const indirectSpend = inputData.get(INPUTS_ATTR_NAMES.INDIRECT_SPEND) || 0;
    const averageSalary = inputData.get(INPUTS_ATTR_NAMES.AVERAGE_SALARY) || 0;

    const variableA = variablesObject.get(VARIABLES_ATTR_NAMES.A) || 0;
    const variableB = variablesObject.get(VARIABLES_ATTR_NAMES.B) || 0;
    const variableC = variablesObject.get(VARIABLES_ATTR_NAMES.C) || 0;
    const variableD = variablesObject.get(VARIABLES_ATTR_NAMES.D) || 0;
    const variableE = variablesObject.get(VARIABLES_ATTR_NAMES.E) || 0;
    const variableF = variablesObject.get(VARIABLES_ATTR_NAMES.F) || 0;
    const variableG = variablesObject.get(VARIABLES_ATTR_NAMES.G) || 0;

    // calulate results and set them in the results object
    const A1 = Math.ceil(requestsPerYear * variableA);
    results.set(RESULTS_ATTR_NAMES.VALUE_OF_TIME_SAVED, formatAsCurrency(A1));

    const B1 = Math.ceil(companyRevenue * (indirectSpend / 100) * variableB);
    results.set(RESULTS_ATTR_NAMES.SAVINGS_FROM_NEGOTIATING, formatAsCurrency(B1));

    const C1 = Math.ceil(headcount * variableC * (headcount / variableD) * variableE);
    results.set(RESULTS_ATTR_NAMES.DAYS_SAVED_WAITING, C1);

    const D1 = Math.ceil(headcount * variableF * variableG);
    results.set(RESULTS_ATTR_NAMES.SUPPLY_CHAIN_RISK, formatAsCurrency(D1));

    const E1 = Math.ceil(A1 + B1 + D1);
    results.set(RESULTS_ATTR_NAMES.TOTAL_SAVINGS, formatAsCurrency(E1));

    return results;
  };

  inputForm.addEventListener('input', () => {
    inputData = createInputObject(inputForm);

    console.log({ inputData, variablesObject, resultsObject });

    const results = calculateResults(inputData, variablesObject);
    console.log({ results });

    // Update results in the DOM.
    resultElements.forEach((result) => {
      const resultName = result.getAttribute('calculator-result');
      const resultValue = results.get(resultName);
      result.textContent = String(resultValue);
    });
  });
});
