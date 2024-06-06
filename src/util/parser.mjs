// a function that takes in a string representing a PHP serialised object and returns a JavaScript object
// Based on code from https://github.com/bd808/php-unserialize-js/blob/main/phpUnserialize.js
/**
 * Parses serialized PHP data and converts it into JavaScript objects.
 *
 * @param {string} serialisedData - The serialized PHP data to be parsed.
 * @returns {any} - The parsed JavaScript object.
 */
export function unserialisePhpData(serialisedData) {
  const referenceStack = [];
  let currentDataPosition = 0;
  let referenceStackIndex = 0;

  const readLength = () => {
    const delimiterIndex = serialisedData.indexOf(":", currentDataPosition);
    const value = serialisedData.substring(currentDataPosition, delimiterIndex);
    currentDataPosition = delimiterIndex + 2;
    return parseInt(value, 10);
  };

  const readInt = () => {
    const delimiterIndex = serialisedData.indexOf(";", currentDataPosition);
    const value = serialisedData.slice(currentDataPosition, delimiterIndex);
    currentDataPosition = delimiterIndex + 1;
    return Number(value);
  };

  const parseAsInt = () => {
    const value = readInt();
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const parseAsFloat = () => {
    const delimiterIndex = serialisedData.indexOf(";", currentDataPosition);
    const value = parseFloat(
      serialisedData.slice(currentDataPosition, delimiterIndex)
    );
    currentDataPosition = delimiterIndex + 1;
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const parseAsBoolean = () => {
    const delimiterIndex = serialisedData.indexOf(";", currentDataPosition);
    const value =
      serialisedData.slice(currentDataPosition, delimiterIndex) === "1";
    currentDataPosition = delimiterIndex + 1;
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const readString = (expectedDelimiter = '"') => {
    const expectedLength = readLength();
    let utf8Length = 0;
    let byteCount = 0;

    while (byteCount < expectedLength) {
      const currentChar = serialisedData.charCodeAt(
        currentDataPosition + utf8Length++
      );
      byteCount += currentChar <= 0x007f ? 1 : currentChar > 0x07ff ? 3 : 2;
    }

    // catch non-compliant utf8 encodings
    if (
      serialisedData.charAt(currentDataPosition + utf8Length) !==
      expectedDelimiter
    ) {
      utf8Length +=
        serialisedData.indexOf(
          expectedDelimiter,
          currentDataPosition + utf8Length
        ) -
        currentDataPosition -
        utf8Length;
    }

    const value = serialisedData.slice(
      currentDataPosition,
      currentDataPosition + utf8Length
    );
    currentDataPosition += utf8Length + 2;
    return value;
  };

  const parseAsString = () => {
    const value = readString();
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const readDataType = () => {
    const type = serialisedData.charAt(currentDataPosition);
    currentDataPosition += 2;
    return type;
  };

  const readTypeKey = () => {
    const type = readDataType();
    const typeMap = {
      i: readInt,
      s: readString,
    };

    const parser = typeMap[type];
    if (!parser) {
      const msg = `Unknown key type '${type}' at position ${currentDataPosition - 2}`;
      throw new Error(msg);
    }

    return parser();
  };

  const parseAsArray = () => {
    const resultLength = readLength();
    const resultArray = [];
    const stackIndexReference = referenceStackIndex++;
    let resultHash = {};
    let currentResult = resultArray;

    referenceStack[stackIndexReference] = currentResult;

    try {
      for (let i = 0; i < resultLength; i++) {
        const key = readTypeKey();
        let value = parseNext();

        if (currentResult === resultArray && key === i) {
          resultArray.push(value);
          continue;
        }

        if (currentResult !== resultHash) {
          resultHash = Object.assign(
            {},
            ...resultArray.map((val, index) => ({ [index]: val }))
          );
          currentResult = resultHash;
          referenceStack[stackIndexReference] = currentResult;
        }

        if (Array.isArray(value) && value.length === 1) {
          [value] = value;
        }

        resultHash[key] = value;
      }
    } catch (e) {
      e.state = currentResult;
      throw e;
    }

    currentDataPosition++;
    return currentResult;
  };

  const fixPropertyName = (parsedPropertyName, baseClassName) => {
    if (
      typeof parsedPropertyName === "string" &&
      parsedPropertyName.startsWith("\u0000")
    ) {
      const [className, propertyName] = parsedPropertyName
        .split("\u0000")
        .slice(1);

      return className === "*" || baseClassName === className
        ? propertyName
        : className
          ? `${className}::${propertyName}`
          : (() => {
              const errorMessage = `Expected two <NUL> characters in non-public property name '${parsedPropertyName}' at position ${currentDataPosition - parsedPropertyName.length - 2}`;
              throw new Error(errorMessage);
            })();
    }

    return parsedPropertyName;
  };

  const parseAsObject = () => {
    const obj = {};
    const stackIndexReference = referenceStackIndex++;
    const className = readString();

    referenceStack[stackIndexReference] = obj;
    const len = readLength();

    try {
      for (let i = 0; i < len; i++) {
        const key = fixPropertyName(readTypeKey(), className);
        const value = parseNext();
        obj[key] = value;
      }
    } catch (e) {
      // decorate exception with current state
      e.state = obj;
      throw e;
    }

    currentDataPosition++;
    return obj;
  };

  const parseAsCustom = () => {
    const parsedClassName = readString();
    const content = readString("}");
    // There is no char after the closing quote
    currentDataPosition--;
    return {
      __PHP_Incomplete_Class_Name: parsedClassName,
      serialized: content,
    };
  };

  const parseAsRefValue = () => {
    const ref = readInt();
    // php's ref counter is 1-based; our stack is 0-based.
    const value = referenceStack[ref - 1];
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const parseAsRef = () => {
    const ref = readInt();
    // php's ref counter is 1-based; our stack is 0-based.
    return referenceStack[ref - 1];
  };

  const parseAsNull = () => {
    const value = null;
    referenceStack[referenceStackIndex++] = value;
    return value;
  };

  const parseNext = () => {
    const type = readDataType();
    const typeMap = {
      i: parseAsInt,
      d: parseAsFloat,
      b: parseAsBoolean,
      s: parseAsString,
      a: parseAsArray,
      O: parseAsObject,
      C: parseAsCustom,
      E: parseAsString,
      r: parseAsRefValue,
      R: parseAsRef,
      N: parseAsNull,
    };

    const parser = typeMap[type];
    if (!parser) {
      const msg = `Unknown type '${type}' at position ${currentDataPosition - 2}`;
      throw new Error(msg);
    }

    return parser();
  };

  return parseNext();
}
