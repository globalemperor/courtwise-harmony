
/**
 * Utility functions to validate various government ID formats
 */

// Helper to ensure all alphabets are uppercase
export const toUpperAlphabet = (value: string): string => {
  return value.replace(/[a-z]/g, match => match.toUpperCase());
};

// Check if Aadhar Card format is valid (12 digits)
export const isValidAadhar = (value: string): boolean => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(value);
};

// Check if Passport format is valid (1 letter followed by 7 digits)
export const isValidPassport = (value: string): boolean => {
  const passportRegex = /^[A-Z]\d{7}$/;
  return passportRegex.test(value);
};

// Check if Driving License format is valid (SS-RR-YYYY-NNNNNNN)
export const isValidDrivingLicense = (value: string): boolean => {
  const dlRegex = /^[A-Z]{2}-[A-Z0-9]{2}-\d{4}-\d{7}$/;
  return dlRegex.test(value);
};

// Check if Voter ID format is valid (3 letters followed by 7 numbers)
export const isValidVoterId = (value: string): boolean => {
  const voterIdRegex = /^[A-Z]{3}\d{7}$/;
  return voterIdRegex.test(value);
};

// Check if PAN format is valid (5 letters, 4 digits, 1 letter)
export const isValidPAN = (value: string): boolean => {
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
  return panRegex.test(value);
};

// Check if Lawyer Bar ID is valid (ST/Year/Number format)
export const isValidBarId = (value: string): boolean => {
  const barIdRegex = /^[A-Z]{2}\/\d{4}\/\d{1,6}$/;
  return barIdRegex.test(value);
};

// Validate government ID based on type
export const validateGovernmentId = (type: string, value: string): { isValid: boolean; message: string } => {
  const formattedValue = toUpperAlphabet(value);
  
  switch (type) {
    case 'aadhar':
      return {
        isValid: isValidAadhar(formattedValue),
        message: isValidAadhar(formattedValue) ? '' : 'Aadhar must be exactly 12 digits'
      };
    case 'passport':
      return {
        isValid: isValidPassport(formattedValue),
        message: isValidPassport(formattedValue) ? '' : 'Passport must be 1 letter followed by 7 digits'
      };
    case 'driving-license':
      return {
        isValid: isValidDrivingLicense(formattedValue),
        message: isValidDrivingLicense(formattedValue) ? '' : 'Format must be SS-RR-YYYY-NNNNNNN'
      };
    case 'voter-id':
      return {
        isValid: isValidVoterId(formattedValue),
        message: isValidVoterId(formattedValue) ? '' : 'Voter ID must be 3 letters followed by 7 digits'
      };
    case 'pan':
      return {
        isValid: isValidPAN(formattedValue),
        message: isValidPAN(formattedValue) ? '' : 'PAN must be in the format AAAAA0000A'
      };
    case 'other':
      return {
        isValid: value.length > 3,
        message: value.length > 3 ? '' : 'ID must be at least 4 characters'
      };
    default:
      return { isValid: false, message: 'Invalid ID type' };
  }
};

// Get format instructions for government IDs
export const getIdFormatInstructions = (type: string): string => {
  switch (type) {
    case 'aadhar':
      return 'Enter 12 digits (e.g., 123456789012)';
    case 'passport':
      return 'Enter 1 letter followed by 7 digits (e.g., A1234567)';
    case 'driving-license':
      return 'Format: SS-RR-YYYY-NNNNNNN (e.g., KA-01-2020-1234567)';
    case 'voter-id':
      return 'Enter 3 letters followed by 7 digits (e.g., ABC1234567)';
    case 'pan':
      return 'Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)';
    case 'other':
      return 'Enter your ID number';
    default:
      return '';
  }
};

// Get format instructions for lawyer bar ID
export const getBarIdFormatInstructions = (): string => {
  return 'Format: ST/YYYY/NUMBER (e.g., KA/2020/12345)';
};
