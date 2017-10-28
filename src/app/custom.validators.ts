import { FormControl } from '@angular/forms';

export class CustomValidators {

    // Validation - If user has made no selection on dropdowns
    static selectionRequired(control: FormControl):{[s: string]: boolean} {
        if(control.value == 'NONE'){
            return {'invalidSelection' : true}
        }
        return null
    }

    // Validation - If user has checked checkbox
    static validateCheckbox(control: FormControl):{[s: string]: boolean} {
        if(control.value !== true){
            return {'invalidSelection' : true}
        }
        return null
    }

    // Validation - Validate Srilankan nic number, example: 12345679V
    static validateNic(control: FormControl):{[s: string]: boolean} {
        const value = control.value;
        if(value && value.length > 10) {
            return {'exceedMax' : true}
        }
        let nicRegex = new RegExp("[0-9]{9}[x|X|v|V]$");
        let pass = nicRegex.test(value);
        if(pass != true) {
            return {'lastChar' : true}
        }
        return null
    }

    // Validation - Validate Srilankan nic number, example: 12345679V
    static validatePhoneNumber(control: FormControl):{[s: string]: boolean} {
        const value = control.value;
        if(value && value.length < 10) {
            return {'lessThanMin' : true}
        }
        if(value && value.length > 10) {
            return {'exceedMax' : true}
        }
        let pass = /^\d+$/.test(value);
        if(pass != true) {
            return {'alphaNumeric' : true}
        }
        return null
    }

    // Validation - Validate year
    static validateYear(control: FormControl):{[s: string]: boolean} {
        const value = control.value;
        if(value && value.length < 4) {
            return {'lessThanMin' : true}
        }
        if(value && value.length > 4) {
            return {'exceedMax' : true}
        }
        let pass = /^\d+$/.test(value);
        if(pass != true) {
            return {'alphaNumeric' : true}
        }
        return null
    }
}