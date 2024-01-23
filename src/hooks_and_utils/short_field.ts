

const shortField = (value: string): string =>
    value.length > 20 ? value.slice(0, 20) + '...' : value;


export default shortField;