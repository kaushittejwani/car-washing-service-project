import config from 'config';
import crypto from 'crypto';
import Path from 'path';

const encryption = config.get('encryption');
const saltLength = 9;

// Define Claim Error Messages
const claimStatusMessage = {
"1": "Your request could not be completed, seems your policy is inactive. Please contact our customer care for further assistance",            
"2": "Health checkup has already been availed for the selected member. Please correct and resubmit your request",   
"3": "Selected member is not valid. Please select an eligible member.",        
"4": "Consultation date shared is outside the policy period. Please correct and resubmit your request",           
"5": "Your request could not be processed, please check your policy eligibility limits",     
"6": "We are facing some issues, not able to complete the request as of now, please try after some time. In case you face the issue again, please contact our customer care for assistance.",          
"7": "We are facing some issues, not able to complete the request as of now, please try after some time. In case you face the issue again, please contact our customer care for assistance.",      
"8": "Your request could not be processed as of now, please try after some time. In case you face the issue again, please contact our customer care for assistance.",      
"9": "Your request could not be processed as of now, please try after some time. In case you face the issue again, please contact our customer care for assistance.",         
"10": "Your request could not be processed as of now, please try after some time. In case you face the issue again, please contact our customer care for assistance.",   
"11": "Future date of Invoice is not allowed for claim submission, please edit and submit your request again",      
"12": "Oops, Selected member is not eligible for this claim. Please select the eligible member",    
"13": "Your request could not be processed as of now, please try after some time.",         
"14": "Your request could not be processed as of now, please try after some time.",     
"15": "Your request could not be processed as of now, please try after some time.",         
"16": "Your request could not be processed, you have exceeded your eligible limit allowed as per the policy terms.",   
"17": "Your request could not be processed; Selected member has already availed or not eligible for this service. Please check your policy terms and conditions", 
"18": "Your request could not be processed; Selected member has already availed or not eligible for this service. Please check your policy terms and conditions",      
"19": "Your request could not be processed; Selected member has already availed or not eligible for this service. Please check your policy terms and conditions",
"20": "Your request could not be processed; Selected member has already availed or not eligible for this service.",
"21": "Your request could not be processed, Selected member is not eligible for this benefit" 
};

/**
 *
 *
 * @param {any} len
 * @returns
 */
const generateSalt = len => {
    const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    let salt = '';
    let p = 2;
    for (let i = 0; i < len; i += 1) {
        salt += set[p];
        p += 3;
    }
    return salt;
};


/**
 *
 *
 * @param {any} string
 * @returns
 */
const md5 = string => crypto.createHash('md5').update(string).digest('hex');


/**
 * @param  {} text
 */
const encryptString = text => {
    const cipher = crypto.createCipher(encryption.algorithm, encryption.password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};


const generate6DigitOTP = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

/**
 *
 *
 * @param {any} text
 * @returns
 */
const decryptString = function decrypt(text) {
    const decipher = crypto.createDecipher(encryption.algorithm, encryption.password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

/**
 * @param  {} text
 */
const encryptPass = text => {
    const salt = generateSalt(saltLength);
    const hash = md5(text + salt);
    return salt + hash;
};

/**
 * To generate any random number
 */
const generateOtp = () => Math.floor(Math.random() * ((9999 - 1000) + 1)) + 1000;

/**
 * Fetch root directory path
 */
const getRootDir = () => Path.normalize(`${__dirname}/../..`);

const dbValueSanitize = value => {
    return `'${value}'`;
};

const errorMailMsg = (reqType,policyNumber,policyDetail) => {
    return `Dear Team,
        For the below user having ${reqType} ${policyNumber} data is missing from CRM

        Data:${JSON.stringify(policyDetail)}`;
}


module.exports = {
    claimStatusMessage,
    generateOtp,
    getRootDir,
    encryptPass,
    encryptString,
    decryptString,
    dbValueSanitize,
    errorMailMsg,
    generate6DigitOTP
};